import axios from 'axios';
import { supabaseAnonKey, supabaseUrl } from './supabase';

export type AuthSession = {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
  };
};

const authClient = axios.create({
  baseURL: `${supabaseUrl}/auth/v1`,
  headers: {
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json',
  },
});

export async function signInWithPassword(email: string, password: string) {
  const { data } = await authClient.post<AuthSession>('/token?grant_type=password', { email, password });
  return data;
}

export async function signUpWithPassword(email: string, password: string, fullName: string) {
  const { data } = await authClient.post<AuthSession>('/signup', {
    email,
    password,
    data: { full_name: fullName },
  });
  return data;
}

export async function requestWhatsAppOtp(phone: string) {
  const { data } = await authClient.post('/otp', { phone, channel: 'whatsapp' });
  return data;
}

export async function verifyWhatsAppOtp(phone: string, token: string) {
  const { data } = await authClient.post<AuthSession>('/verify', {
    phone,
    token,
    type: 'sms',
  });
  return data;
}
