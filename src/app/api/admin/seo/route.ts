import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const SEO_DATA_FILE = join(process.cwd(), 'seo-data.json');

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  googleVerification: string;
  yandexVerification: string;
  lastUpdated: string;
}

const defaultSEOData: SEOData = {
  title: 'Velta Trans - Международные грузоперевозки по СНГ, Китаю и Европе',
  description: 'Международная логистическая компания Velta Trans. Надежные грузоперевозки автомобильным, железнодорожным, морским и авиатранспортом. Таможенное оформление и полный сервис.',
  keywords: 'грузоперевозки, логистика, международные перевозки, Китай, СНГ, Казахстан, Россия, таможенное оформление, доставка грузов, мультимодальные перевозки',
  googleVerification: process.env.NEXT_PUBLIC_SEO_GOOGLE || '',
  yandexVerification: process.env.NEXT_PUBLIC_SEO_YANDEX || '',
  lastUpdated: new Date().toISOString()
};

export async function GET() {
  try {
    const data = await readFile(SEO_DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Если файл не существует, возвращаем дефолтные данные
    return NextResponse.json(defaultSEOData);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const seoData: SEOData = {
      title: body.title || defaultSEOData.title,
      description: body.description || defaultSEOData.description,
      keywords: body.keywords || defaultSEOData.keywords,
      googleVerification: body.googleVerification || defaultSEOData.googleVerification,
      yandexVerification: body.yandexVerification || defaultSEOData.yandexVerification,
      lastUpdated: new Date().toISOString()
    };

    // Сохраняем в файл
    await writeFile(SEO_DATA_FILE, JSON.stringify(seoData, null, 2));

    // Обновляем переменные окружения (для следующих запросов)
    process.env.NEXT_PUBLIC_SEO_TITLE = seoData.title;
    process.env.NEXT_PUBLIC_SEO_DESCRIPTION = seoData.description;
    process.env.NEXT_PUBLIC_SEO_KEYWORDS = seoData.keywords;

    return NextResponse.json({ 
      success: true, 
      message: 'SEO данные успешно сохранены',
      data: seoData 
    });
  } catch (error) {
    console.error('Error saving SEO data:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка при сохранении данных' },
      { status: 500 }
    );
  }
}

