import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Store as StoreIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Dashboard as DashboardIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { AuthState, Salon } from '../types';

interface SalonDashboardProps {
  authState: AuthState;
}

const SalonDashboard: React.FC<SalonDashboardProps> = ({ authState }) => {
  const navigate = useNavigate();
  const salon = authState.user as Salon;

  useEffect(() => {
    if (!authState.isAuthenticated || authState.userType !== 'salon') {
      navigate('/');
    }
  }, [authState, navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleViewLocation = () => {
    if (salon?.location) {
      window.open(salon.location, '_blank');
    }
  };

  if (!authState.isAuthenticated || authState.userType !== 'salon') {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 56, height: 56 }}>
                <StoreIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                  {salon?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Salon Dashboard
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderRadius: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Salon Information */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'secondary.main' }}>
            Salon Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StoreIcon sx={{ color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Salon Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {salon?.name}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mobile Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {salon?.mobile}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <LocationIcon sx={{ color: 'secondary.main', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {salon?.address}
                  </Typography>
                </Box>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<LocationIcon />}
                onClick={handleViewLocation}
                sx={{ mt: 1, borderRadius: 2 }}
              >
                View on Google Maps
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <ScheduleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <DashboardIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  ★ 0.0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'secondary.main' }}>
            Quick Actions
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ScheduleIcon />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => alert('Manage bookings feature coming soon!')}
              >
                Manage Bookings
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<PeopleIcon />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => alert('View customers feature coming soon!')}
              >
                View Customers
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                startIcon={<TrendingUpIcon />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => alert('Analytics feature coming soon!')}
              >
                View Analytics
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Welcome Message */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            mt: 4, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)' 
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: 'secondary.main', fontWeight: 600 }}>
            Welcome to BookMyGlow! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your salon is now registered and ready to receive bookings from customers in your area.
            Customers within 5km radius will be able to discover your salon and book appointments.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Tip:</strong> Keep your contact information updated and respond promptly to booking requests to improve customer satisfaction and ratings.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default SalonDashboard;