"use client";

import {motion} from "framer-motion";
import {useEffect, useState} from "react";

type FloatingContactsProps = {
  phone: string;
  email: string;
  whatsapp?: string; // phone without symbols, e.g. 77001234567
  telegram?: string; // username without @
  chatHref?: string; // optional on-site chat link
};

const isMobileUserAgent = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export default function FloatingContacts({
  phone,
  email,
  whatsapp,
  telegram,
  chatHref,
}: FloatingContactsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileUserAgent());
  }, []);

  const items = [
    chatHref && {
      key: "chat",
      href: chatHref,
      label: "Чат",
      bg: "bg-indigo-600",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path
            d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8-1.11 0-2.17-.18-3.15-.5L3 21l1.5-4.5C3.54 15.18 3 13.65 3 12 3 7.582 7.03 4 12 4s9 3.582 9 8z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Онлайн-чат",
    },
    whatsapp && {
      key: "whatsapp",
      href: `https://wa.me/${whatsapp}`,
      label: "WhatsApp",
      bg: "bg-emerald-600",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path
            d="M20.52 3.48A11.9 11.9 0 0012.02 0C5.4 0 .06 5.34.06 11.97c0 2.11.55 4.15 1.6 5.96L0 24l6.23-1.63a12 12 0 005.8 1.5h.01c6.62 0 11.97-5.34 11.97-11.97 0-3.2-1.25-6.21-3.49-8.42zM12.04 22a9.96 9.96 0 01-5.07-1.39l-.36-.21-3.7.97.99-3.6-.24-.37a9.95 9.95 0 01-1.52-5.39c0-5.5 4.48-9.98 9.99-9.98 2.67 0 5.18 1.04 7.06 2.93a9.94 9.94 0 012.93 7.05c0 5.5-4.48 9.99-9.99 9.99zm5.78-7.47c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.83 1.04-1.02 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.59-1.9-1.77-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.4.48-.61.16-.21.21-.37.32-.61.11-.24.05-.45-.02-.61-.08-.16-.72-1.73-.98-2.36-.26-.64-.52-.55-.72-.56l-.61-.01c-.21 0-.53.08-.81.37-.29.32-1.1 1.08-1.1 2.63 0 1.54 1.13 3.03 1.29 3.25.16.21 2.22 3.38 5.38 4.74.75.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.3-.21-.61-.37z"
            fill="currentColor"
          />
        </svg>
      ),
      title: "Написать в WhatsApp",
    },
    telegram && {
      key: "telegram",
      href: `https://t.me/${telegram}`,
      label: "Telegram",
      bg: "bg-sky-600",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path
            d="M9.03 14.67l-.38 5.36c.54 0 .77-.23 1.05-.5l2.52-2.42 5.22 3.82c.96.53 1.65.25 1.91-.89l3.46-16.21h.01c.31-1.47-.53-2.05-1.46-1.69L1.3 9.63C-.12 10.2-.1 11.03 1.05 11.39l5.08 1.58 11.79-7.43c.55-.34 1.06-.15.64.19"
            fill="currentColor"
          />
        </svg>
      ),
      title: "Открыть Telegram",
    },
    phone && {
      key: "phone",
      href: isMobile ? `tel:${phone}` : `tel:${phone}`,
      label: phone,
      bg: "bg-velta-navy",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
            fill="currentColor"
          />
        </svg>
      ),
      title: "Позвонить",
    },
    email && {
      key: "email",
      href: `mailto:${email}`,
      label: email,
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
      title: "Написать на email",
    },
  ].filter(Boolean) as Array<{
    key: string;
    href: string;
    label: string;
    bg: string;
    icon: React.ReactNode;
    title: string;
  }>;

  return (
    <div className="fixed right-3 sm:right-4 md:right-6 bottom-20 sm:bottom-24 md:bottom-28 z-50 flex flex-col gap-2 sm:gap-3">
      {items.map((item, index) => (
        <motion.a
          key={item.key}
          href={item.href}
          target={item.key === "email" || item.key === "phone" ? undefined : "_blank"}
          rel="noopener noreferrer"
          className={`${item.bg} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-12 h-12 sm:w-12 sm:h-12 focus:outline-none focus:ring-2 focus:ring-white/60`}
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
  );
}

