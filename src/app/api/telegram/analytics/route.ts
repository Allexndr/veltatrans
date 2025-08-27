import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  // Skip execution during build time
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalDrivers: 0,
          activeDrivers: 0,
          totalOrders: 0,
          completedOrders: 0,
          activeOrders: 0,
          successRate: '0%'
        },
        topDrivers: [],
        recentOrders: []
      }
    });
  }

  try {
    const db = await getDb();
    
    if (!db) {
      // Return demo data when MongoDB is not available
      return NextResponse.json({
        success: true,
        analytics: {
          overview: {
            totalDrivers: 0,
            activeDrivers: 0,
            totalOrders: 0,
            completedOrders: 0,
            activeOrders: 0,
            successRate: '0%'
          },
          topDrivers: [],
          recentOrders: []
        }
      });
    }
    
    const driversCollection = db.collection('drivers');
    const ordersCollection = db.collection('orders');
    
    // Get basic statistics
    const totalDrivers = await driversCollection.countDocuments();
    const activeDrivers = await driversCollection.countDocuments({ status: 'active' });
    const totalOrders = await ordersCollection.countDocuments();
    const completedOrders = await ordersCollection.countDocuments({ status: 'completed' });
    const activeOrders = await ordersCollection.countDocuments({ status: 'active' });
    
    // Get top rated drivers
    const topDrivers = await driversCollection
      .find({ rating: { $gt: 0 } })
      .sort({ rating: -1 })
      .limit(5)
      .project({ name: 1, rating: 1, totalOrders: 1, carNumber: 1 })
      .toArray();
    
    // Get recent orders
    const recentOrders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .project({ from: 1, to: 1, status: 1, createdAt: 1 })
      .toArray();
    
    // Calculate success rate
    const successRate = totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0;
    
    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalDrivers,
          activeDrivers,
          totalOrders,
          completedOrders,
          activeOrders,
          successRate: `${successRate}%`
        },
        topDrivers,
        recentOrders
      }
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Skip execution during build time
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ success: true });
  }

  try {
    const body = await request.json();
    const { type, data } = body;
    
    const db = await getDb();
    
    if (!db) {
      // Skip analytics storage when MongoDB is not available
      console.warn('⚠️ MongoDB not available - skipping analytics storage');
      return NextResponse.json({ success: true });
    }
    
    const analyticsCollection = db.collection('analytics');
    
    // Store analytics event
    await analyticsCollection.insertOne({
      type,
      data,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to store analytics'
    }, { status: 500 });
  }
}
