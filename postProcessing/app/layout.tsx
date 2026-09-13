import './globals.css';

export const metadata = {
  title: 'Clearance',
  description: 'AI-Powered Police Report Generator'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
