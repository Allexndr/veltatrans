import { NextRequest, NextResponse } from 'next/server';

interface TrackingPoint {
  lat: number;
  lng: number;
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

interface TrackingResponse {
  trackingNumber: string;
  status: string;
  statusText: string;
  estimatedDelivery: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  route: TrackingPoint[];
  lastUpdate: string;
}

// Mock tracking data for demonstration
const mockTrackingData: Record<string, TrackingResponse> = {
  'VT123456': {
    trackingNumber: 'VT123456',
    status: 'in_transit',
    statusText: 'В пути',
    estimatedDelivery: '2024-02-15',
    currentLocation: {
      lat: 55.7558,
      lng: 37.6176,
      address: 'Москва, Россия'
    },
    route: [
      {
        lat: 59.9311,
        lng: 30.3609,
        timestamp: '2024-02-11T10:30:00Z',
        location: 'Санкт-Петербург',
        status: 'pending',
        description: 'Груз принят к перевозке'
      },
      {
        lat: 59.9311,
        lng: 30.3609,
        timestamp: '2024-02-12T12:20:00Z',
        location: 'Санкт-Петербург',
        status: 'in_transit',
        description: 'Груз отправлен из Санкт-Петербурга'
      },
      {
        lat: 57.8431,
        lng: 34.0969,
        timestamp: '2024-02-13T16:45:00Z',
        location: 'Тверь',
        status: 'in_transit',
        description: 'Груз проследовал через Тверь'
      },
      {
        lat: 55.7558,
        lng: 37.6176,
        timestamp: '2024-02-14T08:15:00Z',
        location: 'Москва',
        status: 'warehouse',
        description: 'Груз прибыл на склад назначения'
      }
    ],
    lastUpdate: '2024-02-14T08:15:00Z'
  },
  'VT789012': {
    trackingNumber: 'VT789012',
    status: 'delivered',
    statusText: 'Доставлен',
    estimatedDelivery: '2024-02-10',
    currentLocation: {
      lat: 43.2381,
      lng: 76.9452,
      address: 'Алматы, Казахстан'
    },
    route: [
      {
        lat: 39.9042,
        lng: 116.4074,
        timestamp: '2024-02-05T09:00:00Z',
        location: 'Пекин, Китай',
        status: 'pending',
        description: 'Груз принят к перевозке'
      },
      {
        lat: 43.8256,
        lng: 87.6168,
        timestamp: '2024-02-07T14:30:00Z',
        location: 'Урумчи, Китай',
        status: 'in_transit',
        description: 'Груз на таможенном терминале'
      },
      {
        lat: 43.2381,
        lng: 76.9452,
        timestamp: '2024-02-10T11:20:00Z',
        location: 'Алматы, Казахстан',
        status: 'delivered',
        description: 'Груз доставлен получателю'
      }
    ],
    lastUpdate: '2024-02-10T11:20:00Z'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if tracking number exists in mock data
  const trackingData = mockTrackingData[trackingNumber];

  if (!trackingData) {
    return NextResponse.json(
      { 
        error: 'Tracking number not found',
        message: 'Номер для отслеживания не найден' 
      },
      { status: 404 }
    );
  }

  return NextResponse.json(trackingData);
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
