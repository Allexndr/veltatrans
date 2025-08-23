'use client';

import {useEffect} from 'react';
import {useTranslations} from 'next-intl';

export default function ContactForm() {
  const t = useTranslations();

  useEffect(() => {
    // Функция для загрузки скрипта Bitrix24
    const loadBitrixScript = () => {
      // Проверяем, не загружен ли уже скрипт
      if (document.querySelector('script[data-b24-form="inline/2/36mjlr"]')) {
        return;
      }

      // Создаем и добавляем скрипт
      const script = document.createElement('script');
      script.setAttribute('data-b24-form', 'inline/2/36mjlr');
      script.setAttribute('data-skip-moving', 'true');
      script.innerHTML = `
        (function(w,d,u){
          var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
          var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
        })(window,document,'https://cdn-ru.bitrix24.kz/b34575790/crm/form/loader_2.js');
      `;
      
      document.head.appendChild(script);

      // Проверяем загрузку через 5 секунд
      setTimeout(() => {
        const formContainer = document.getElementById('b24form_contact');
        if (formContainer && formContainer.children.length === 0) {
          // Если форма не загрузилась, показываем сообщение
          formContainer.innerHTML = `
            <div class="text-center py-8">
              <div class="text-gray-500 mb-4">
                <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-gray-600 mb-4">Форма временно недоступна</p>
              <p class="text-sm text-gray-500">Пожалуйста, свяжитесь с нами по телефону или через другие контакты</p>
            </div>
          `;
        }
      }, 5000);
    };

    // Загружаем скрипт
    loadBitrixScript();

    return () => {
      // Очищаем скрипт при размонтировании компонента
      const script = document.querySelector('script[data-b24-form="inline/2/36mjlr"]');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-velta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Телефон</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600">+7 700 277 00 06</p>
                    <p className="text-gray-600">+7 701 070 40 11</p>
                    <p className="text-gray-600">+7 701 070 40 22 (многоканальный)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-velta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">info@veltatrans.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-velta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Адрес</h3>
                  <p className="text-gray-600">Адрес офиса</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bitrix24 Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Напишите нам
              </h3>
              <p className="text-gray-600">
                Заполните форму и мы свяжемся с вами
              </p>
            </div>
            
            {/* Bitrix24 форма будет загружена здесь */}
            <div id="b24form_contact" className="min-h-[300px]">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velta-navy mx-auto mb-4"></div>
                <p className="text-gray-600">Загрузка формы...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
