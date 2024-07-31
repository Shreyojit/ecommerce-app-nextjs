'use client'
import useCartService from '@/lib/hooks/useCartStore'
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
            <th className="py-2 px-4 text-left text-gray-600">ID</th>
            <th className="py-2 px-4 text-left text-gray-600">Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Email</th>
            <th className="py-2 px-4 text-left text-gray-600">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-700">1</td>
            <td className="py-2 px-4 text-gray-700">John Doe</td>
            <td className="py-2 px-4 text-gray-700">john@example.com</td>
            <td className="py-2 px-4 text-gray-700">Admin</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-700">2</td>
            <td className="py-2 px-4 text-gray-700">Jane Smith</td>
            <td className="py-2 px-4 text-gray-700">jane@example.com</td>
            <td className="py-2 px-4 text-gray-700">User</td>
          </tr>
        
        </tbody>
      </table>
    </div>
  </div>


    )}
    </>
  )
}
