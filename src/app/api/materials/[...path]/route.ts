import {NextRequest} from 'next/server';
import fs from 'fs';
import path from 'path';

// Serve files from the repository "materials" folder via API for download/view
export async function GET(req: NextRequest, {params}: {params: Promise<{path: string[]}>}) {
  const resolvedParams = await params;
  const segments = resolvedParams.path || [];
  const requested = segments.join('/');

  // Prevent path traversal
  const materialsRoot = path.join(process.cwd(), 'materials');
  const absolutePath = path.join(materialsRoot, requested);
  if (!absolutePath.startsWith(materialsRoot)) {
    return new Response('Forbidden', {status: 403});
  }

  try {
    const stat = fs.statSync(absolutePath);
    if (!stat.isFile()) {
      return new Response('Not Found', {status: 404});
    }

    const file = fs.readFileSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();

    const contentType =
      ext === '.pdf' ? 'application/pdf' :
      ext === '.png' ? 'image/png' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.pptx' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' :
      'application/octet-stream';

    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(path.basename(absolutePath))}`
      }
    });
  } catch {
    return new Response('Not Found', {status: 404});
  }
}


