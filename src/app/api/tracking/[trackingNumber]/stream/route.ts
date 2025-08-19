import { NextRequest } from 'next/server';

// SSE endpoint for real-time tracking updates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  // Set up SSE headers
  const responseHeaders = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  const encoder = new TextEncoder();

  // Create a readable stream
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialData = {
        type: 'connected',
        trackingNumber,
        timestamp: new Date().toISOString(),
        message: 'Connected to tracking stream'
      };
      
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
      );

      // Simulate real-time updates
      const interval = setInterval(() => {
        // Mock position update
        const mockUpdate = {
          type: 'position_update',
          trackingNumber,
          timestamp: new Date().toISOString(),
          position: {
            lat: 55.7558 + (Math.random() - 0.5) * 0.01, // Small random movement around Moscow
            lng: 37.6176 + (Math.random() - 0.5) * 0.01,
            address: 'Москва, движется по маршруту',
            speed: Math.floor(Math.random() * 60) + 40, // 40-100 km/h
            heading: Math.floor(Math.random() * 360)
          },
          status: 'in_transit',
          estimatedArrival: '2024-02-15T14:30:00Z'
        };

        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(mockUpdate)}\n\n`)
          );
        } catch (error) {
          console.error('Error sending SSE update:', error);
          clearInterval(interval);
          controller.close();
        }
      }, 5000); // Update every 5 seconds

      // Cleanup function
      const cleanup = () => {
        clearInterval(interval);
        controller.close();
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', cleanup);

      // Auto-close after 5 minutes to prevent resource leaks
      setTimeout(cleanup, 5 * 60 * 1000);
    },

    cancel() {
      // Client disconnected
      console.log(`SSE connection closed for tracking: ${trackingNumber}`);
    }
  });

  return new Response(stream, { headers: responseHeaders });
}
