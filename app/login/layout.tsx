import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '../globals.css';
import ThemeProvider from '../ThemeProvider';

const inter = Inter({
  weight: 'variable',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'React UI',
  description: 'Morning React UI Library',
  icons: { icon: '/favicon.ico', apple: '/apple-icon-180x180.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
