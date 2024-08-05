'use client';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { OrderItem } from '@/lib/models/OrderModel';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  } catch (error) {
    console.error('Fetching error:', error);
    throw error;
  }
};

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string;
  paypalClientId: string;
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
      });
      const data = await res.json();
      res.ok ? toast.success('Order delivered successfully') : toast.error(data.message);
    }
  );

  const { data: session } = useSession();

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
      .then((order) => order.id);
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
        toast.success('Order paid successfully');
      });
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`, fetcher);

  console.log('SWR Data:', data);
  console.log('SWR Error:', error);

  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  if (!data) return <div className="text-gray-500">Loading...</div>;

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
  } = data;

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
              <tr className="w-full bg-gray-100 border-b">
                    <th className="py-2 px-4 text-left text-gray-600">Item</th>
                    <th className="py-2 px-4 text-left text-gray-600">Quantity</th>
                    <th className="py-2 px-4 text-left text-gray-600">Price</th>
                  </tr>
              </thead>
              <tbody>
              {items.map((item: OrderItem) => (
                    <tr key={item.slug} className="border-b">
                      <td className="py-2 px-4 flex items-center">
                        <Link href={`/product/${item.slug}`} className="flex items-center space-x-2">
                          <Image src={item.image} alt={item.name} width={50} height={50} />
                          <span>{item.name}</span>
                        </Link>
                      </td>
                      <td className="py-2 px-4 text-start">
                        <span className="px-2">{item.qty}</span>
                      </td>
                      <td className="py-2 px-4 text-start">${item.price || 'N/A'}</td> {/* Fallback value */}
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
            </ul>
            {!isPaid && (
              <div className="mt-4">
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PayPalButtons
                    createOrder={createPayPalOrder}
                    onApprove={onApprovePayPalOrder}
                    style={{ layout: 'vertical' }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
            {isAdmin && !isDelivered && (
               <li>
               <button
                 className="btn w-full my-2"
                 onClick={() => deliverOrder()}
                 disabled={isDelivering}
               >
                 {isDelivering && (
                   <span className="loading loading-spinner"></span>
                 )}
                 Mark as delivered
               </button>
             </li>
            )} 
          </div>
        </div>
      </div>
    </div>
  );
}
