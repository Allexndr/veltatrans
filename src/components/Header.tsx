'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export default function Header() {
  const t = useTranslations('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    {name: t('home'), href: '/'},
    {name: t('about'), href: '/about'},
    {name: t('services'), href: '/services'},
    {name: t('cases'), href: '/cases'},
    {name: t('rates'), href: '/rates'},
    {name: t('directions'), href: '/directions'},
    {name: t('documents'), href: '/documents'},
    {name: t('contacts'), href: '/contacts'},
  ];

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
    scrolled: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  const navItemVariants = {
    hover: {
      y: -2,
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" as const }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" as const }
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200/50"
      variants={headerVariants}
      initial="initial"
      animate="animate"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            <Logo size="lg" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-2">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                variants={navItemVariants}
                whileHover="hover"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="relative text-gray-700 hover:text-velta-navy px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-velta-50 hover:to-velta-100 group border-2 border-gray-300 hover:border-velta-royal-blue"
                >
                  <span className="relative z-10">{item.name}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-velta-100 to-velta-200 rounded-lg opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Tablet Navigation - Compact */}
          <nav className="hidden md:flex lg:hidden space-x-1">
            {navigation.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-velta-navy px-2 py-1 text-xs font-medium transition-all duration-300 hover:bg-velta-50 rounded-md border border-gray-300 hover:border-velta-royal-blue"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <button className="text-gray-700 hover:text-velta-navy px-2 py-1 text-xs font-medium transition-all duration-300 hover:bg-velta-50 rounded-md">
                ...
              </button>
              <motion.div 
                className="absolute right-0 top-full mt-2 w-32 bg-white/95 backdrop-blur-md shadow-xl rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
                initial={{ y: -10, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
              >
                {navigation.slice(6).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-xs text-gray-700 hover:text-velta-navy hover:bg-velta-50 transition-colors rounded-lg mx-1 my-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </nav>

          {/* Language Switcher and Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <LanguageSwitcher />
            </motion.div>
            
            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-velta-navy hover:bg-velta-50 focus:outline-none focus:ring-2 focus:ring-velta-royal-blue transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden overflow-hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="px-2 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-200">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-velta-navy hover:bg-velta-50 block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border border-gray-300 hover:border-velta-royal-blue"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
