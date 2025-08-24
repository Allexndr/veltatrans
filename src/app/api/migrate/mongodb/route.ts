import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Проверяем наличие MongoDB URI
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        message: 'MongoDB URI не настроен. Добавьте MONGODB_URI в .env.local',
        error: 'MONGODB_URI_MISSING'
      }, { status: 400 });
    }

    // Динамически импортируем MongoDB модули только при необходимости
    const { getDb } = await import('@/lib/mongodb');
    const db = await getDb();
    
    // Пути к JSON файлам
    const dataDir = path.join(process.cwd(), 'data', 'velta-data');
    const driversFile = path.join(dataDir, 'drivers.json');
    const ordersFile = path.join(dataDir, 'orders.json');
    const userStatesFile = path.join(dataDir, 'user_states.json');
    const staffUsersFile = path.join(dataDir, 'staff_users.json');
    
    let migratedCount = 0;
    const errors: string[] = [];
    
    // Миграция водителей
    if (fs.existsSync(driversFile)) {
      try {
        const driversData = JSON.parse(fs.readFileSync(driversFile, 'utf8'));
        const driversCollection = db.collection('drivers');
        
        // Очищаем коллекцию
        await driversCollection.deleteMany({});
        
        // Добавляем новые данные
        if (Array.isArray(driversData)) {
          const driversToInsert = driversData.map((driver: any) => ({
            ...driver,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          }));
          
          if (driversToInsert.length > 0) {
            await driversCollection.insertMany(driversToInsert);
            migratedCount += driversToInsert.length;
            console.log(`✅ Мигрировано ${driversToInsert.length} водителей`);
          }
        }
      } catch (error) {
        errors.push(`Ошибка миграции водителей: ${error}`);
      }
    }
    
    // Миграция заказов
    if (fs.existsSync(ordersFile)) {
      try {
        const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        const ordersCollection = db.collection('orders');
        
        // Очищаем коллекцию
        await ordersCollection.deleteMany({});
        
        // Добавляем новые данные
        if (Array.isArray(ordersData)) {
          const ordersToInsert = ordersData.map((order: any) => ({
            ...order,
            createdAt: order.createdAt || new Date().toISOString(),
            lastUpdate: order.lastUpdate || new Date().toISOString()
          }));
          
          if (ordersToInsert.length > 0) {
            await ordersCollection.insertMany(ordersToInsert);
            migratedCount += ordersToInsert.length;
            console.log(`✅ Мигрировано ${ordersToInsert.length} заказов`);
          }
        }
      } catch (error) {
        errors.push(`Ошибка миграции заказов: ${error}`);
      }
    }
    
    // Миграция состояний пользователей
    if (fs.existsSync(userStatesFile)) {
      try {
        const userStatesData = JSON.parse(fs.readFileSync(userStatesFile, 'utf8'));
        const userStatesCollection = db.collection('user_states');
        
        // Очищаем коллекцию
        await userStatesCollection.deleteMany({});
        
        // Добавляем новые данные
        if (typeof userStatesData === 'object') {
          const userStatesToInsert = Object.entries(userStatesData).map(([userId, state]: [string, any]) => ({
            userId: parseInt(userId),
            ...state,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          }));
          
          if (userStatesToInsert.length > 0) {
            await userStatesCollection.insertMany(userStatesToInsert);
            migratedCount += userStatesToInsert.length;
            console.log(`✅ Мигрировано ${userStatesToInsert.length} состояний пользователей`);
          }
        }
      } catch (error) {
        errors.push(`Ошибка миграции состояний пользователей: ${error}`);
      }
    }
    
    // Миграция сотрудников
    if (fs.existsSync(staffUsersFile)) {
      try {
        const staffUsersData = JSON.parse(fs.readFileSync(staffUsersFile, 'utf8'));
        const staffUsersCollection = db.collection('staff_users');
        
        // Очищаем коллекцию
        await staffUsersCollection.deleteMany({});
        
        // Добавляем новые данные
        if (Array.isArray(staffUsersData)) {
          const staffUsersToInsert = staffUsersData.map((staff: any) => ({
            ...staff,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          }));
          
          if (staffUsersToInsert.length > 0) {
            await staffUsersCollection.insertMany(staffUsersToInsert);
            migratedCount += staffUsersToInsert.length;
            console.log(`✅ Мигрировано ${staffUsersToInsert.length} сотрудников`);
          }
        }
      } catch (error) {
        errors.push(`Ошибка миграции сотрудников: ${error}`);
      }
    }
    
    if (errors.length > 0) {
      return NextResponse.json({
        success: true,
        message: `Миграция завершена с ошибками. Мигрировано: ${migratedCount}`,
        migratedCount,
        errors
      }, { status: 200 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Миграция успешно завершена. Мигрировано: ${migratedCount}`,
      migratedCount
    });
    
  } catch (error) {
    console.error('Ошибка миграции:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка при миграции данных',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Проверяем наличие MongoDB URI
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        message: 'MongoDB URI не настроен. Добавьте MONGODB_URI в .env.local',
        error: 'MONGODB_URI_MISSING'
      }, { status: 400 });
    }

    // Динамически импортируем MongoDB модули только при необходимости
    const { getDb } = await import('@/lib/mongodb');
    const db = await getDb();
    
    const collections = ['drivers', 'orders', 'user_states', 'staff_users'];
    const stats: any = {};
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        stats[collectionName] = count;
      } catch (error) {
        stats[collectionName] = { error: 'Ошибка при подсчете' };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Статистика коллекций MongoDB',
      stats
    });
    
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка при получении статистики',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
