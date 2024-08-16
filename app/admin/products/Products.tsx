'use client'
import { useState } from 'react';
import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useForm, ValidationRule } from 'react-hook-form';

const fetcher = async (url: string): Promise<Product[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function Products() {
  const router = useRouter();

  // State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'Create' | 'Update'>('Create');
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);

  // SWR hook for fetching products
  const { data: products, error } = useSWR<Product[]>('/api/admin/products', fetcher);

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    '/api/admin/products',
    async (url, { arg }: { arg: FormData }) => {
      console.log('Triggering API request to:', url); // Debugging line
      const res = await fetch(url, {
        method: 'POST',
        body: arg,
      });
  
      console.log('Response received:', res); // Debugging line
  
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      console.log(data)
      // Check if data and data.product are defined
    if (data?.product?._id) {
      toast.success('Product created successfully');
      router.push(`/admin/products/${data.product._id}`);
    } else {
      toast.error('Product creation failed, no product ID returned.');
    }
    }
  );

  // Mutation for deleting a product
  const { trigger: deleteProduct } = useSWRMutation(
    '/api/admin/products',
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...');
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product deleted successfully', { id: toastId });
      } else {
        toast.error(data.message, { id: toastId });
      }
    }
  );

  // React Hook Form setup
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Product>();

  // Handle form submission for creating/updating a product
  const formSubmit = async (data: Product) => {
    try {
      console.log('Form data before submission:', data); // Log form data

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      formData.append('brand', data.brand);
      formData.append('countInStock', data.countInStock.toString());
      formData.append('description', data.description);

      if (data.image) {
        formData.append('image', data.image); // Use the image URL returned from Cloudinary
      }

      console.log('FormData before API call:', formData); // Log FormData contents

      await createProduct(formData); // Now simply call the mutation trigger
      setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  // Handle file upload for images
  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const toastId = toast.loading('Uploading image...');
    try {
      const resSign = await fetch('/api/cloudinary-sign', { method: 'POST' });
      const { signature, timestamp } = await resSign.json();
      const file = e.target.files![0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();

      if (res.ok) {
        // Set the image URL in the form data
        setValue('image', data.secure_url);
        toast.success('File uploaded successfully', { id: toastId });
      } else {
        throw new Error(data.error.message || 'Image upload failed');
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (error) return <div>An error has occurred: {error.message}</div>;
  if (!products) return <div>Loading...</div>;

  const openCreateModal = () => {
    setFormType('Create');
    setProductToUpdate(null);
    reset();
    setIsModalOpen(true);
  };

  const openUpdateModal = (product: Product) => {
    setFormType('Update');
    setProductToUpdate(product);
    reset(product);
    setIsModalOpen(true);
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof Product;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className="md:flex mb-6">
      <label className="label md:w-1/5" htmlFor={id}>
        {name}
      </label>
      <div className="md:w-4/5">
        <input
          type="text"
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
          })}
          className="input input-bordered w-full max-w-md"
        />
        {errors[id]?.message && (
          <div className="text-error">{errors[id]?.message}</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="py-4 text-2xl">Products</h1>
        <button
          disabled={isCreating}
          onClick={openCreateModal}
          className="btn btn-primary btn-sm"
        >
          {isCreating && <span className="loading loading-spinner"></span>}
          Create
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>price</th>
              <th>category</th>
              <th>count in stock</th>
              <th>rating</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product._id}>
                <td>{formatId(product._id!)}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.countInStock}</td>
                <td>{product.rating}</td>
                <td>
                  <Link
                    href={`/admin/products/${product._id}`}
                    type="button"
                    className="btn btn-ghost btn-sm"
                  >
                    Edit
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => deleteProduct({ productId: product._id! })}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for create/update product */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-2xl mb-4">{formType} Product</h2>
            <form onSubmit={handleSubmit(formSubmit)}>
              <FormInput id="name" name="Name" required />
              <FormInput id="slug" name="Slug" required />
              <FormInput id="price" name="Price" required pattern={{ value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Invalid price format' }} />
              <FormInput id="category" name="Category" required />
              <FormInput id="brand" name="Brand" required />
              <FormInput id="countInStock" name="Count In Stock" required pattern={{ value: /^[0-9]+$/, message: 'Must be a number' }} />
              <div className="md:flex mb-6">
                <label className="label md:w-1/5" htmlFor="description">
                  Description
                </label>
                <div className="md:w-4/5">
                  <textarea
                    id="description"
                    {...register('description')}
                    className="textarea textarea-bordered w-full max-w-md"
                  ></textarea>
                </div>
              </div>

              <div className="md:flex mb-6">
                <label className="label md:w-1/5" htmlFor="image">
                  Image
                </label>
                <div className="md:w-4/5">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={uploadHandler}
                    className="file-input file-input-bordered w-full max-w-xs"
                  />
                </div>
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  {formType === 'Create' ? 'Create' : 'Update'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
