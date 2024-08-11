import DashboardCard from '@/components/dashboard/Card';
import MemberTable from '@/components/dashboard/MemberTable';
import ProductTable from '@/components/dashboard/ProductTable';
import RecentSales from '@/components/dashboard/RecentSales';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { Container, Grid, Paper } from '@mui/material';


const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <DashboardCard title="Total Revenue" value="$123,456" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DashboardCard title="Total Sales" value="789" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DashboardCard title="Products" value="456" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DashboardCard title="Customers" value="123" />
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={8}>
          <Paper style={{ padding: '20px' }}>
            <RevenueChart />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: '20px' }}>
            <RecentSales />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: '20px' }}>
            <MemberTable />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: '20px' }}>
            <ProductTable />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
