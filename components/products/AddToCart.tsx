'use client'

import useCartService from "@/lib/hooks/useCartStore"
import { OrderItem } from "@/lib/models/OrderModel"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function AddToCart({ item }: { item: OrderItem }) {
    
    const { items, increase,decrease } = useCartService()
    const [existItem, setExistItem] = useState<OrderItem | undefined>()
  
    useEffect(() => {
      setExistItem(items.find((x) => x.slug === item.slug))
    }, [item, items])
  
    const addToCartHandler = () => {
      increase(item)
    }
    return existItem ? (
       
      <button
      className="block w-full px-6 py-2 mx-auto my-8 text-white uppercase bg-black border border-black rounded-full flex items-center justify-center space-x-2"
      type="button"
     
    >
      <button
        className="bg-gray-700 text-white w-10 h-10 flex items-center justify-center rounded-full"
        type="button"
        onClick={()=>decrease(existItem)}
      >
        -
      </button>
      <span className="text-xl">{existItem.qty}</span>
      <button
        className="bg-gray-700 text-white w-10 h-10 flex items-center justify-center rounded-full"
        type="button"
       onClick={() => increase(existItem)}
      >
        +
      </button>
    </button>
    
       
     
    ) : (
      <button
        className="block w-full px-6 py-2 mx-auto my-8 text-white uppercase bg-black border border-black rounded-full hover:bg-white hover:text-black"
        type="button"
        onClick={addToCartHandler}
      >
        Add to cart
      </button>
    )
  }