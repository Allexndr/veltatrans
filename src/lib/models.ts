import { ObjectId } from 'mongodb';

// Водитель
export interface Driver {
  _id?: ObjectId;
  id: number;
  name: string;
  phone: string; // Оригинальный номер из базы
  phoneVariants: string[]; // Все возможные варианты номера
  carNumber: string;
  carType: 'tent' | 'refrigerator' | 'container' | 'special' | 'car_carrier';
  experience: string;
  rating: number;
  status: 'active' | 'inactive' | 'blocked';
  location: string;
  createdAt: Date;
  originalData: {
    vehicleType: string;
    carrier: string;
    fullVehicle: string;
  };
}

// Заказ
export interface Order {
  _id?: ObjectId;
  id: string;
  trackingNumber: string;
  clientName: string;
  weight: number;
  volume: number;
  route: {
    from: string;
    to: string;
    distance: number;
  };
  clientPhone: string;
  clientEmail: string;
  status: 'new' | 'assigned' | 'in_transit' | 'warehouse' | 'delivered' | 'delayed' | 'cancelled';
  price: number;
  currency: string;
  createdAt: Date;
  deadline: Date;
  description: string;
  driverId: number | null;
  driverBids: DriverBid[];
  routePoints: RoutePoint[];
}

// Заявка водителя на заказ
export interface DriverBid {
  driverId: number;
  driverName: string;
  price: number;
  message: string;
  createdAt: Date;
}

// Точка маршрута
export interface RoutePoint {
  lat: number;
  lng: number;
  location: string;
  status: string;
  timestamp: Date;
  description: string;
}

// Состояние пользователя в Telegram
export interface UserState {
  _id?: ObjectId;
  userId: number;
  chatId: number;
  step?: string;
  driverAuthed?: boolean;
  driverData?: {
    Имя: string;
    Телефон: string;
    Номер_авто: string;
    Тип_ТС: string;
  };
  staffAuthed?: boolean;
  staffStep?: string;
  staffLogin?: string;
  orderNumberForStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Сотрудник
export interface StaffUser {
  _id?: ObjectId;
  id: number;
  name: string;
  phone: string;
  role: 'admin' | 'staff' | 'manager';
  permissions: string[];
  login: string;
  password: string;
  createdAt: Date;
}

// Метрики для аналитики
export interface OrderMetrics {
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

export interface DriverMetrics {
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
  driversByLocation: Record<string, number>;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  systemUptime: number;
  lastBackup: Date;
}
