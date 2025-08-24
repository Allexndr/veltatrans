// This file is required for the app directory to work
// The actual layout is in /app/[locale]/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './responsive.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Velta Trans - Международные логистические услуги',
  description: 'Профессиональные логистические услуги: автоперевозки, железнодорожные перевозки, мультимодальные перевозки, проектные перевозки. Доставка грузов по всему миру.',
  keywords: 'логистика, перевозки, доставка, груз, Казахстан, Китай, Россия, Европа',
  authors: [{ name: 'Velta Trans' }],
  creator: 'Velta Trans',
  publisher: 'Velta Trans',
  robots: 'index, follow',
  openGraph: {
    title: 'Velta Trans - Международные логистические услуги',
    description: 'Профессиональные логистические услуги по всему миру',
    url: 'https://www.velta-logistics.com',
    siteName: 'Velta Trans',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velta Trans - Международные логистические услуги',
    description: 'Профессиональные логистические услуги по всему миру',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const themeColor = '#0050A0'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Velta Trans" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
