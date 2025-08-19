import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import PerformanceOptimizer from '@/components/PerformanceOptimizer';
import {SEO} from '@/utils/constants';
import '../globals.css';
import FloatingContacts from '@/components/FloatingContacts';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});
  
  return {
    title: {
      default: t('home.title'),
      template: `%s | ${t('home.title')}`
    },
    description: t('home.description'),
    keywords: SEO.DEFAULT_KEYWORDS,
    authors: [{ name: 'Velta Trans' }],
    creator: 'Velta Trans',
    publisher: 'Velta Trans',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SEO.SITE_URL),
    alternates: {
      canonical: '/',
      languages: {
        'ru': '/ru',
        'en': '/en',
        'kz': '/kz',
        'zh': '/zh',
      } as Record<string, string>,
    },
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
      url: SEO.SITE_URL,
      siteName: 'Velta Trans',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Velta Trans - Международная логистика',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.title'),
      description: t('home.description'),
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_SEO_GOOGLE || undefined,
      yandex: process.env.NEXT_PUBLIC_SEO_YANDEX || undefined,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({locale});

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {/* Floating contacts: update with real contacts */}
        <FloatingContacts
          phone={'+77001234567'}
          email={'info@velta-logistics.com'}
          whatsapp={'77001234567'}
          telegram={'veltatrans'}
        />
      </div>
      
      {/* Service Worker Registration - Only in production */}
      <Script
        id="service-worker"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `,
        }}
      />
    </NextIntlClientProvider>
  );
}
