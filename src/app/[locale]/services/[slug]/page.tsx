import {getTranslations} from 'next-intl/server';
import type {Metadata} from 'next';
import {routing, Link} from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type ServiceSlug = 'air' | 'sea' | 'land' | 'multimodal';

const SLUG_TO_I18N_KEY: Record<ServiceSlug, {title: string; description: string}> = {
  air: {title: 'services.air.title', description: 'services.air.description'},
  sea: {title: 'services.sea.title', description: 'services.sea.description'},
  land: {title: 'services.land.title', description: 'services.land.description'},
  multimodal: {title: 'services.multimodal.title', description: 'services.multimodal.description'}
};

export function generateStaticParams() {
  const slugs: ServiceSlug[] = ['air', 'sea', 'land', 'multimodal'];
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({locale, slug})));
}

export async function generateMetadata({params}: {params: Promise<{locale: string; slug: ServiceSlug}>}): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale});
  const i18nKey = SLUG_TO_I18N_KEY[slug];
  const title = t(i18nKey.title);
  const description = t(i18nKey.description);
  return {
    title,
    description,
    openGraph: {title, description},
    twitter: {title, description}
  };
}

export default async function ServiceDetailPage({params}: {params: Promise<{locale: string; slug: ServiceSlug}>}) {
  const {locale, slug} = await params;
  const t = await getTranslations({locale});
  const i18nKey = SLUG_TO_I18N_KEY[slug];

  const title = t(i18nKey.title);
  const description = t(i18nKey.description);

  // Получаем данные для конкретного сервиса
  const serviceKey = `services.${slug}`;
  const advantages = t.has(`${serviceKey}.advantages`) ? t.raw(`${serviceKey}.advantages`) as string[] : [
    t('home.features.experience'),
    t('home.features.geography'),
    t('home.features.support')
  ];

  const features = t.has(`${serviceKey}.details.features`) ? t.raw(`${serviceKey}.details.features`) as string[] : [];
  const detailedDescription = t.has(`${serviceKey}.details.description`) ? t(`${serviceKey}.details.description`) : description;

  const examples = [
    {
      title: t('cases.case1.title'),
      description: t('cases.case1.description')
    },
    {
      title: t('cases.case2.title'),
      description: t('cases.case2.description')
    },
    {
      title: t('cases.case3.title'),
      description: t('cases.case3.description')
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-custom-blue-900 via-custom-blue-800 to-custom-blue-700 text-white py-14 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              {title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-custom-blue-100 max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main description */}
            <article className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {detailedDescription}
              </p>
              
              {features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Особенности сервиса:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Наша компания обеспечивает полный цикл логистических услуг с индивидуальным подходом к каждому клиенту. 
                  Мы гарантируем прозрачность процессов, своевременную доставку и конкурентные цены.
                </p>
                <p>
                  Опытная команда специалистов поможет выбрать оптимальное решение для ваших потребностей 
                  и обеспечит сопровождение груза на всех этапах транспортировки.
                </p>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('services.title')}</h3>
                <ul className="space-y-2">
                  {([['air','✈️'], ['sea','🚢'], ['land','🚚'], ['multimodal','🔀']] as [ServiceSlug,string][]) .map(([s, icon]) => (
                    <li key={s} className={`flex items-center justify-between py-2 px-3 rounded-lg ${slug===s? 'bg-custom-blue-50 text-custom-blue-900' : 'text-gray-700 hover:bg-gray-50'}`}>
                      <span className="flex items-center gap-2">
                        <span aria-hidden>{icon}</span>
                        {t(SLUG_TO_I18N_KEY[s].title)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 bg-gradient-to-br from-custom-blue-600 to-custom-blue-700 text-white rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-2">{t('contact_form.title')}</h4>
                <p className="text-white/90 mb-4">{t('contact_form.description')}</p>
                <Link href="/contacts" className="inline-block bg-white text-custom-blue-700 font-semibold px-5 py-3 rounded-lg hover:opacity-90 transition">{t('home.cta')}</Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Преимущества</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((advantage, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-custom-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="font-semibold text-gray-900 text-sm leading-tight">{advantage}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('cases.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {examples.map((ex, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-custom-blue-600 to-custom-blue-700 rounded-xl mb-4" />
                  <div className="font-semibold text-gray-900 mb-1">{ex.title}</div>
                  <div className="text-gray-600">{ex.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


