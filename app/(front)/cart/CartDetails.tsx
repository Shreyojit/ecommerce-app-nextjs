'use client'
import useCartService from '@/lib/hooks/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function CartDetails() {
   
    const { items, itemsPrice, decrease, increase } = useCartService()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
      }, [])
      if (!mounted) return <></>
  return (
    
    <>
    <h1 className="py-4 text-2xl">
        Shopping Cart 
    </h1>
    {items.length === 0 ? (
<div>
    Cart is Empty. <Link href="/">Go shopping</Link>
</div>
    ) : (


  <div className="container mx-auto px-4 py-6">
    <div className="overflow-x-auto">
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
          <tr key={item.slug}>
            <td>
              <Link
              href={`/product/${item.slug}`}
              className='flex items-centre'>
                <Image
                src={item.image}
                alt={item.name}
                width={50}
                height={50}
                ></Image>
                <span className="px-2">{item.name}</span>
              </Link>
            </td>


            <td>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => decrease(item)}
                      >
                        -
                      </button>
                      <span className="px-2">{item.qty}</span>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => increase(item)}
                      >
                        +
                      </button>
                    </td>
                    <td>${item.price}</td>

          </tr>
        ))}
       </tbody>
      </table>
    </div>
  </div>


    )}
    </>
  )
}
