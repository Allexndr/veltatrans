# Velta Trans - International Logistics Company

A modern, multilingual website for Velta Trans, an international logistics company specializing in freight transportation across CIS, China, and Europe.

## Features

- 🌍 **Multilingual Support**: Available in Russian, English, Chinese, and Kazakh
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- 🔄 **Dynamic Content**: Server-side rendering with internationalization

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Deployment**: Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Allexndr/veltatrans.git
cd veltatrans
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Dynamic locale routing
│   │   ├── about/         # About page
│   │   ├── calculator/    # Cost calculator
│   │   ├── contacts/      # Contact page
│   │   ├── directions/    # Service directions
│   │   ├── documents/     # Documentation
│   │   ├── rates/         # Pricing
│   │   ├── services/      # Services page
│   │   ├── layout.tsx     # Layout with navigation
│   │   └── page.tsx       # Home page
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── LanguageSwitcher.tsx
│   └── ServicesPreview.tsx
└── i18n/                  # Internationalization
    ├── request.ts
    └── routing.ts
messages/                  # Translation files
├── en.json               # English
├── ru.json               # Russian
├── zh.json               # Chinese
└── kz.json               # Kazakh
```

## Internationalization

The website supports multiple languages:
- 🇷🇺 Russian (`/ru`)
- 🇺🇸 English (`/en`)
- 🇨🇳 Chinese (`/zh`)
- 🇰🇿 Kazakh (`/kz`)

Language switching is available through the navigation menu.

## Services

- **Logistics Services**: Transportation organization of any complexity
- **Customs Clearance**: Full cargo support through customs
- **Consultation**: Professional logistics consultation

## Contact

For business inquiries, please visit the [Contacts page](/contacts) or use the contact form on the website.

## License

This project is proprietary software for Velta Trans.

## Deployment

The project is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and deploy
3. Environment variables can be configured in Vercel dashboard

---

Built with ❤️ for Velta Trans
