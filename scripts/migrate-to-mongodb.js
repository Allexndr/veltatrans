const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// MongoDB конфигурация
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'velta_trans';

// Функция для генерации всех возможных вариантов номера телефона
function generatePhoneVariants(originalPhone) {
  const variants = new Set();
  
  // Оригинальный номер
  variants.add(originalPhone);
  
  // Убираем все символы кроме цифр
  const digitsOnly = originalPhone.replace(/[^\d]/g, '');
  
  // В Казахстане 870 и 770 - это один код страны
  if (digitsOnly.startsWith('870')) {
    // Оригинал: +870...
    variants.add(`+${digitsOnly}`);
    variants.add(`+770${digitsOnly.slice(3)}`); // Заменяем 870 на 770
    variants.add(`870${digitsOnly.slice(3)}`);
    variants.add(`770${digitsOnly.slice(3)}`);
    
    // С пробелами
    const formatted = `${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 9)} ${digitsOnly.slice(9)}`;
    variants.add(formatted);
    variants.add(`+${formatted}`);
    variants.add(`+770${formatted.slice(2)}`);
    
    // Без пробелов
    variants.add(digitsOnly);
    variants.add(`+${digitsOnly}`);
    variants.add(`+770${digitsOnly.slice(3)}`);
    
    // Варианты с 770
    const with770 = `770${digitsOnly.slice(3)}`;
    variants.add(with770);
    variants.add(`+${with770}`);
    variants.add(`8${with770.slice(1)}`);
    variants.add(`7${with770.slice(1)}`);
    
  } else if (digitsOnly.startsWith('770')) {
    // Вариант: +770...
    variants.add(`+${digitsOnly}`);
    variants.add(`+870${digitsOnly.slice(3)}`); // Заменяем 770 на 870
    variants.add(`7${digitsOnly.slice(1)}`);
    variants.add(`8${digitsOnly.slice(1)}`);
    
    // С пробелами
    const formatted = `${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 9)} ${digitsOnly.slice(9)}`;
    variants.add(formatted);
    variants.add(`+${formatted}`);
    variants.add(`+870${formatted.slice(2)}`);
    
    // Без пробелов
    variants.add(digitsOnly);
    variants.add(`+${digitsOnly}`);
    variants.add(`+870${digitsOnly.slice(3)}`);
    
    // Варианты с 870
    const with870 = `870${digitsOnly.slice(3)}`;
    variants.add(with870);
    variants.add(`+${with870}`);
    variants.add(`8${with870.slice(1)}`);
    variants.add(`7${with870.slice(1)}`);
    // Оригинал: +870...
    variants.add(`+${digitsOnly}`);
    variants.add(`+770${digitsOnly.slice(3)}`); // Заменяем 870 на 770
    variants.add(`870${digitsOnly.slice(3)}`);
    variants.add(`770${digitsOnly.slice(3)}`);
    
    // С пробелами
    const formatted = `${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 9)} ${digitsOnly.slice(9)}`;
    variants.add(formatted);
    variants.add(`+${formatted}`);
    variants.add(`+770${formatted.slice(2)}`);
    
    // Без пробелов
    variants.add(digitsOnly);
    variants.add(`+${digitsOnly}`);
    variants.add(`+770${digitsOnly.slice(3)}`);
    
    // Варианты с 770
    const with770 = `770${digitsOnly.slice(3)}`;
    variants.add(with770);
    variants.add(`+${with770}`);
    variants.add(`8${with770.slice(1)}`);
    variants.add(`7${with770.slice(1)}`);
    
  } else if (digitsOnly.startsWith('770')) {
    // Вариант: +770...
    variants.add(`+${digitsOnly}`);
    variants.add(`+870${digitsOnly.slice(3)}`); // Заменяем 770 на 870
    variants.add(`7${digitsOnly.slice(1)}`);
    variants.add(`8${digitsOnly.slice(1)}`);
    
    // С пробелами
    const formatted = `${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 9)} ${digitsOnly.slice(9)}`;
    variants.add(formatted);
    variants.add(`+${formatted}`);
    variants.add(`+870${formatted.slice(2)}`);
    
    // Без пробелов
    variants.add(digitsOnly);
    variants.add(`+${digitsOnly}`);
    variants.add(`+870${digitsOnly.slice(3)}`);
    
    // Варианты с 870
    const with870 = `870${digitsOnly.slice(3)}`;
    variants.add(with870);
    variants.add(`+${with870}`);
    variants.add(`8${with870.slice(1)}`);
    variants.add(`7${with870.slice(1)}`);
    
  } else if (digitsOnly.startsWith('998')) {
    // Узбекские номера
    variants.add(`+${digitsOnly}`);
    variants.add(`+7${digitsOnly.slice(1)}`);
    
    // С пробелами
    const formatted = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 8)} ${digitsOnly.slice(8)}`;
    variants.add(formatted);
    variants.add(`+${formatted}`);
    
    variants.add(digitsOnly);
    variants.add(`+${digitsOnly}`);
  } else if (digitsOnly.startsWith('996')) {
    // Кыргызские номера
    variants.add(`+${digitsOnly}`);
    variants.add(`+7${digitsOnly.slice(1)}`);
    
    // С пробелами
    const formatted = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 8)} ${digitsOnly.slice(8)}`;
    variants.add(formatted);
    variants.add(`+${formatted}`);
    
    variants.add(digitsOnly);
    variants.add(`+${digitsOnly}`);
  } else {
    // Для остальных номеров
    variants.add(`+${digitsOnly}`);
    variants.add(digitsOnly);
    
    // С пробелами (если номер достаточно длинный)
    if (digitsOnly.length >= 10) {
      const formatted = `${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 9)} ${digitsOnly.slice(9)}`;
      variants.add(formatted);
      variants.add(`+${formatted}`);
    }
  }
  
  return Array.from(variants);
}

async function migrateToMongoDB() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🚀 Подключаюсь к MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);
    
    console.log('✅ Подключение к MongoDB установлено');
    
    // Очищаем существующие коллекции
    console.log('🧹 Очищаю существующие коллекции...');
    await db.collection('drivers').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('user_states').deleteMany({});
    await db.collection('staff_users').deleteMany({});
    
    // 1. Мигрируем водителей
    console.log('👥 Мигрирую водителей...');
    const driversData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/velta-data/drivers.json'), 'utf8'));
    
    const driversToInsert = driversData.map((driver, index) => {
      const phoneVariants = generatePhoneVariants(driver.phone);
      
      return {
        id: index + 1,
        name: driver.name,
        phone: driver.phone,
        phoneVariants: phoneVariants,
        carNumber: driver.carNumber,
        carType: driver.carType,
        experience: driver.experience || '5+ лет',
        rating: driver.rating || 4.5,
        status: driver.status || 'active',
        location: driver.location || 'Алматы',
        createdAt: new Date(driver.createdAt || new Date()),
        originalData: driver.originalData || {
          vehicleType: 'Тент (20 т)',
          carrier: 'ЧАСТНОЕ ЛИЦО',
          fullVehicle: driver.carNumber
        }
      };
    });
    
    if (driversToInsert.length > 0) {
      const result = await db.collection('drivers').insertMany(driversToInsert);
      console.log(`✅ Мигрировано ${result.insertedCount} водителей`);
    }
    
    // 2. Мигрируем заказы
    console.log('📦 Мигрирую заказы...');
    const ordersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/velta-data/orders.json'), 'utf8'));
    
    const ordersToInsert = ordersData.map(order => ({
      id: order.id,
      trackingNumber: order.trackingNumber,
      clientName: order.clientName,
      weight: order.weight,
      volume: order.volume,
      route: order.route,
      clientPhone: order.clientPhone,
      clientEmail: order.clientEmail,
      status: order.status,
      price: order.price,
      currency: order.currency,
      createdAt: new Date(order.createdAt),
      deadline: new Date(order.deadline),
      description: order.description,
      driverId: order.driverId,
      driverBids: order.driverBids.map(bid => ({
        ...bid,
        createdAt: new Date(bid.createdAt)
      })),
      routePoints: order.routePoints.map(point => ({
        ...point,
        timestamp: new Date(point.timestamp)
      }))
    }));
    
    if (ordersToInsert.length > 0) {
      const result = await db.collection('orders').insertMany(ordersToInsert);
      console.log(`✅ Мигрировано ${result.insertedCount} заказов`);
    }
    
    // 3. Мигрируем состояния пользователей
    console.log('👤 Мигрирую состояния пользователей...');
    const userStatesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/velta-data/user_states.json'), 'utf8'));
    
    const userStatesToInsert = Object.entries(userStatesData).map(([userId, state]) => ({
      userId: parseInt(userId),
      chatId: state.chatId || parseInt(userId),
      step: state.step,
      driverAuthed: state.driverAuthed || false,
      driverData: state.driverData,
      staffAuthed: state.staffAuthed || false,
      staffStep: state.staffStep,
      staffLogin: state.staffLogin,
      orderNumberForStatus: state.orderNumberForStatus,
      createdAt: new Date(state.createdAt || new Date()),
      updatedAt: new Date()
    }));
    
    if (userStatesToInsert.length > 0) {
      const result = await db.collection('user_states').insertMany(userStatesToInsert);
      console.log(`✅ Мигрировано ${result.insertedCount} состояний пользователей`);
    }
    
    // 4. Мигрируем сотрудников
    console.log('👨‍💼 Мигрирую сотрудников...');
    const staffData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/velta-data/staff_users.json'), 'utf8'));
    
    const staffToInsert = staffData.map(staff => ({
      id: staff.id,
      name: staff.name,
      phone: staff.phone,
      role: staff.role,
      permissions: staff.permissions,
      login: staff.login,
      password: staff.password,
      createdAt: new Date(staff.createdAt)
    }));
    
    if (staffToInsert.length > 0) {
      const result = await db.collection('staff_users').insertMany(staffToInsert);
      console.log(`✅ Мигрировано ${result.insertedCount} сотрудников`);
    }
    
    // 5. Создаем индексы для быстрого поиска
    console.log('🔍 Создаю индексы...');
    
    // Индекс для поиска водителей по номеру телефона
    await db.collection('drivers').createIndex({ phone: 1 });
    await db.collection('drivers').createIndex({ phoneVariants: 1 });
    await db.collection('drivers').createIndex({ status: 1 });
    
    // Индекс для заказов
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ driverId: 1 });
    await db.collection('orders').createIndex({ trackingNumber: 1 });
    
    // Индекс для состояний пользователей
    await db.collection('user_states').createIndex({ userId: 1 });
    await db.collection('user_states').createIndex({ driverAuthed: 1 });
    
    // Индекс для сотрудников
    await db.collection('staff_users').createIndex({ login: 1 });
    await db.collection('staff_users').createIndex({ role: 1 });
    
    console.log('✅ Индексы созданы');
    
    // 6. Показываем статистику
    console.log('\n📊 Статистика миграции:');
    console.log(`👥 Водители: ${await db.collection('drivers').countDocuments()}`);
    console.log(`📦 Заказы: ${await db.collection('orders').countDocuments()}`);
    console.log(`👤 Состояния пользователей: ${await db.collection('user_states').countDocuments()}`);
    console.log(`👨‍💼 Сотрудники: ${await db.collection('staff_users').countDocuments()}`);
    
    console.log('\n🎉 Миграция завершена успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при миграции:', error);
  } finally {
    await client.close();
  }
}

// Запускаем миграцию
migrateToMongoDB().catch(console.error);
