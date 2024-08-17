'use client'

import useBookmarkService from '@/lib/hooks/bookmarkStore';
import { Product } from '@/lib/models/ProductModel';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';

export default function ProductItem({ product }: { product: Product }) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarkService();
  const [isBookmarked, setIsBookmarked] = useState(
    bookmarks.some((p) => p._id === product._id)
  );

  useEffect(() => {
    // Log the bookmarks list whenever it changes
    console.log('Current Bookmarked Products:', bookmarks);
  }, [bookmarks]);


  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(product._id);
    } else {
      addBookmark(product);
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
   
      <div className=" p-4 flex flex-col justify-between leading-normal">
        <div className="relative mb-8">
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
        <div className="flex items-center justify-between relative">
  <div className="text-sm">
    <p className="text-gray-900 leading-none">{product.brand}</p>
    <p className="text-gray-600">${product.price}</p>
  </div>
  <button
    className="absolute top-2 right-2 z-10"
    onClick={toggleBookmark}
  >
    {isBookmarked ? <FaHeart className="text-red-500 text-2xl" /> : <CiHeart className="text-2xl" />}
  </button>
</div>

      </div>
   
  );
}
