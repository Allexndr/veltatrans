import { NextRequest, NextResponse } from 'next/server';

interface CalculationRequest {
  fromCity: string;
  toCity: string;
  weight: number;
  volume: number;
  length?: number;
  width?: number;
  height?: number;
  isOversized: boolean;
}

interface CalculationResult {
  distance: number;
  estimatedCost: number;
  estimatedDays: number;
  route: {
    from: {
      city: string;
      coordinates: [number, number];
    };
    to: {
      city: string;
      coordinates: [number, number];
    };
  };
  breakdown: {
    baseCost: number;
    weightCost: number;
    volumeCost: number;
    oversizedSurcharge: number;
    total: number;
  };
}

// Base rates (example)
const BASE_RATES = {
  perKm: 2.5, // руб за км
  perKg: 15, // руб за кг
  perCubicMeter: 500, // руб за куб.м
  oversizedMultiplier: 1.5,
  minCost: 5000 // минимальная стоимость
};

export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();
    
    const { fromCity, toCity, weight, volume, isOversized } = body;

    // Validate input
    if (!fromCity || !toCity || !weight || !volume) {
      return NextResponse.json(
        { error: 'Missing required fields: fromCity, toCity, weight, volume' },
        { status: 400 }
      );
    }

    // Geocode both cities
    const [fromGeocode, toGeocode] = await Promise.all([
      geocodeCity(fromCity),
      geocodeCity(toCity)
    ]);

    if (!fromGeocode || !toGeocode) {
      return NextResponse.json(
        { error: 'Could not geocode one or both cities' },
        { status: 400 }
      );
    }

    // Calculate distance (Haversine formula)
    const distance = calculateDistance(
      fromGeocode.coordinates.lat,
      fromGeocode.coordinates.lng,
      toGeocode.coordinates.lat,
      toGeocode.coordinates.lng
    );

    // Calculate costs
    const baseCost = distance * BASE_RATES.perKm;
    const weightCost = weight * BASE_RATES.perKg;
    const volumeCost = volume * BASE_RATES.perCubicMeter;
    const oversizedSurcharge = isOversized ? (baseCost + weightCost + volumeCost) * (BASE_RATES.oversizedMultiplier - 1) : 0;
    
    let total = baseCost + weightCost + volumeCost + oversizedSurcharge;
    total = Math.max(total, BASE_RATES.minCost); // Apply minimum cost

    // Estimate delivery time (rough calculation)
    const estimatedDays = Math.ceil(distance / 500) + 1; // ~500km per day + 1 day for handling

    const result: CalculationResult = {
      distance: Math.round(distance),
      estimatedCost: Math.round(total),
      estimatedDays,
      route: {
        from: {
          city: fromGeocode.city || fromCity,
          coordinates: [fromGeocode.coordinates.lat, fromGeocode.coordinates.lng]
        },
        to: {
          city: toGeocode.city || toCity,
          coordinates: [toGeocode.coordinates.lat, toGeocode.coordinates.lng]
        }
      },
      breakdown: {
        baseCost: Math.round(baseCost),
        weightCost: Math.round(weightCost),
        volumeCost: Math.round(volumeCost),
        oversizedSurcharge: Math.round(oversizedSurcharge),
        total: Math.round(total)
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Calculation service temporarily unavailable' },
      { status: 503 }
    );
  }
}

async function geocodeCity(city: string) {
  try {
    // Use Yandex Geocoder API directly
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY;
    const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${encodeURIComponent(city)}&format=json&results=1`;
    
    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      throw new Error(`Yandex API error: ${response.status}`);
    }

    const data = await response.json();
    const geoObjects = data.response?.GeoObjectCollection?.featureMember;
    
    if (!geoObjects || geoObjects.length === 0) {
      return null;
    }

    const geoObject = geoObjects[0].GeoObject;
    const coordinates = geoObject.Point.pos.split(' ').map(Number);
    const [lng, lat] = coordinates; // Yandex returns [lng, lat]

    return {
      address: geoObject.name || city,
      coordinates: { lat, lng },
      city: city
    };
  } catch (error) {
    console.error('Geocoding error for city:', city, error);
  }
  return null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
