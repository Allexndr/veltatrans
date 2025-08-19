import { NextRequest, NextResponse } from 'next/server';

interface GeocodeResult {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  city: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Yandex Maps API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Call Yandex Geocoder API
    const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${encodeURIComponent(address)}&format=json&results=1`;
    
    const response = await fetch(geocodeUrl);
    
    if (!response.ok) {
      throw new Error(`Yandex API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse Yandex response
    const geoObjects = data.response?.GeoObjectCollection?.featureMember;
    
    if (!geoObjects || geoObjects.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    const geoObject = geoObjects[0].GeoObject;
    const coordinates = geoObject.Point.pos.split(' ').map(Number);
    const [lng, lat] = coordinates; // Yandex returns [lng, lat]

    // Extract address components
    const metaData = geoObject.metaDataProperty?.GeocoderMetaData;
    const addressDetails = metaData?.AddressDetails?.Country;
    
    const result: GeocodeResult = {
      address: geoObject.name || address,
      coordinates: { lat, lng },
      country: addressDetails?.CountryName || '',
      city: addressDetails?.AdministrativeArea?.Locality?.LocalityName || 
            addressDetails?.AdministrativeArea?.SubAdministrativeArea?.Locality?.LocalityName || ''
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Geocoding service temporarily unavailable' },
      { status: 503 }
    );
  }
}


