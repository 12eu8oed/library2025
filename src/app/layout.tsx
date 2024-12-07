import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '도서관 찾기',
  description: '내 주변 도서관 찾기 앱',
  manifest: '/manifest.json',
  themeColor: '#2c3e50',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '도서관 찾기',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="도서관 찾기" />
        <meta name="theme-color" content="#2c3e50" />
      </head>
      <body>{children}</body>
    </html>
  )
}
