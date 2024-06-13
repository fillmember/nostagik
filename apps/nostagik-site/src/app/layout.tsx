import { type Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'Nostagik',
    template: '%s | Nostagik',
  },
  description: 'Create static site with Notion and Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
