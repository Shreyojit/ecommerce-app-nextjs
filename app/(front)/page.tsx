import ProductItem from '@/components/products/ProductItem';
import productService from '@/lib/services/productService';
import { convertDocToObj } from '@/lib/utils';
import Link from 'next/link';

export default async function Home() {
  const featuredProducts = await productService.getFeatured();
  const latestProducts = await productService.getLatest();

  return (
    <>
      <div className="w-full carousel rounded-box mt-4">
        {featuredProducts.map((product, index) => (
          <div
            key={product._id as string}
            id={`slide-${index}`}
            className="carousel-item relative w-full"
          >
            <Link href={`/product/${product.slug}`}>
              <img src={product.banner} className="w-full" alt={product.name} />
            </Link>

            <div
              className="absolute flex justify-between transform 
               -translate-y-1/2 left-5 right-5 top-1/2"
            >
              <a
                href={`#slide-${
                  index === 0 ? featuredProducts.length - 1 : index - 1
                }`}
                className="btn btn-circle"
              >
                ❮
              </a>
              <a
                href={`#slide-${
                  index === featuredProducts.length - 1 ? 0 : index + 1
                }`}
                className="btn btn-circle"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-2xl py-2">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
  {latestProducts.map((product) => (
    <div
      key={product.slug}
      className="w-full h-full flex flex-col items-stretch justify-between border rounded-lg"
    >
      <ProductItem product={convertDocToObj(product)} />
    </div>
  ))}
</div>

    </>
  );
}
