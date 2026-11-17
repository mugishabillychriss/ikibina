import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ikibina Management System',
  description: 'Secure financial management for an Ikibina savings group',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
