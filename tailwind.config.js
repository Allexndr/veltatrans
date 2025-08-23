/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Velta Trans brand colors
        'velta': {
          'royal-blue': '#0050A0',
          'navy': '#003F7D',
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0050A0', // Royal blue
          600: '#003F7D', // Navy
          700: '#00306b',
          800: '#002052',
          900: '#001038',
        }
      },
    },
  },
  plugins: [],
} 