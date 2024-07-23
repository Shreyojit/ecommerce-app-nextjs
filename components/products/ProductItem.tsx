import { Product } from '@/lib/models/ProductModel'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex">
      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <Link href={`/product/${product.slug}`} legacyBehavior>
            <a>
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover h-64 w-full"
              />
            </a>
          </Link>
          <div className="text-gray-900 font-bold text-xl mb-2">{product.name}</div>
          <p className="text-gray-700 text-base">{product.description}</p>
        </div>
        <div className="flex items-center">
          <div className="text-sm justify between">
            <p className="text-gray-900 leading-none">{product.brand}</p>
            <p className="text-gray-600">${product.price}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
