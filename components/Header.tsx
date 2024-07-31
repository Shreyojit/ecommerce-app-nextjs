'use client'

import useCartService from '@/lib/hooks/useCartStore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Header = () => {

  const { items } = useCartService()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header>
      <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
        <Link href="/" legacyBehavior>
          <a className="text-lg font-bold">Ecommerce-Bengal</a>
        </Link>
        <ul className="flex">
          <li>
            <Link href='/cart' legacyBehavior>
              <a className='btn btn-ghost rounded-btn p-2'>Cart
              {mounted && items.length != 0 && (
              <div className="badge badge-secondary">
                {items.reduce((a, c) => a + c.qty, 0)}{' '}
              </div>
            )}

              </a>
            </Link>
          </li>
          <li>
            <Link href='/signin' legacyBehavior>
              <a className='btn btn-ghost rounded-btn p-2'>Sign In</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
