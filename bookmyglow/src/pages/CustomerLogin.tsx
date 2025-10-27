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
import { ArrowBack as ArrowBackIcon, Person as PersonIcon } from '@mui/icons-material';
import { Customer, AuthState } from '../types';
import { customerAPI } from '../services/api';

interface CustomerLoginProps {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const CustomerLogin: React.FC<CustomerLoginProps> = ({ setAuthState }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  const [customerData, setCustomerData] = useState<Customer>({
    name: '',
    email: '',
    mobile: '',
  });
  const [otp, setOtp] = useState('');

  const steps = ['Mobile Number', 'Verification', 'Complete'];

  const handleInputChange = (field: keyof Customer, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleMobileSubmit = async () => {
    if (!customerData.mobile || customerData.mobile.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      // Check if user exists
      const existingUser = await customerAPI.login(customerData.mobile);
      if (existingUser && existingUser.name) {
        setIsExistingUser(true);
        setCustomerData(existingUser);
        setSuccess('OTP sent to your mobile number. Use 1234 for demo.');
      } else {
        setIsExistingUser(false);
        setSuccess('New user detected. OTP sent to your mobile number. Use 1234 for demo.');
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
      const isValid = await customerAPI.verifyOTP({ mobile: customerData.mobile, otp });
      if (isValid) {
        if (isExistingUser) {
          // Existing user - login directly
          setAuthState({
            isAuthenticated: true,
            userType: 'customer',
            user: customerData,
          });
          navigate('/customer/dashboard');
        } else {
          // New user - proceed to registration
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
    if (!customerData.name || !customerData.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const registeredUser = await customerAPI.register(customerData);
      setAuthState({
        isAuthenticated: true,
        userType: 'customer',
        user: registeredUser,
      });
      navigate('/customer/dashboard');
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
              value={customerData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="+1234567890"
              sx={{ mb: 3 }}
              disabled={loading}
            />
            <Button
              fullWidth
              variant="contained"
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
              We've sent a 4-digit code to {customerData.mobile}
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
              Complete Your Profile
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              value={customerData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={customerData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              sx={{ mb: 3 }}
              disabled={loading}
              required
            />
            <Button
              fullWidth
              variant="contained"
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
            <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1" color="primary.main">
              Customer Login
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

export default CustomerLogin;