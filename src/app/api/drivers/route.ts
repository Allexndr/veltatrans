import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Пути к файлам данных
const dataDir = path.join(process.cwd(), 'data');
const driversFile = path.join(dataDir, 'drivers.json');

interface Driver {
  id: number;
  name: string;
  phone: string;
  carNumber: string;
  carType: string;
  registeredAt: string;
  status: 'active' | 'inactive';
}

// Убеждаемся что папка data существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(driversFile)) {
  fs.writeFileSync(driversFile, '{}');
}

function loadDrivers(): Record<string, Driver> {
  try {
    return JSON.parse(fs.readFileSync(driversFile, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveDrivers(drivers: Record<string, Driver>) {
  fs.writeFileSync(driversFile, JSON.stringify(drivers, null, 2));
}

// GET - получить список водителей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const carType = searchParams.get('carType');
    
    const drivers = loadDrivers();
    let filteredDrivers = Object.values(drivers);
    
    // Фильтрация по статусу
    if (status) {
      filteredDrivers = filteredDrivers.filter(driver => driver.status === status);
    }
    
    // Фильтрация по типу ТС
    if (carType) {
      filteredDrivers = filteredDrivers.filter(driver => 
        driver.carType.toLowerCase().includes(carType.toLowerCase())
      );
    }
    
    return NextResponse.json({
      success: true,
      drivers: filteredDrivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        carNumber: driver.carNumber,
        carType: driver.carType,
        registeredAt: driver.registeredAt,
        status: driver.status
      })),
      total: filteredDrivers.length
    });
  } catch (error) {
    console.error('Error getting drivers:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка сервера'
    }, { status: 500 });
  }
}

// POST - добавить нового водителя (для админки)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, carNumber, carType } = body;
    
    // Валидация
    if (!id || !name || !phone || !carNumber || !carType) {
      return NextResponse.json({
        success: false,
        message: 'Все поля обязательны для заполнения'
      }, { status: 400 });
    }
    
    const drivers = loadDrivers();
    
    // Проверяем, что водитель не существует
    if (drivers[id]) {
      return NextResponse.json({
        success: false,
        message: 'Водитель с таким ID уже существует'
      }, { status: 400 });
    }
    
    // Добавляем нового водителя
    drivers[id] = {
      id: parseInt(id),
      name,
      phone,
      carNumber,
      carType,
      registeredAt: new Date().toISOString(),
      status: 'active'
    };
    
    saveDrivers(drivers);
    
    return NextResponse.json({
      success: true,
      message: 'Водитель добавлен успешно'
    });
  } catch (error) {
    console.error('Error adding driver:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка при добавлении водителя'
    }, { status: 500 });
  }
}

// PUT - обновить данные водителя
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, carNumber, carType, status } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID водителя обязателен'
      }, { status: 400 });
    }
    
    const drivers = loadDrivers();
    
    if (!drivers[id]) {
      return NextResponse.json({
        success: false,
        message: 'Водитель не найден'
      }, { status: 404 });
    }
    
    // Обновляем данные водителя
    if (name) drivers[id].name = name;
    if (phone) drivers[id].phone = phone;
    if (carNumber) drivers[id].carNumber = carNumber;
    if (carType) drivers[id].carType = carType;
    if (status) drivers[id].status = status;
    
    saveDrivers(drivers);
    
    return NextResponse.json({
      success: true,
      message: 'Данные водителя обновлены'
    });
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка при обновлении данных водителя'
    }, { status: 500 });
  }
}

// DELETE - удалить водителя
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID водителя обязателен'
      }, { status: 400 });
    }
    
    const drivers = loadDrivers();
    
    if (!drivers[id]) {
      return NextResponse.json({
        success: false,
        message: 'Водитель не найден'
      }, { status: 404 });
    }
    
    // Удаляем водителя
    delete drivers[id];
    saveDrivers(drivers);
    
    return NextResponse.json({
      success: true,
      message: 'Водитель удален'
    });
  } catch (error) {
    console.error('Error deleting driver:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка при удалении водителя'
    }, { status: 500 });
  }
}

