import { NextRequest } from 'next/server';
import { createProspect } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const db = request.cf.d1.DB;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.category_id) {
      return Response.json(
        { error: 'Name and category are required fields' },
        { status: 400 }
      );
    }
    
    const result = await createProspect(db, data);
    return Response.json({ success: true, id: result.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating prospect:', error);
    return Response.json({ error: 'Failed to create prospect' }, { status: 500 });
  }
}
