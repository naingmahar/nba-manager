import '../styles/globals.css';
import React from 'react';
import ReduxProvider from '@/components/providers/ReduxProvider';

// Root Layout is a Server Component by default

export const metadata = {
  title: 'NBA Team Manager',
  description: 'Manage NBA teams and players with Next.js, Redux, and TypeScript.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">
        {/* Wrap content with the ReduxProvider */}
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}