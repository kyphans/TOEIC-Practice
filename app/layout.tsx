import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'TOEIC Practice Platform',
  description:
    'Practice TOEIC tests with timed sessions and track your progress',
  generator: 'v0.dev'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}

import './globals.css';
