import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { Providers } from './Providers';

const inter = Inter({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--inter',
});

const spaceGrotesk = Space_Grotesk({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--space-grotesk',
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
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <Providers>
          <Header>librairie de composants</Header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
