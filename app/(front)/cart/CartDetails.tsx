'use client'
import useCartService from '@/lib/hooks/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function CartDetails() {
  const { items, itemsPrice, decrease, increase } = useCartService()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return <></>
  
  return (
    <>
      <h1 className="py-4 text-2xl font-bold text-center">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-4">
          Cart is Empty. <Link href="/" className="text-blue-500 hover:underline">Go shopping</Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Table */}
            <div className="md:col-span-3 overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="w-full bg-gray-100 border-b">
                    <th className="py-2 px-4 text-left text-gray-600">Item</th>
                    <th className="py-2 px-4 text-left text-gray-600">Quantity</th>
                    <th className="py-2 px-4 text-left text-gray-600">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.slug} className="border-b">
                      <td className="py-2 px-4 flex items-center">
                        <Link href={`/product/${item.slug}`} className="flex items-center space-x-2">
                          <Image src={item.image} alt={item.name} width={50} height={50} />
                          <span>{item.name}</span>
                        </Link>
                      </td>
                      <td className="py-2 px-4 text-start">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-1 px-2 rounded"
                          type="button"
                          onClick={() => decrease(item)}
                        >
                          -
                        </button>
                        <span className="px-2">{item.qty}</span>
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-1 px-2 rounded"
                          type="button"
                          onClick={() => increase(item)}
                        >
                          +
                        </button>
                      </td>
                      <td className="py-2 px-4 text-start">${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Checkout Summary */}
            <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md">
              <div className="mb-4 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-semibold mb-2">
                  Subtotal ({items.reduce((a, c) => a + c.qty, 0)}) : ${itemsPrice}
                </h2>
              </div>
              <button
                onClick={() => router.push('/shipping')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
