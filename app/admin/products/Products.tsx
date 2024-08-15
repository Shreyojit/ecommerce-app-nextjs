'use client'

import { useState } from 'react';
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the Zod schema for form validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image URL is required"),
  price: z.number().min(0, "Price must be positive"),
  brand: z.string().min(1, "Brand is required"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
  numReviews: z.number().min(0, "Number of reviews must be positive"),
  countInStock: z.number().min(0, "Count in stock must be positive"),
  description: z.string().min(1, "Description is required"),
  isFeatured: z.boolean().optional(),
  banner: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Define a fetcher function for useSWR
const fetcher = async (url: string): Promise<Product[]> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await response.json()
  return data // Return the array of products directly
}

export default function Products() {
  // State to manage modal visibility and form type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'Create' | 'Update'>('Create');
  const [productToUpdate, setProductToUpdate] = useState<Product | undefined>(undefined);

  // Fetch products data with useSWR
  const { data: products, error } = useSWR<Product[]>('/api/admin/products', fetcher)

  console.log(products)

  // React Hook Form setup
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    defaultValues: productToUpdate ? {
      name: productToUpdate.name,
      slug: productToUpdate.slug,
      category: productToUpdate.category,
      image: productToUpdate.image,
      price: productToUpdate.price,
      brand: productToUpdate.brand,
      rating: productToUpdate.rating,
      numReviews: productToUpdate.numReviews,
      countInStock: productToUpdate.countInStock,
      description: productToUpdate.description,
      isFeatured: productToUpdate.isFeatured,
      banner: productToUpdate.banner,
    } : {},
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormValues) => {
    // Handle form submission (create or update product)
    console.log(data);
    // Add your form submission logic here
  };

  const router = useRouter()

  // Define deleteProduct mutation
  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...')
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Product deleted successfully', { id: toastId })
        : toast.error(data.message, { id: toastId })
    }
  )

  // Define createProduct mutation
  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message)
        return
      }

      toast.success('Product created successfully')
      router.push(`/admin/products/${data.product._id}`)
    }
  )

  // Handle error state
  if (error) return <div>An error has occurred: {error.message}</div>

  // Handle loading state
  if (!products) return <div>Loading...</div>

  const openCreateModal = () => {
    setFormType('Create');
    setProductToUpdate(undefined);
    setIsModalOpen(true);
  };

  const openUpdateModal = (product: Product) => {
    setFormType('Update');
    setProductToUpdate(product);
    setIsModalOpen(true);
  };

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
                    type="button"
                    className="btn btn-ghost btn-sm"
                  >
                    Delete
                  </button>
                  &nbsp;
                  <button
                    onClick={() => openUpdateModal(product)}
                    type="button"
                    className="btn btn-ghost btn-sm"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
    
  {/* Modal */}
  {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[80vh] overflow-auto relative">
            <h2 className="text-lg font-semibold mb-4">{formType} Product</h2>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Slug Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>

              {/* Category Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              {/* Image URL Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
              </div>

              {/* Price Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              {/* Brand Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
              </div>

              {/* Rating Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.rating ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
              </div>

              {/* Number of Reviews Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Number of Reviews</label>
                <Controller
                  name="numReviews"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.numReviews ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.numReviews && <p className="text-red-500 text-xs mt-1">{errors.numReviews.message}</p>}
              </div>

              {/* Count in Stock Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Count in Stock</label>
                <Controller
                  name="countInStock"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.countInStock ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.countInStock && <p className="text-red-500 text-xs mt-1">{errors.countInStock.message}</p>}
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              {/* Is Featured Field */}
            

              {/* Banner Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Banner</label>
                <Controller
                  name="banner"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`mt-1 block w-full border rounded-md shadow-sm ${errors.banner ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.banner && <p className="text-red-500 text-xs mt-1">{errors.banner.message}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
