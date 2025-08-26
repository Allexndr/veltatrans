import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import FloatingContacts from '@/components/FloatingContacts';
import Script from 'next/script';
import AnimatedTruck from '@/components/AnimatedTruck';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
      <div className={`${inter.variable} antialiased`}>
        {/* Анимированный грузовик */}
        <AnimatedTruck />
        
        {children}
        {/* Floating contacts: updated with real contacts */}
        <FloatingContacts
          phone={'+77002770006'}
          email={'info@velta-logistics.com'}
          whatsapp={'77010704011'}
          telegram={'velta_logistics_bot'}
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
