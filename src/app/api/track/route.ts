import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  // Skip execution during build time on Vercel if DB not configured
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    const code = request.nextUrl.searchParams.get('code') || '';
    return NextResponse.json({ success: true, demo: true, order: code ? { trackingCode: code, status: 'demo', from: 'Алматы', to: 'Астана' } : null, updates: [] });
  }

  try {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) return NextResponse.json({ success: false, error: 'Missing code' }, { status: 400 });

    const db = await getDb();
    if (!db) return NextResponse.json({ success: false, error: 'DB not available' }, { status: 500 });

    const orders = db.collection('orders');
    const updatesCol = db.collection('tracking_updates');

    const order = await orders.findOne({ trackingCode: code });
    if (!order) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const updates = await updatesCol.find({ orderId: order.id || order._id?.toString?.() }).sort({ createdAt: 1 }).toArray().catch(() => []);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id || order._id,
        trackingCode: order.trackingCode,
        from: order.from,
        to: order.to,
        status: order.status,
        price: order.price,
        driverId: order.driverId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      updates
    });
  } catch (e) {
    console.error('track api error', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
