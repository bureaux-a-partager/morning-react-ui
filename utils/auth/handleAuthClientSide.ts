'use client';
import { signIn, signOut } from 'next-auth/react';

export async function handleLogin() {
  signIn('google', { callbackUrl: '/' });
}

export async function handleLogout() {
  signOut({ callbackUrl: '/login' });
}
