#!/usr/bin/env node

const BASE_URL = 'http://localhost:3000';

async function testBot() {
  console.log('🧪 Тестирование Telegram бота Velta Trans...\n');
  
  // Test 1: Health check
  console.log('1️⃣ Проверка здоровья бота...');
  try {
    const response = await fetch(`${BASE_URL}/api/telegram/webhook`);
    const data = await response.json();
    console.log(`✅ Статус: ${data.success ? 'OK' : 'ERROR'}`);
    console.log(`📊 MongoDB: ${data.mongodb}`);
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
  
  // Test 2: Analytics
  console.log('\n2️⃣ Проверка аналитики...');
  try {
    const response = await fetch(`${BASE_URL}/api/telegram/analytics`);
    const data = await response.json();
    if (data.success) {
      console.log(`✅ Водителей: ${data.analytics.overview.totalDrivers}`);
      console.log(`✅ Заказов: ${data.analytics.overview.totalOrders}`);
      console.log(`✅ Процент успеха: ${data.analytics.overview.successRate}`);
    } else {
      console.log('❌ Ошибка аналитики');
    }
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
  
  // Test 3: Notifications
  console.log('\n3️⃣ Проверка уведомлений...');
  try {
    const response = await fetch(`${BASE_URL}/api/telegram/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'system_alert',
        message: 'Тестовое уведомление от системы'
      })
    });
    const data = await response.json();
    console.log(`✅ Уведомление: ${data.sent ? 'Отправлено' : 'Ошибка'}`);
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
  
  // Test 4: Bot commands
  console.log('\n4️⃣ Тестирование команд бота...');
  
  const commands = [
    { text: '/start', description: 'Стартовая команда' },
    { text: '📈 Аналитика', description: 'Команда аналитики' },
    { text: '🚗 Зарегистрироваться как водитель', description: 'Регистрация водителя' }
  ];
  
  for (const command of commands) {
    try {
      const response = await fetch(`${BASE_URL}/api/telegram/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            chat: { id: '123' },
            text: command.text,
            from: { id: 123 }
          }
        })
      });
      const data = await response.json();
      console.log(`✅ ${command.description}: ${data.success ? 'OK' : 'ERROR'}`);
    } catch (error) {
      console.log(`❌ ${command.description}: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Тестирование завершено!');
}

// Run tests
testBot().catch(console.error);
