import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Store as StoreIcon,
  Spa as SpaIcon,
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    navigate('/customer/login');
  };

  const handleSalonLogin = () => {
    navigate('/salon/login');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        {/* App Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <SpaIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                background: 'linear-gradient(45deg, #e91e63, #9c27b0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              BookMyGlow
            </Typography>
          </Box>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Your one-stop solution for booking salon and beauty parlour appointments.
            Discover nearby salons, book your favorite services, and glow with confidence!
          </Typography>
        </Box>

        {/* Login Options */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
            width: '100%',
            maxWidth: 600,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ textAlign: 'center', mb: 4, color: 'primary.main' }}
          >
            Choose Your Login Type
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3 }}>
                  <PersonIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    Customer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Book appointments at your favorite salons and beauty parlours.
                    Find nearby services and manage your bookings.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCustomerLogin}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Login as Customer
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3 }}>
                  <StoreIcon sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    Salon/Beauty Parlour
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your salon business, handle bookings, and connect with
                    customers in your area.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleSalonLogin}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Login as Salon
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Features Section */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
            Why Choose BookMyGlow?
          </Typography>
          <Grid container spacing={2} sx={{ maxWidth: 800 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🗺️ Location-Based
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find salons within 5km radius
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                📱 Easy Booking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simple and quick appointment booking
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🔐 Secure Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                OTP-based verification system
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;