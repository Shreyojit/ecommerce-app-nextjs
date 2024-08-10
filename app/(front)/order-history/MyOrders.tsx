'use client'

import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

// Data fetching function
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function MyOrders() {
  const router = useRouter()
  const { data: orders, error } = useSWR(`/api/orders/mine`, fetcher)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  if (error) return <div>An error has occurred: {error.message}</div>
  if (!orders) return <div>Loading...</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERED</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order: Order) => (
            <tr key={order._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.substring(20, 24)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalPrice}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.isPaid && order.paidAt ? `${order.paidAt.substring(0, 10)}` : 'not paid'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.isDelivered && order.deliveredAt ? `${order.deliveredAt.substring(0, 10)}` : 'not delivered'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link href={`/order/${order._id}`} passHref legacyBehavior>
                  <a className="text-indigo-600 hover:text-indigo-900">Details</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
