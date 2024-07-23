import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header>
      <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
        <Link href="/" legacyBehavior>
          <a className="text-lg font-bold">Ecommerce-Bengal</a>
        </Link>
        <ul className="flex">
          <li>
            <Link href='/cart' legacyBehavior>
              <a className='btn btn-ghost rounded-btn p-2'>Cart</a>
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
