import AddToCart from '@/components/products/AddToCart'
import { Rating } from '@/components/products/Rating'
import data from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ProductDetails({
    params,
}:{
    params: {slug:string}
}) {
    const product = data.products.find((x)=>x.slug === params.slug)
    if(!product) return <div>Product Not Found</div>
  return (
   <>
   <div className="my-2">
    <Link href="/">Back to Products</Link>
   </div>



   <section className="overflow-hidden text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap mx-auto lg:w-full">
          <div className="items-center hidden w-1/6 grid-cols-1 grid-rows-8 gap-2 pr-4 lg:grid">
         
            <Image
              className="w-24 h-24 border-2 border-black rounded-md justify-self-end hover:border-gray-400"
              src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-earbuds-inside-outside.jpg"
              alt="Image 2"
              width={96}
              height={96}
            />
            <Image
              className="w-24 h-24 border-2 border-black rounded-md justify-self-end hover:border-gray-400"
              src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-earbuds-b-logo.jpg"
              alt="Image 3"
              width={96}
              height={96}
            />
            <Image
              className="w-24 h-24 border-2 border-black rounded-md justify-self-end hover:border-gray-400"
              src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-case-open.jpg"
              alt="Image 4"
              width={96}
              height={96}
            />
            <Image
              className="w-24 h-24 border-2 border-black rounded-md justify-self-end hover:border-gray-400"
              src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-case-charger.jpg"
              alt="Image 5"
              width={96}
              height={96}
            />
          </div>
          <div className="w-full lg:w-3/6 md:w-3/6">
            <Image
              alt="main image"
              className="object-cover object-center w-full h-auto rounded"
              src={product.image}
              width={600}
              height={400}
            />
            <div className="grid justify-center grid-cols-5 grid-rows-1 pt-8 lg:hidden">
              <Image
                className="w-12 h-12 border-2 border-black rounded-md justify-self-center hover:border-gray-400"
                src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-case-open-floating.jpg"
                alt="Image 1"
                width={48}
                height={48}
              />
              <Image
                className="w-12 h-12 border-2 border-black rounded-md justify-self-center hover:border-gray-400"
                src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-earbuds-inside-outside.jpg"
                alt="Image 2"
                width={48}
                height={48}
              />
              <Image
                className="w-12 h-12 border-2 border-black rounded-md justify-self-center hover:border-gray-400"
                src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-earbuds-b-logo.jpg"
                alt="Image 3"
                width={48}
                height={48}
              />
              <Image
                className="w-12 h-12 border-2 border-black rounded-md justify-self-center hover:border-gray-400"
                src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-case-open.jpg"
                alt="Image 4"
                width={48}
                height={48}
              />
              <Image
                className="w-12 h-12 border-2 border-black rounded-md justify-self-center hover:border-gray-400"
                src="https://www.beatsbydre.com/content/dam/beats/web/product/earbuds/studio-buds-plus/pdp/product-carousel/cosmic-pink/pc-le-studiobudsplus-cosmic-pink-case-charger.jpg"
                alt="Image 5"
                width={48}
                height={48}
              />
            </div>
          </div>
          <div className="w-full mt-6 lg:w-2/6 md:w-3/6 lg:pl-10 lg:py-6 lg:mt-0">
            <span className="mb-2 text-base font-semibold text-red-500">NEW</span>
            <h1 className="mb-2 text-4xl font-bold text-black title-font">{product.name}</h1>
            <p className="mb-8 text-xl font-semibold text-black"> Description: {product.description}.</p>
            <h1 className="mb-8 text-2xl font-semibold text-black title-font">{product.brand}</h1>
            <h1 className="mb-8 text-2xl font-semibold text-black title-font">${product.price}</h1>
          
            <span className="text-base text-black">Color: <span className="font-bold">Cosmic Pink</span></span>
            <div className="flex gap-2 mt-4">
              <button className="border border-gray-300 ml-1 bg-[#2b2b2b] rounded-full w-10 h-10 focus:outline-none"></button>
              <button className="border border-gray-300 ml-1 bg-[#f2ede7] rounded-full w-10 h-10 focus:outline-none"></button>
              <button className="border border-gray-300 ml-1 bg-[#b4b7c5] rounded-full w-10 h-10 focus:outline-none"></button>
              <button className="border-2 border-green-300 ml-1 bg-[#caa1a4] rounded-full w-10 h-10 focus:outline-none"></button>
              <button className="border border-gray-300 ml-1 bg-[#9c9c9e] rounded-full w-10 h-10 focus:outline-none"></button>
            </div>


            <div className="mb-2 mt-4 flex justify-start">
                <div className='mr-2 text-base text-black'>Status:</div>
                <span className='text-base text-black font-bold'>
                  {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                </span>
              </div>

              <Rating
                value={product.rating}
                caption={`${product.numReviews} ratings`}
              />



            <button className="block w-full px-6 py-2 mx-auto my-8 text-white uppercase bg-black border border-black rounded-full hover:bg-white hover:text-black">
              Notify Me
            </button>
            <hr className="my-4" />
            <div className="space-y-4 text-black">
              <div className="flex items-center justify-center">
                <Image
                  className="w-6 h-6 mr-4"
                  src="https://www.beatsbydre.com/content/dam/beats/web/common/icons/apple-value-props/free-shipping-icon.png"
                  alt=""
                  width={24}
                  height={24}
                />
                <div>
                  <h1 className="text-base font-semibold">Free Shipping and Returns</h1>
                  <p className="mt-1 text-base">Enjoy free 2-day delivery and 14-day returns.</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  className="w-6 h-6 mr-4"
                  src="https://www.beatsbydre.com/content/dam/beats/web/common/icons/apple-value-props/in-store-pickup-icon.png"
                  alt=""
                  width={24}
                  height={24}
                />
                <div>
                  <h1 className="text-base font-semibold">In-Store Pickup</h1>
                  <p className="mt-1 text-base">Pick up your Beats at an Apple Store near you.</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  className="w-6 h-6 mr-4"
                  src="https://www.beatsbydre.com/content/dam/beats/web/common/icons/apple-value-props/apple-music-icon.png"
                  alt=""
                  width={24}
                  height={24}
                />
                <div>
                  <h1 className="text-base font-semibold">Free Apple Music Trial</h1>
                  <p className="mt-1 text-base">Get 6 months of access to over 100 million songs, ad-free.*</p>
                </div>
              </div>
            </div>
            <hr className="my-4" />


{product.countInStock!==0 && (


                
<div className="card align-item-centre">
<AddToCart
                    item={{ ...product, qty: 0, color: '', size: '' }}
                  />
</div>





)}

          
          </div>
        </div>
      </div>
    </section>



   </>
  )
}