'use client';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from 'morning-react-ui/components/Context/ToastContext';
import ThemeProvider from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
