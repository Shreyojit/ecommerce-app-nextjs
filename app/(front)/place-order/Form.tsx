'use client'

import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useSWRMutation from 'swr/mutation';
import Image from 'next/image';

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService();

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    '/api/orders/mine',
    async () => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethod,
            shippingAddress,
            items,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          clear();
          toast.success('Order placed successfully');
          router.push(`/order/${data.order._id}`);
        } else {
          throw new Error(data.message || 'Failed to place order');
        }
      } catch (error) {
        console.error('Error placing order:', error);
       
      }
    }
  );

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (items.length === 0) {
      router.push('/');
    }
  }, [paymentMethod, items, router]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto p-4">
      <CheckoutSteps current={4} />
      <div className="grid md:grid-cols-4 gap-4 mt-4">
        <div className="md:col-span-3">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <p>{shippingAddress.fullName}</p>
            <p>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <Link href="/shipping" className="text-blue-500 hover:underline mt-2 block">
              Edit
            </Link>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow mt-4">
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <p>{paymentMethod}</p>
            <Link href="/payment" className="text-blue-500 hover:underline mt-2 block">
              Edit
            </Link>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow mt-4">
            <h2 className="text-lg font-semibold">Items</h2>
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
                        <span className="px-2">{item.qty}</span>
                      </td>
                      <td className="py-2 px-4 text-start">${item.price || 'N/A'}</td> {/* Fallback value */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/cart" className="text-blue-500 hover:underline mt-2 block">
              Edit
            </Link>
          </div>
        </div>
        <div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Items</span>
                <span>${itemsPrice}</span>
              </li>
              <li className="flex justify-between">
                <span>Tax</span>
                <span>${taxPrice}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </li>
              <li className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalPrice}</span>
              </li>
              <li>
                <button
                  onClick={() => placeOrder()}
                  disabled={isPlacing}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
                >
                  {isPlacing && <span className="mr-2">Placing order...</span>}
                  Place Order
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
