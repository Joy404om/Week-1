import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Store as StoreIcon } from '@mui/icons-material';
import { Salon, AuthState } from '../types';
import { salonAPI } from '../services/api';

interface SalonLoginProps {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const SalonLogin: React.FC<SalonLoginProps> = ({ setAuthState }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  const [salonData, setSalonData] = useState<Salon>({
    name: '',
    mobile: '',
    address: '',
    location: '',
  });
  const [otp, setOtp] = useState('');

  const steps = ['Mobile Number', 'Verification', 'Complete'];

  const handleInputChange = (field: keyof Salon, value: string) => {
    setSalonData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleMobileSubmit = async () => {
    if (!salonData.mobile || salonData.mobile.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      // Check if salon exists
      const existingSalon = await salonAPI.login(salonData.mobile);
      if (existingSalon && existingSalon.name) {
        setIsExistingUser(true);
        setSalonData(existingSalon);
        setSuccess('OTP sent to your mobile number. Use 1234 for demo.');
      } else {
        setIsExistingUser(false);
        setSuccess('New salon registration. OTP sent to your mobile number. Use 1234 for demo.');
      }
      setActiveStep(1);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const isValid = await salonAPI.verifyOTP({ mobile: salonData.mobile, otp });
      if (isValid) {
        if (isExistingUser) {
          // Existing salon - login directly
          setAuthState({
            isAuthenticated: true,
            userType: 'salon',
            user: salonData,
          });
          navigate('/salon/dashboard');
        } else {
          // New salon - proceed to registration
          setActiveStep(2);
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!salonData.name || !salonData.address || !salonData.location) {
      setError('Please fill in all required fields');
      return;
    }

    // Basic validation for Google Maps link
    if (!salonData.location.includes('maps.google') && !salonData.location.includes('goo.gl')) {
      setError('Please enter a valid Google Maps link');
      return;
    }

    setLoading(true);
    try {
      const registeredSalon = await salonAPI.register(salonData);
      setAuthState({
        isAuthenticated: true,
        userType: 'salon',
        user: registeredSalon,
      });
      navigate('/salon/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              Enter Your Mobile Number
            </Typography>
            <TextField
              fullWidth
              label="Mobile Number"
              type="tel"
              value={salonData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="+1234567890"
              sx={{ mb: 3 }}
              disabled={loading}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleMobileSubmit}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Enter Verification Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              We've sent a 4-digit code to {salonData.mobile}
            </Typography>
            <TextField
              fullWidth
              label="OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1234"
              sx={{ mb: 3 }}
              disabled={loading}
              inputProps={{ maxLength: 4 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleOTPVerification}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              Complete Your Salon Profile
            </Typography>
            <TextField
              fullWidth
              label="Salon/Parlour Name"
              value={salonData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
              required
            />
            <TextField
              fullWidth
              label="Shop Address"
              multiline
              rows={2}
              value={salonData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
              required
            />
            <TextField
              fullWidth
              label="Google Maps Link"
              value={salonData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="https://maps.google.com/?q=your+salon+location"
              sx={{ mb: 3 }}
              disabled={loading}
              required
              helperText="Paste your Google Maps location link here"
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleRegistration}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Complete Registration'}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <StoreIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
            <Typography variant="h4" component="h1" color="secondary.main">
              Salon Login
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {renderStepContent()}
        </Paper>
      </Box>
    </Container>
  );
};

export default SalonLogin;