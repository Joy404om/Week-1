export interface Customer {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Salon {
  id?: string;
  name: string;
  mobile: string;
  address: string;
  location: string; // Google Maps link
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // Distance from user in km
}

export interface OTPVerification {
  mobile: string;
  otp: string;
}

export type UserType = 'customer' | 'salon';

export interface AuthState {
  isAuthenticated: boolean;
  userType: UserType | null;
  user: Customer | Salon | null;
}