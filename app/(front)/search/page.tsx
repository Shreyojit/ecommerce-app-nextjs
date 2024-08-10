import ProductItem from '@/components/products/ProductItem'
import { Rating } from '@/components/products/Rating'
import productServices from '@/lib/services/productService'
import Link from 'next/link'

const sortOrders = ['newest', 'lowest', 'highest', 'rating']
const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
]
const ratings = [5, 4, 3, 2, 1]

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ''}
          ${category !== 'all' ? `: Category ${category}` : ''}
          ${price !== 'all' ? `: Price ${price}` : ''}
          ${rating !== 'all' ? `: Rating ${rating}` : ''}`,
    }
  }
  return { title: 'Search Products' }
}

export default async function SearchPage({
  searchParams: {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  const getFilterUrl = ({
    c, s, p, r, pg,
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {
    const params = { q, category, price, rating, sort, page }
    if (c) params.category = c
    if (p) params.price = p
    if (r) params.rating = r
    if (pg) params.page = pg
    if (s) params.sort = s
    return `/search?${new URLSearchParams(params).toString()}`
  }

  const categories = await productServices.getCategories()
  const { countProducts, products, pages } = await productServices.getByQuery({
    category,
    q,
    price,
    rating,
    page,
    sort,
  })

  return (
    <div className="container mx-auto p-4 md:grid md:grid-cols-5 md:gap-4">
      {/* Filters */}
      <aside className="space-y-4 mb-6 md:mb-0">
        {/* Category Filter */}
        <div>
          <h2 className="text-xl font-semibold">Department</h2>
          <ul className="space-y-2 mt-2">
            <li>
              <Link
                className={`link ${category === 'all' ? 'link-primary' : ''}`}
                href={getFilterUrl({ c: 'all' })}
              >
                Any
              </Link>
            </li>
            {categories.map((c: string) => (
              <li key={c}>
                <Link
                  className={`link ${c === category ? 'link-primary' : ''}`}
                  href={getFilterUrl({ c })}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Filter */}
        <div>
          <h2 className="text-xl font-semibold">Price</h2>
          <ul className="space-y-2 mt-2">
            <li>
              <Link
                className={`link ${price === 'all' ? 'link-primary' : ''}`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`link ${p.value === price ? 'link-primary' : ''}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating Filter */}
        <div>
          <h2 className="text-xl font-semibold">Customer Review</h2>
          <ul className="space-y-2 mt-2">
            <li>
              <Link
                className={`link ${rating === 'all' ? 'link-primary' : ''}`}
                href={getFilterUrl({ r: 'all' })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`link ${`${r}` === rating ? 'link-primary' : ''}`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  <Rating caption=" & up" value={r} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Products and Sorting */}
      <main className="md:col-span-4">
        <div className="flex items-center justify-between py-4">
          <div className="text-lg font-medium">
            {products.length === 0 ? 'No' : countProducts} Results
            {q !== 'all' && q !== '' && `: ${q}`}
            {category !== 'all' && `: ${category}`}
            {price !== 'all' && `: Price ${price}`}
            {rating !== 'all' && `: Rating ${rating} & up`}
            {((q !== 'all' && q !== '') ||
              category !== 'all' ||
              rating !== 'all' ||
              price !== 'all') && (
              <Link className="btn btn-sm btn-ghost" href="/search">
                Clear
              </Link>
            )}
          </div>
          <div>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 link ${sort === s ? 'link-primary' : ''}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductItem key={product.slug} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {products.length > 0 &&
            Array.from(Array(pages).keys()).map((p) => (
              <Link
                key={p}
                className={`btn btn-sm mx-1 ${
                  Number(page) === p + 1 ? 'btn-active' : ''
                }`}
                href={getFilterUrl({ pg: `${p + 1}` })}
              >
                {p + 1}
              </Link>
            ))}
        </div>
      </main>
    </div>
  )
}
