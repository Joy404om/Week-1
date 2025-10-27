import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Store as StoreIcon,
  Navigation as NavigationIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { AuthState, Salon, Customer } from '../types';
import { salonAPI } from '../services/api';

interface CustomerDashboardProps {
  authState: AuthState;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ authState }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbySalons, setNearbySalons] = useState<Salon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const customer = authState.user as Customer;

  useEffect(() => {
    if (!authState.isAuthenticated || authState.userType !== 'customer') {
      navigate('/');
    }
  }, [authState, navigate]);

  const requestLocationPermission = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLocationPermissionGranted(true);
        
        try {
          // Fetch nearby salons
          const salons = await salonAPI.findNearby(latitude, longitude, 5);
          setNearbySalons(salons);
        } catch (err) {
          setError('Failed to fetch nearby salons. Please try again.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permission to find nearby salons.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An error occurred while retrieving your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleSalonClick = (salon: Salon) => {
    setSelectedSalon(salon);
    setDialogOpen(true);
  };

  const handleBookAppointment = () => {
    // TODO: Implement booking functionality
    alert(`Booking feature coming soon for ${selectedSalon?.name}!`);
    setDialogOpen(false);
  };

  const handleViewLocation = () => {
    if (selectedSalon?.location) {
      window.open(selectedSalon.location, '_blank');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (!authState.isAuthenticated || authState.userType !== 'customer') {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Welcome, {customer?.name}!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer?.email} • {customer?.mobile}
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

        {/* Location Permission Section */}
        {!locationPermissionGranted && (
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}>
            <LocationIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Find Nearby Salons
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              Allow location access to discover amazing salons and beauty parlours within 5km of your location.
              We'll show you the best options nearby with ratings and services.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={requestLocationPermission}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <NavigationIcon />}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              {loading ? 'Getting Your Location...' : 'Enable Location & Find Salons'}
            </Button>
          </Paper>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Nearby Salons */}
        {locationPermissionGranted && (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
              Nearby Salons & Beauty Parlours
            </Typography>
            
            {userLocation && (
              <Alert severity="info" sx={{ mb: 3 }}>
                📍 Showing salons within 5km of your location ({userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)})
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={40} />
              </Box>
            ) : nearbySalons.length > 0 ? (
              <Grid container spacing={3}>
                {nearbySalons.map((salon) => (
                  <Grid item xs={12} md={6} lg={4} key={salon.id}>
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
                        cursor: 'pointer',
                      }}
                      onClick={() => handleSalonClick(salon)}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <StoreIcon sx={{ color: 'secondary.main', mr: 1 }} />
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                            {salon.name}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {salon.address}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {salon.mobile}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip
                            icon={<LocationIcon />}
                            label={`${salon.distance}km away`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                      
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSalonClick(salon);
                          }}
                          sx={{ borderRadius: 2 }}
                        >
                          View Details & Book
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <StoreIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No salons found within 5km
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try refreshing or check back later for new salons in your area.
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Salon Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StoreIcon sx={{ color: 'secondary.main', mr: 1 }} />
              {selectedSalon?.name}
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedSalon && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Address:</strong> {selectedSalon.address}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Phone:</strong> {selectedSalon.mobile}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Distance:</strong> {selectedSalon.distance}km from your location
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    icon={<LocationIcon />}
                    label={`${selectedSalon.distance}km away`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={handleViewLocation}
              startIcon={<LocationIcon />}
            >
              View on Map
            </Button>
            <Button
              variant="contained"
              onClick={handleBookAppointment}
              sx={{ ml: 1 }}
            >
              Book Appointment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CustomerDashboard;