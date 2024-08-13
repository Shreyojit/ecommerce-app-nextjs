'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

const AdminLayout = ({
  activeItem = 'dashboard',
  children,
}: {
  activeItem: string;
  children: React.ReactNode;
}) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  // Log the session object to the console
  console.log('Session:', session);

  useEffect(() => {
    if (session && session.user) {
      const user = session.user as User;
      setIsAdmin(user.isAdmin || false);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="relative flex flex-grow p-4">
        <div>
          <h1 className="text-2xl">Unauthorized</h1>
          <p>Admin permission required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-grow flex-col md:flex-row">
      <div className="bg-base-200 w-full md:w-1/4 p-4">
        <ul className="menu">
          <li>
            <Link
              className={activeItem === 'dashboard' ? 'active' : ''}
              href="/admin/dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={activeItem === 'orders' ? 'active' : ''}
              href="/admin/orders"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              className={activeItem === 'products' ? 'active' : ''}
              href="/admin/products"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              className={activeItem === 'users' ? 'active' : ''}
              href="/admin/users"
            >
              Users
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
};

export default AdminLayout;
