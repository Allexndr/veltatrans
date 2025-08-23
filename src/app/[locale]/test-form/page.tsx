'use client';

import {useEffect} from 'react';

export default function TestFormPage() {
  useEffect(() => {
    // Загружаем скрипт Bitrix24
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

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Тест формы Bitrix24</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Форма заявки</h2>
          
          {/* Контейнер для формы Bitrix24 */}
          <div id="b24form_inline_2_36mjlr" className="min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка формы Bitrix24...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
