'use client'
import { useState } from 'react';
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

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
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products data with useSWR
  const { data: products, error } = useSWR<Product[]>('/api/admin/products', fetcher)

  console.log(products)

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="py-4 text-2xl">Products</h1>
        <button
          disabled={isCreating}
          onClick={() => setIsModalOpen(true)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <h2 className="text-lg font-semibold mb-4">Create New Product</h2>
            <p>This is a placeholder for your create product form.</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm mr-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  createProduct();
                }}
                className="btn btn-primary btn-sm"
              >
                Create Product
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
