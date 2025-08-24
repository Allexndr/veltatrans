const fs = require('fs');
const path = require('path');

// Читаем полную базу данных водителей
const fullDriversPath = path.join(__dirname, '../materials/Контакты водителей.json');
const outputPath = path.join(__dirname, '../data/velta-data/drivers-full.json');

try {
  console.log('📁 Читаю полную базу данных водителей...');
  const fullData = fs.readFileSync(fullDriversPath, 'utf8');
  
  // Парсим JSON
  const drivers = JSON.parse(fullData);
  console.log(`✅ Найдено ${drivers.length} водителей в полной базе`);
  
  // Конвертируем в формат для бота
  const convertedDrivers = drivers.map((driver, index) => {
    // Нормализуем телефон
    let phone = driver['Телефон Водителя'] || '';
    if (typeof phone === 'number') {
      phone = phone.toString();
    }
    
    // Убираем лишние символы и нормализуем
    phone = phone.replace(/[^\d+]/g, '');
    if (phone.startsWith('8')) {
      phone = '+7' + phone.substring(1);
    } else if (phone.startsWith('7') && !phone.startsWith('+7')) {
      phone = '+7' + phone.substring(1);
    } else if (!phone.startsWith('+')) {
      phone = '+7' + phone;
    }
    
    // Определяем тип автомобиля
    let carType = 'tent'; // по умолчанию
    const vehicleType = driver['Вид подвижного состава'] || '';
    if (vehicleType.toLowerCase().includes('рефрижератор') || vehicleType.toLowerCase().includes('термос')) {
      carType = 'refrigerator';
    } else if (vehicleType.toLowerCase().includes('контейнер') || vehicleType.toLowerCase().includes('платформа')) {
      carType = 'container';
    } else if (vehicleType.toLowerCase().includes('автовоз')) {
      carType = 'car_carrier';
    } else if (vehicleType.toLowerCase().includes('спецтехника')) {
      carType = 'special';
    }
    
    return {
      id: index + 1,
      name: driver['Водитель'] || `Водитель ${index + 1}`,
      phone: phone,
      carNumber: driver['Автотранспорт'] || 'Не указан',
      carType: carType,
      experience: '5+ лет',
      rating: 4.5 + (Math.random() * 0.5), // Рейтинг 4.5-5.0
      status: 'active',
      location: 'Алматы',
      createdAt: new Date().toISOString(),
      // Дополнительные поля из оригинальной базы
      originalData: {
        vehicleType: vehicleType,
        carrier: driver['Перевозчик (ЮЛ/ЧЛ)'] || 'ЧАСТНОЕ ЛИЦО',
        fullVehicle: driver['Автотранспорт'] || ''
      }
    };
  });
  
  // Сохраняем конвертированные данные
  fs.writeFileSync(outputPath, JSON.stringify(convertedDrivers, null, 2));
  console.log(`✅ Конвертировано и сохранено ${convertedDrivers.length} водителей в ${outputPath}`);
  
  // Показываем статистику
  const phoneStats = {};
  convertedDrivers.forEach(driver => {
    const prefix = driver.phone.substring(0, 4);
    phoneStats[prefix] = (phoneStats[prefix] || 0) + 1;
  });
  
  console.log('\n📊 Статистика по номерам телефонов:');
  Object.entries(phoneStats).forEach(([prefix, count]) => {
    console.log(`  ${prefix}...: ${count} водителей`);
  });
  
  console.log('\n🚗 Статистика по типам автомобилей:');
  const carTypeStats = {};
  convertedDrivers.forEach(driver => {
    carTypeStats[driver.carType] = (carTypeStats[driver.carType] || 0) + 1;
  });
  Object.entries(carTypeStats).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} водителей`);
  });
  
} catch (error) {
  console.error('❌ Ошибка при конвертации:', error.message);
  process.exit(1);
}
