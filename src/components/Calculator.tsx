'use client';

import {useEffect} from 'react';
import {useTranslations} from 'next-intl';

export default function Calculator() {
  const t = useTranslations('calculator');
  useEffect(() => {
    // Функция для загрузки скрипта Bitrix24
    const loadBitrixScript = () => {
      console.log('Loading Bitrix24 script for Calculator...');
      
      // Проверяем, не загружен ли уже скрипт
      if (document.querySelector('script[data-b24-form="inline/2/36mjlr"]')) {
        console.log('Script already loaded, skipping...');
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
      console.log('Script added to head');

      // Проверяем загрузку через 5 секунд
      setTimeout(() => {
        const formContainer = document.getElementById('b24form_calculator_main');
        console.log('Checking form container:', formContainer);
        if (formContainer && formContainer.children.length === 0) {
          console.log('Form not loaded, showing fallback message');
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
        } else {
          console.log('Form loaded successfully or container has content');
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
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('title')}</h3>
        <p className="text-gray-600">{t('description')}</p>
      </div>

      {/* Bitrix24 форма будет загружена здесь */}
      <div id="b24form_calculator_main" className="min-h-[400px]">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velta-navy mx-auto mb-4"></div>
          <p className="text-gray-600">{t('form.calculating')}</p>
        </div>
      </div>
      
      {/* Информация о времени ответа */}
      <div className="text-center text-sm text-gray-500">{t('note')}</div>
    </div>
  );
} 