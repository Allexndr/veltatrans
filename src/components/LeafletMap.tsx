'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { DivIcon } from 'leaflet';

// Динамически импортируем компоненты Leaflet только на клиенте
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

// Leaflet будет инициализирован только на клиенте

interface MapPoint {
  lat: number;
  lng: number;
  title: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'warehouse';
  timestamp?: string;
}

interface LeafletMapProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export default function LeafletMap({ 
  points, 
  center = [55.7558, 37.6176], // Moscow by default
  zoom = 6, 
  height = '400px',
  className = ''
}: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletIcons, setLeafletIcons] = useState<Record<string, DivIcon>>({});

  useEffect(() => {
    setIsClient(true);
    
    // Предзагружаем иконки для всех статусов
    const loadIcons = async () => {
      if (typeof window === 'undefined') return;
      
      const L = await import('leaflet');
      const icons: Record<string, DivIcon> = {};
      
      const statuses = ['pending', 'in_transit', 'delivered', 'warehouse'];
      statuses.forEach(status => {
        icons[status] = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="
            background-color: ${getStatusColor(status)};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
      });
      
      setLeafletIcons(icons);
    };
    
    loadIcons();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#fbbf24'; // yellow
      case 'in_transit': return '#3b82f6'; // blue
      case 'delivered': return '#10b981'; // green
      case 'warehouse': return '#8b5cf6'; // purple
      default: return '#6b7280'; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'in_transit': return 'В пути';
      case 'delivered': return 'Доставлен';
      case 'warehouse': return 'На складе';
      default: return 'Неизвестно';
    }
  };



  // Calculate route line coordinates
  const routeCoordinates: [number, number][] = points.map(point => [point.lat, point.lng]);

  // Auto-center map if points exist
  const mapCenter = points.length > 0 ? [points[0].lat, points[0].lng] as [number, number] : center;
  const mapZoom = points.length > 1 ? 5 : zoom;

  if (!isClient) {
    return (
      <div 
        className={`bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-gray-500">Загрузка карты...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route line */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
          />
        )}
        
        {/* Markers */}
        {points.map((point, index) => {
          const customIcon = leafletIcons[point.status];
          return customIcon ? (
            <Marker
              key={index}
              position={[point.lat, point.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{point.title}</div>
                  <div className="text-gray-600">
                    Статус: <span style={{ color: getStatusColor(point.status) }}>
                      {getStatusText(point.status)}
                    </span>
                  </div>
                  {point.timestamp && (
                    <div className="text-gray-500 text-xs mt-1">
                      {new Date(point.timestamp).toLocaleString('ru-RU')}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
    </div>
  );
}
