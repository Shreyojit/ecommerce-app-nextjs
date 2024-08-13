'use client';

import DashboardCard from '@/components/dashboard/Card';
import MemberTable from '@/components/dashboard/MemberTable';
import ProductTable from '@/components/dashboard/ProductTable';
import RecentSales from '@/components/dashboard/RecentSales';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { Container, Grid, Paper } from '@mui/material';
import { useSession } from 'next-auth/react';

const AdminDashboard: React.FC = () => {
  const { data: session } = useSession();

  // Log the session object to the console
  console.log('Session:', session);

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Revenue" value="$123,456" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Sales" value="789" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Products" value="456" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Customers" value="123" />
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
  {/* Revenue Chart and Recent Sales */}
  <Grid item xs={12} md={6}>
    <Paper style={{ padding: '20px', height: '100%' }}>
      <RevenueChart />
    </Paper>
  </Grid>
  <Grid item xs={12} md={6}>
    <Paper style={{ padding: '20px', height: '100%' }}>
      <RecentSales />
    </Paper>
  </Grid>
</Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* Member Table and Product Table */}
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px', height: '100%' }}>
            <MemberTable />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px', height: '100%' }}>
            <ProductTable />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
