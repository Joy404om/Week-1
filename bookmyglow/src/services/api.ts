import axios from 'axios';
import { Customer, Salon, OTPVerification } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerAPI = {
  register: async (customer: Customer): Promise<Customer> => {
    try {
      const response = await api.post('/customers/register', customer);
      return response.data;
    } catch (error) {
      // For demo purposes, simulate API response
      console.log('Simulating customer registration:', customer);
      return { ...customer, id: Date.now().toString() };
    }
  },

  verifyOTP: async (verification: OTPVerification): Promise<boolean> => {
    try {
      const response = await api.post('/customers/verify-otp', verification);
      return response.data.success;
    } catch (error) {
      // For demo purposes, simulate OTP verification (accept 1234 as valid OTP)
      console.log('Simulating OTP verification:', verification);
      return verification.otp === '1234';
    }
  },

  login: async (mobile: string): Promise<Customer | null> => {
    try {
      const response = await api.post('/customers/login', { mobile });
      return response.data;
    } catch (error) {
      // For demo purposes, return mock data
      console.log('Simulating customer login:', mobile);
      return {
        id: '1',
        name: 'Demo Customer',
        email: 'demo@customer.com',
        mobile: mobile,
      };
    }
  },
};

export const salonAPI = {
  register: async (salon: Salon): Promise<Salon> => {
    try {
      const response = await api.post('/salons/register', salon);
      return response.data;
    } catch (error) {
      // For demo purposes, simulate API response
      console.log('Simulating salon registration:', salon);
      return { ...salon, id: Date.now().toString() };
    }
  },

  verifyOTP: async (verification: OTPVerification): Promise<boolean> => {
    try {
      const response = await api.post('/salons/verify-otp', verification);
      return response.data.success;
    } catch (error) {
      // For demo purposes, simulate OTP verification
      console.log('Simulating salon OTP verification:', verification);
      return verification.otp === '1234';
    }
  },

  login: async (mobile: string): Promise<Salon | null> => {
    try {
      const response = await api.post('/salons/login', { mobile });
      return response.data;
    } catch (error) {
      // For demo purposes, return mock data
      console.log('Simulating salon login:', mobile);
      return {
        id: '1',
        name: 'Demo Salon',
        mobile: mobile,
        address: '123 Beauty Street, City',
        location: 'https://maps.google.com/?q=demo+salon',
      };
    }
  },

  findNearby: async (latitude: number, longitude: number, radius: number = 5): Promise<Salon[]> => {
    try {
      const response = await api.get(`/salons/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
      return response.data;
    } catch (error) {
      // For demo purposes, return mock nearby salons
      console.log('Simulating nearby salon search:', { latitude, longitude, radius });
      return [
        {
          id: '1',
          name: 'Glamour Studio',
          mobile: '+1234567890',
          address: '123 Beauty Avenue, Downtown',
          location: 'https://maps.google.com/?q=glamour+studio',
          coordinates: { latitude: latitude + 0.01, longitude: longitude + 0.01 },
          distance: 1.2,
        },
        {
          id: '2',
          name: 'Elite Beauty Parlour',
          mobile: '+1234567891',
          address: '456 Style Street, Uptown',
          location: 'https://maps.google.com/?q=elite+beauty',
          coordinates: { latitude: latitude - 0.02, longitude: longitude + 0.02 },
          distance: 2.8,
        },
        {
          id: '3',
          name: 'Royal Salon & Spa',
          mobile: '+1234567892',
          address: '789 Luxury Lane, Central',
          location: 'https://maps.google.com/?q=royal+salon',
          coordinates: { latitude: latitude + 0.03, longitude: longitude - 0.01 },
          distance: 4.1,
        },
      ];
    }
  },
};

export default api;