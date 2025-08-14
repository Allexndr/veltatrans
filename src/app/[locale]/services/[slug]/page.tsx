import {getTranslations} from 'next-intl/server';
import type {Metadata} from 'next';
import {routing} from '@/i18n/routing';
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

  const advantages = [
    t('home.features.experience'),
    t('home.features.geography'),
    t('home.features.support')
  ];

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
                {description}
              </p>
              <div className="space-y-4 text-gray-700">
                <p>
                  {/* Placeholder paragraph for future detailed content */}
                  {t('home.description')}
                </p>
                <p>
                  {t('tools.description')}
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
                <a href="/contacts" className="inline-block bg-white text-custom-blue-700 font-semibold px-5 py-3 rounded-lg hover:opacity-90 transition">{t('home.cta')}</a>
              </div>
            </aside>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('recommendations.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advantages.map((adv, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="text-custom-blue-700 text-2xl mb-2">•</div>
                  <div className="font-semibold text-gray-900 mb-1">{adv}</div>
                  <div className="text-gray-600">{t('home.description')}</div>
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


