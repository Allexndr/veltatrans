# Velta Trans - International Logistics Company

🌐 **Multilingual** | 📱 **Responsive** | ⚡ **Fast** | 🎨 **Modern UI**

A comprehensive B2B logistics website with full internationalization support, featuring advanced tools and customer-focused functionality.

## 🚀 **New Features Implemented**

### 1. **Cases Section with Photos** 📸
- **Portfolio showcase** of successful transportation projects
- **Category filtering** (General, Container, Oversized, Dangerous, Consolidated, Project cargo)
- **Visual presentation** with transportation photos and detailed descriptions
- **Builds trust** by showing real examples of similar cargo transportation

### 2. **Write to Management Function** ✉️
- **Direct communication** with company management
- **Multiple contact options**: Report problems, leave reviews, send suggestions, cooperation proposals
- **Professional form** with validation and success feedback
- **Creates transparency** and builds customer confidence

### 3. **Recommendations Section** ⭐
- **Customer testimonials** with company names and positions
- **Star ratings** and detailed feedback
- **Certificates and awards** display
- **Reputational advantage** through social proof

### 4. **Delivery Cost Calculator** 🧮
- **Real-time calculation** of transportation costs
- **Multiple parameters**: weight, volume, dimensions, oversized cargo
- **City-to-city routing** with comprehensive form
- **Instant results** with delivery time and service type

### 5. **Cargo Tracking System** 📍
- **Real-time tracking** using tracking numbers
- **Status updates** with detailed movement history
- **Visual timeline** showing cargo progress
- **Estimated delivery** information

### 6. **Document Download Center** 📄
- **Comprehensive document library** organized by categories
- **Contract forms**, powers of attorney, requisites
- **Easy download** with file type and size information
- **Transparency** through accessible company documents

## 🛠 **Technical Stack**

- **Framework**: Next.js 15.4.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Internationalization**: next-intl
- **Deployment**: Vercel-ready

## 🌍 **Supported Languages**

- 🇷🇺 **Russian** (ru)
- 🇺🇸 **English** (en) 
- 🇨🇳 **Chinese** (zh)
- 🇰🇿 **Kazakh** (kz)

## 🎨 **Design Features**

- **Custom Blue Color Scheme** (#00509e)
- **Responsive Design** for all devices
- **Modern UI/UX** with smooth animations
- **Professional Layout** optimized for B2B clients

## 📁 **Project Structure**

```
src/
├── app/
│   └── [locale]/
│       ├── cases/           # Cases page
│       ├── write-to-management/  # Management contact
│       ├── documents/       # Document downloads
│       └── ...              # Other pages
├── components/
│   ├── CasesSection.tsx     # Portfolio showcase
│   ├── WriteToManagement.tsx # Contact management
│   ├── RecommendationsSection.tsx # Testimonials
│   ├── Calculator.tsx       # Cost calculator
│   ├── CargoTracking.tsx    # Tracking system
│   ├── DocumentsSection.tsx # Document center
│   └── ...                  # Other components
└── messages/
    ├── ru.json             # Russian translations
    ├── en.json             # English translations
    ├── zh.json             # Chinese translations
    └── kz.json             # Kazakh translations
```

## 🚀 **Getting Started**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd china
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

## 📋 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 **Internationalization**

The website supports 4 languages with automatic locale detection:

- **URL Structure**: `/{locale}/page`
- **Examples**: `/ru/`, `/en/`, `/zh/`, `/kz/`
- **Language Switcher**: Available in header navigation

## 🎯 **Key Business Benefits**

### **Customer Trust Building**
- ✅ **Visual proof** through case studies with photos
- ✅ **Direct management access** for transparency
- ✅ **Customer testimonials** and recommendations
- ✅ **Professional document library**

### **Operational Efficiency**
- ✅ **Self-service calculator** reduces inquiry calls
- ✅ **Online tracking** reduces support workload
- ✅ **Document downloads** save time for clients
- ✅ **Multilingual support** for international clients

### **Competitive Advantages**
- ✅ **B2B-focused design** with clear segmentation
- ✅ **Professional appearance** builds credibility
- ✅ **Comprehensive tools** demonstrate expertise
- ✅ **Modern technology** shows innovation

## 📱 **Responsive Design**

- **Mobile-first** approach
- **Tablet optimized** layouts
- **Desktop enhanced** features
- **Touch-friendly** interfaces

## 🔧 **Customization**

### **Colors**
The website uses a custom blue color scheme based on `#00509e`:
- Primary: `custom-blue-500` (#00509e)
- Light variants: `custom-blue-50` to `custom-blue-400`
- Dark variants: `custom-blue-600` to `custom-blue-900`

### **Content**
All text content is managed through translation files in `messages/` directory.

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Deploy automatically on push

### **Environment Variables**
No environment variables required for basic functionality.

## 📞 **Contact Information**

- **Company**: Velta Trans
- **Type**: International Logistics
- **Services**: B2B freight transportation
- **Regions**: CIS, China, Europe

## 📄 **License**

This project is private and proprietary.

---

**Built with ❤️ for Velta Trans**
