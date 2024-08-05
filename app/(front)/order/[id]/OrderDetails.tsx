'use client'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { OrderItem } from '@/lib/models/OrderModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from 'react'

interface User {
    _id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  }
  

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok ? toast.success('Order delivered successfully') : toast.error(data.message)
    }
  )

  const { data: session } = useSession()

  function isUser(obj: any): obj is User {
    return (
      obj &&
      typeof obj._id === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.email === 'string' &&
      (typeof obj.isAdmin === 'boolean' || obj.isAdmin === undefined)
    );
  }

  useEffect(() => {
    if (session && session.user) {
      if (isUser(session.user)) {
        // Now TypeScript knows session.user is of type User
        console.log('User object:', session.user);
        console.log('isAdmin:', session.user.isAdmin);
        setIsAdmin(session.user.isAdmin || false);
      } else {
        console.error('session.user is not of type User');
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id)
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('Order paid successfully')
      })
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`)

  if (error) return <div className="text-red-500">{error.message}</div>
  if (!data) return <div className="text-gray-500">Loading...</div>

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4">Order {orderId}</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div className="bg-white shadow rounded p-4 mb-4">
            <h2 className="text-xl font-medium mb-2">Shipping Address</h2>
            <p className="mb-1">{shippingAddress.fullName}</p>
            <p>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            {isDelivered ? (
              <p className="text-green-600 mt-2">Delivered at {deliveredAt}</p>
            ) : (
              <p className="text-red-600 mt-2">Not Delivered</p>
            )}
          </div>

          <div className="bg-white shadow rounded p-4 mb-4">
            <h2 className="text-xl font-medium mb-2">Payment Method</h2>
            <p className="mb-1">{paymentMethod}</p>
            {isPaid ? (
              <p className="text-green-600 mt-2">Paid at {paidAt}</p>
            ) : (
              <p className="text-red-600 mt-2">Not Paid</p>
            )}
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-medium mb-2">Items</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Item</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: OrderItem) => (
                  <tr key={item.slug}>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/product/${item.slug}`} className="flex items-center">
                        <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2"/>
                        <span>
                          {item.name} ({item.color} {item.size})
                        </span>
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b">{item.qty}</td>
                    <td className="py-2 px-4 border-b">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-medium mb-2">Order Summary</h2>
            <ul>
              <li className="flex justify-between py-2 border-b">
                <span>Items</span>
                <span>${itemsPrice}</span>
              </li>
              <li className="flex justify-between py-2 border-b">
                <span>Tax</span>
                <span>${taxPrice}</span>
              </li>
              <li className="flex justify-between py-2 border-b">
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </li>
              <li className="flex justify-between py-2 border-b">
                <span>Total</span>
                <span>${totalPrice}</span>
              </li>

              {!isPaid && paymentMethod === 'PayPal' && (
                <li className="mt-4">
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons createOrder={createPayPalOrder} onApprove={onApprovePayPalOrder} />
                  </PayPalScriptProvider>
                </li>
              )}
              {isAdmin && (
                <li className="mt-4">
                  <button
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                    onClick={() => deliverOrder()}
                    disabled={isDelivering}
                  >
                    {isDelivering ? <span className="animate-spin">🔄</span> : 'Mark as Delivered'}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
