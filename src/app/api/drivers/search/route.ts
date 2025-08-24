import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Номер телефона обязателен' }, { status: 400 });
    }
    
    console.log('🔍 Поиск водителя по номеру:', phone);
    
    // Читаем данные из JSON файла
    const dataDir = path.join(process.cwd(), 'data', 'velta-data');
    const driversFile = path.join(dataDir, 'drivers.json');
    
    console.log('📁 Путь к файлу водителей:', driversFile);
    
    if (!fs.existsSync(driversFile)) {
      console.log('❌ Файл водителей не найден');
      return NextResponse.json({ error: 'База водителей не найдена' }, { status: 404 });
    }
    
    const drivers = JSON.parse(fs.readFileSync(driversFile, 'utf8'));
    console.log('👥 Загружено водителей:', drivers.length);
    
    // Нормализуем номер телефона
    const normalizedPhone = normalizePhone(phone);
    console.log('📱 Нормализованный номер:', normalizedPhone);
    
    // Ищем водителя по оригинальному номеру или вариантам
    const driver = drivers.find((d: any) => {
      console.log(`🔍 Проверяю водителя: ${d.name} - ${d.phone}`);
      
      // По оригинальному номеру
      if (d.phone === normalizedPhone) {
        console.log('✅ Найден по оригинальному номеру');
        return true;
      }
      
      // По вариантам номеров
      if (d.phoneVariants && Array.isArray(d.phoneVariants)) {
        if (d.phoneVariants.includes(normalizedPhone)) {
          console.log('✅ Найден по вариантам номеров');
          return true;
        }
      }
      
      // По точному совпадению цифр
      const driverDigits = d.phone.replace(/[^\d]/g, '');
      const searchDigits = normalizedPhone.replace(/[^\d]/g, '');
      if (driverDigits === searchDigits) {
        console.log('✅ Найден по цифрам');
        return true;
      }
      
      return false;
    });
    
    if (!driver) {
      console.log('❌ Водитель не найден');
      return NextResponse.json({ error: 'Водитель не найден' }, { status: 404 });
    }
    
    console.log('✅ Водитель найден:', driver.name);
    
    return NextResponse.json({ 
      success: true, 
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        carNumber: driver.carNumber,
        carType: driver.carType,
        experience: driver.experience,
        rating: driver.rating,
        status: driver.status,
        location: driver.location
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка поиска водителя:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

// Функция нормализации номера телефона
function normalizePhone(phone: string): string {
  console.log('📱 Нормализация номера:', phone);
  
  // Убираем все символы кроме цифр
  let digits = phone.replace(/[^\d]/g, '');
  console.log('📱 Только цифры:', digits);
  
  // В Казахстане 870 и 770 - это один код страны
  if (digits.startsWith('870')) {
    // Заменяем 870 на 770 для единообразия
    digits = '770' + digits.slice(3);
    console.log('📱 870→770:', digits);
  } else if (digits.startsWith('770')) {
    // Заменяем 770 на 870 для единообразия
    digits = '870' + digits.slice(3);
    console.log('📱 770→870:', digits);
  }
  
  // Если номер начинается с 8, заменяем на 7
  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
    console.log('📱 8→7:', digits);
  }
  
  // Добавляем + в начало
  const result = `+${digits}`;
  console.log('📱 Результат нормализации:', result);
  return result;
}
