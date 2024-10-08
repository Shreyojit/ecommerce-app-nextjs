'use client'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import useCartService from '@/lib/hooks/useCartStore'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface User {
  _id: string
  email: string
  name: string
  isAdmin: boolean
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const Header = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const { items } = useCartService()
  const [mounted, setMounted] = useState<boolean>(false)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const { data: session } = useSession()

  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'

  const { data: categories, error } = useSWR<string[]>('/api/products/categories', fetcher)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (session && session.user) {
      if (isUser(session.user)) {
        setIsAdmin(session.user.isAdmin || false)
      } else {
        setIsAdmin(false)
      }
    } else {
      setIsAdmin(false)
    }
  }, [session])

  console.log(session)

  function isUser(obj: any): obj is User {
    return (
      obj &&
      typeof obj._id === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.email === 'string' &&
      (typeof obj.isAdmin === 'boolean' || obj.isAdmin === undefined)
    )
  }

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' })
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  if (error) return <div className="text-red-500">Error: {error.message}</div>
  if (!categories) return <div className="text-gray-500">Loading...</div>

  return (
    <header>
      <nav className='flex h-20 items-center px-4 justify-between shadow-md'>
        <Link href="/" className="text-lg font-bold">
          Ecommerce-Bengal
        </Link>

        <form action="/search" method="GET" className="flex items-center space-x-2">
  <select
    name="category"
    defaultValue={category}
    className="select select-bordered w-24 text-sm"
  >
    <option value="all">All</option>
    {categories.map((c) => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
  </select>
  <input
    className="input input-bordered w-32 text-sm"
    placeholder="Search"
    defaultValue={q}
    name="q"
  />
  <button type="submit" className="btn btn-primary text-sm px-3 py-1">
    Search
  </button>
</form>


        <ul className="flex">
          <li>
            <Link href='/cart' className='btn btn-ghost rounded-btn p-2'>
              Cart
              {mounted && items.length !== 0 && (
                <div className="badge badge-secondary">
                  {items.reduce((a, c) => a + c.qty, 0)}
                </div>
              )}
            </Link>
          </li>
          <li>
            {session ? (
              <div className="relative">
                <button
                  className='btn btn-ghost rounded-btn flex items-center'
                  onClick={toggleDropdown}
                >
                  {session.user?.name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-52 absolute right-0 mt-2">
                    {isAdmin ? (
                      <>
                        <li>
                          <Link href="/admin/dashboard" className="block px-4 py-2">
                            Admin Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link href="/notifications" className="block px-4 py-2">
                            Notifications
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link href="/bookmarks" className="block px-4 py-2">
                            Bookmarks
                          </Link>
                        </li>
                        <li>
                          <Link href="/order-history" className="block px-4 py-2">
                            Order History
                          </Link>
                        </li>
                        <li>
                          <Link href="/profile" className="block px-4 py-2">
                            Profile
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <button type="button" onClick={signoutHandler} className="block px-4 py-2 text-red-500">
                        Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button
                className='btn btn-ghost rounded-btn p-2'
                type="button"
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
