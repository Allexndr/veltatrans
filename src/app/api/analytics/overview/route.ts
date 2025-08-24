import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Временные интерфейсы для работы с JSON
interface OrderMetrics {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  delayedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  ordersByMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  topRoutes: Array<{
    route: string;
    count: number;
    revenue: number;
  }>;
}

interface DriverMetrics {
  totalDrivers: number;
  activeDrivers: number;
  averageRating: number;
  topDrivers: Array<{
    driverId: number;
    name: string;
    completedOrders: number;
    rating: number;
    totalEarnings: number;
  }>;
  driversByLocation: Array<{
    location: string;
    count: number;
  }>;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
  lastUpdate: string;
}

export async function GET(request: NextRequest) {
  try {
    // Пути к JSON файлам
    const dataDir = path.join(process.cwd(), 'data', 'velta-data');
    const ordersFile = path.join(dataDir, 'orders.json');
    const driversFile = path.join(dataDir, 'drivers.json');
    const userStatesFile = path.join(dataDir, 'user_states.json');
    
    // Читаем данные из JSON файлов
    let orders: any[] = [];
    let drivers: any[] = [];
    let userStates: any = {};
    
    try {
      if (fs.existsSync(ordersFile)) {
        orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
      }
    } catch (error) {
      console.log('Orders file not found or invalid, using empty array');
    }
    
    try {
      if (fs.existsSync(driversFile)) {
        drivers = JSON.parse(fs.readFileSync(driversFile, 'utf8'));
      }
    } catch (error) {
      console.log('Drivers file not found or invalid, using empty array');
    }
    
    try {
      if (fs.existsSync(userStatesFile)) {
        userStates = JSON.parse(fs.readFileSync(userStatesFile, 'utf8'));
      }
    } catch (error) {
      console.log('User states file not found or invalid, using empty object');
    }
    
    // Общая статистика заказов
    const totalOrders = orders.length;
    const activeOrders = orders.filter(order => 
      ['created', 'assigned', 'in_transit', 'warehouse'].includes(order.status)
    ).length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const delayedOrders = orders.filter(order => order.status === 'delayed').length;
    
    // Статистика по статусам
    const ordersByStatus: Record<string, number> = {};
    orders.forEach(order => {
      const status = order.status || 'unknown';
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });
    
    // Статистика по месяцам (последние 6 месяцев)
    const ordersByMonth = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      const monthOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === date.getFullYear() && 
               orderDate.getMonth() === date.getMonth();
      });
      
      const revenue = monthOrders.reduce((sum, order) => sum + (order.finalPrice || 0), 0);
      
      ordersByMonth.push({
        month: monthKey,
        count: monthOrders.length,
        revenue
      });
    }
    
    // Топ маршрутов
    const routeStats: Record<string, { count: number; revenue: number }> = {};
    orders.forEach(order => {
      if (order.from && order.to) {
        const route = `${order.from} → ${order.to}`;
        if (!routeStats[route]) {
          routeStats[route] = { count: 0, revenue: 0 };
        }
        routeStats[route].count++;
        routeStats[route].revenue += order.finalPrice || 0;
      }
    });
    
    const topRoutes = Object.entries(routeStats)
      .map(([route, stats]) => ({
        route,
        count: stats.count,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Финансовая статистика
    const totalRevenue = orders.reduce((sum, order) => sum + (order.finalPrice || 0), 0);
    const ordersWithPrice = orders.filter(order => order.finalPrice);
    const averageOrderValue = ordersWithPrice.length > 0 ? totalRevenue / ordersWithPrice.length : 0;
    
    // Метрики водителей
    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter(driver => driver.status === 'active').length;
    
    const topDrivers = drivers
      .filter(driver => driver.status === 'active')
      .sort((a, b) => (b.completedOrders || 0) - (a.completedOrders || 0))
      .slice(0, 5)
      .map(driver => ({
        driverId: driver.id || 0,
        name: driver.name || 'Неизвестно',
        completedOrders: driver.completedOrders || 0,
        rating: driver.rating || 0,
        totalEarnings: driver.totalEarnings || 0
      }));
    
    // Системные метрики
    const totalUsers = Object.keys(userStates).length;
    const activeUsers = Object.values(userStates).filter((state: any) => {
      if (!state.lastActivity) return false;
      const lastActivity = new Date(state.lastActivity);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastActivity > dayAgo;
    }).length;
    
    // Формируем ответ
    const orderMetrics: OrderMetrics = {
      totalOrders,
      activeOrders,
      completedOrders,
      delayedOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      ordersByMonth,
      topRoutes
    };
    
    const driverMetrics: DriverMetrics = {
      totalDrivers,
      activeDrivers,
      averageRating: drivers.length > 0 ? 
        drivers.reduce((sum, driver) => sum + (driver.rating || 0), 0) / drivers.length : 0,
      topDrivers,
      driversByLocation: []
    };
    
    const systemMetrics: SystemMetrics = {
      totalUsers,
      activeUsers,
      systemUptime: 99.9,
      averageResponseTime: 150,
      errorRate: 0.1,
      lastUpdate: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: {
        orders: orderMetrics,
        drivers: driverMetrics,
        system: systemMetrics,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
