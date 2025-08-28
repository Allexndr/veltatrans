"use client";

import {motion} from "framer-motion";
import {useEffect, useState} from "react";

export default function FloatingContacts() {
  const [isMobile, setIsMobile] = useState(false);
  const [showPhoneNumbers, setShowPhoneNumbers] = useState(false);

  useEffect(() => {
    setIsMobile(typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const items = [
    // WhatsApp - переход на +7 700 277 00 06
    {
      key: "whatsapp",
      href: "https://wa.me/77002770006",
      bg: "bg-emerald-600",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path
            d="M20.52 3.48A11.9 11.9 0 0012.02 0C5.4 0 .06 5.34.06 11.97c0 2.11.55 4.15 1.6 5.96L0 24l6.23-1.63a12 12 0 005.8 1.5h.01c6.62 0 11.97-5.34 11.97-11.97 0-3.2-1.25-6.21-3.49-8.42zM12.04 22a9.96 9.96 0 01-5.07-1.39l-.36-.21-3.7.97.99-3.6-.24-.37a9.95 9.95 0 01-1.52-5.39c0-5.5 4.48-9.98 9.99-9.98 2.67 0 5.18 1.04 7.06 2.93a9.94 9.94 0 012.93 7.05c0 5.5-4.48 9.99-9.99 9.99zm5.78-7.47c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.83 1.04-1.02 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.59-1.9-1.77-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.4.48-.61.16-.21.21-.37.32-.61.11-.24.05-.45-.02-.61-.08-.16-.72-1.73-.98-2.36-.26-.64-.52-.55-.72-.56l-.61-.01c-.21 0-.53.08-.81.37-.29.32-1.1 1.08-1.1 2.63 0 1.54 1.13 3.03 1.29 3.25.16.21 2.22 3.38 5.38 4.74.75.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.3-.21-.61-.37z"
            fill="currentColor"
          />
        </svg>
      ),
      title: "WhatsApp +7 700 277 00 06",
    },
    // Телефон - показывает все 3 номера
    {
      key: "phone",
      href: "#",
      bg: "bg-velta-navy",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
            fill="currentColor"
          />
        </svg>
      ),
      title: "Показать все номера",
      onClick: () => setShowPhoneNumbers(!showPhoneNumbers),
    },
    // Email - переход на velta@velta.com.kz
    {
      key: "email",
      href: "mailto:velta@velta.com.kz",
      bg: "bg-rose-600",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path
            d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2l8 5 8-5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Email: velta@velta.com.kz",
    },
    // Telegram - переход на +7 701 070 40 22
    {
      key: "telegram-phone",
      href: "tel:+77010704022",
      bg: "bg-sky-600",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path
            d="M9.03 14.67l-.38 5.36c.54 0 .77-.23 1.05-.5l2.52-2.42 5.22 3.82c.96.53 1.65.25 1.91-.89l3.46-16.21h.01c.31-1.47-.53-2.05-1.46-1.69L1.3 9.63C-.12 10.2-.1 11.03 1.05 11.39l5.08 1.58 11.79-7.43c.55-.34 1.06-.15.64.19"
            fill="currentColor"
          />
        </svg>
      ),
      title: "Telegram +7 701 070 40 22",
    },
    // Telegram Bot - переход на @velta_logistics_bot
    {
      key: "telegram-bot",
      href: "https://t.me/velta_logistics_bot",
      bg: "bg-blue-600",
      icon: (
        <img 
          src="/assets/images/telegram-bot-icon.png" 
          alt="Telegram Bot" 
          className="w-11 h-11 object-contain"
        />
      ),
      title: "Telegram Bot @velta_logistics_bot",
    },
  ];

  return (
    <>
      {/* Основные значки */}
      <div className="fixed right-3 sm:right-4 md:right-6 bottom-20 sm:bottom-24 md:bottom-28 z-50 flex flex-col gap-2 sm:gap-3">
        {items.map((item, index) => (
          <motion.a
            key={item.key}
            href={item.onClick ? undefined : item.href}
            onClick={item.onClick}
            target={item.key === "email" || item.key === "phone" ? undefined : "_blank"}
            rel="noopener noreferrer"
            className={`${item.bg} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-12 h-12 sm:w-12 sm:h-12 focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer`}
            title={item.title}
            aria-label={item.title}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: index * 0.05, duration: 0.2}}
          >
            {item.icon}
          </motion.a>
        ))}
      </div>

      {/* Всплывающее окно с номерами телефонов */}
      {showPhoneNumbers && (
        <motion.div
          className="fixed right-20 sm:right-24 md:right-28 bottom-20 sm:bottom-24 md:bottom-28 z-50 bg-white rounded-lg shadow-2xl p-4 min-w-[280px]"
          initial={{opacity: 0, scale: 0.8}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0, scale: 0.8}}
        >
          <div className="text-sm font-medium text-gray-900 mb-3">Выберите номер:</div>
          <div className="space-y-2">
            <a
              href="tel:+77002770006"
              className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors"
            >
              <span className="text-velta-navy font-medium">+7 700 277 00 06</span>
              <span className="text-xs text-gray-500 ml-2">(Многоканальный)</span>
            </a>
            <a
              href="https://wa.me/77010704011"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors"
            >
              <span className="text-velta-navy font-medium">+7 701 070 40 11</span>
              <span className="text-xs text-gray-500 ml-2">(Sales)</span>
            </a>
            <a
              href="tel:+77010704022"
              className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors"
            >
              <span className="text-velta-navy font-medium">+7 701 070 40 22</span>
              <span className="text-xs text-gray-500 ml-2">(Логисты)</span>
            </a>
          </div>
          <button
            onClick={() => setShowPhoneNumbers(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Затемнение фона при открытом окне */}
      {showPhoneNumbers && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          onClick={() => setShowPhoneNumbers(false)}
        />
      )}
    </>
  );
}

