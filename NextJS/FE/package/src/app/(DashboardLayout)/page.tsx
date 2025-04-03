//localhost homepage layout
'use client'
import { Grid2 as Grid, Box, CircularProgress, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import DailyActivity from '@/app/(DashboardLayout)/components/dashboard/DailyActivity';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import BlogCard from '@/app/(DashboardLayout)/components/dashboard/Blog';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/authentication/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          読み込み中...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={0}>
          {/* ------------------------- row 1 ------------------------- */}
          <Grid
            size={{
              xs: 12,
              lg: 12
            }}>
            <SalesOverview />
          </Grid>
          {/* ------------------------- row 2 ------------------------- */}
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <DailyActivity />
          </Grid>
          <div>test2</div>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <ProductPerformance />
          </Grid>
          {/* ------------------------- row 3 ------------------------- */}
          <BlogCard />
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
