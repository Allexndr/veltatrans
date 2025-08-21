import {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://velta-trans.com';
  const locales = ['ru','en','kz','zh'];
  const pages = ['','/services','/cases','/rates','/directions','/documents','/contacts'];
  const serviceSlugs = ['/services/air','/services/sea','/services/land','/services/multimodal'];

  const urls: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of [...pages, ...serviceSlugs]) {
      urls.push({
        url: `${baseUrl}/${locale}${p}`,
        changeFrequency: 'weekly',
        priority: p === '' ? 1 : 0.7,
        lastModified: new Date()
      });
    }
  }
  return urls;
}


