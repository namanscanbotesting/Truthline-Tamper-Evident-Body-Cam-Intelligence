import './globals.css';

export const metadata = {
  title: 'Truthline',
  description: 'Tamper-Evident Body Cam Intelligence'
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
