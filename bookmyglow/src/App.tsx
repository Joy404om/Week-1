import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import HomePage from './pages/HomePage';
import CustomerLogin from './pages/CustomerLogin';
import SalonLogin from './pages/SalonLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import SalonDashboard from './pages/SalonDashboard';
import { AuthState } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Pink color for beauty theme
    },
    secondary: {
      main: '#9c27b0', // Purple color
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    user: null,
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/customer/login" 
              element={<CustomerLogin setAuthState={setAuthState} />} 
            />
            <Route 
              path="/salon/login" 
              element={<SalonLogin setAuthState={setAuthState} />} 
            />
            <Route 
              path="/customer/dashboard" 
              element={<CustomerDashboard authState={authState} />} 
            />
            <Route 
              path="/salon/dashboard" 
              element={<SalonDashboard authState={authState} />} 
            />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
