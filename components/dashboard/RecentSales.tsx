// components/dashboard/RecentSales.tsx
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { dummyOrders } from '@/lib/dummyData';


const RecentSales: React.FC = () => {
  const [orders, setOrders] = useState(dummyOrders);

  useEffect(() => {
    // Simulate data fetching or processing
    setOrders(dummyOrders);
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Buyer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>${order.totalPrice}</TableCell>
              <TableCell>
                {/* Add action buttons or links here */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentSales;
