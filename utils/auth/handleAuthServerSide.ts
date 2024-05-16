'use server';
import { signIn, signOut } from 'morning-react-ui/app/auth';

export async function handleLogin() {
  await signIn('google', { redirectTo: '/' });
}

export async function handleLogout() {
  await signOut({ redirectTo: '/login' });
}
