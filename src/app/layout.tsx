import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import './globals.css'

const raleway = Raleway({ subsets: ['latin'], weight: ['200', '300', '400', '500'] })

export const metadata: Metadata = {
  title: 'iStudent Admin',
  description: 'iStudent Admin Panel - Mobile App',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/title.png', sizes: '32x32', type: 'image/png' },
      { url: '/title.png', sizes: '64x64', type: 'image/png' },
      { url: '/title.png', sizes: '128x128', type: 'image/png' }
    ],
    shortcut: '/title.png',
    apple: [
      { url: '/title.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  themeColor: '#3B82F6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'iStudent Admin'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>{children}</body>
    </html>
  )
}