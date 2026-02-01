import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Detail from '@/models/Detail';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.title || !body.description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const detail = await Detail.create(body);
    return NextResponse.json({ success: true, data: detail }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const details = await Detail.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: details });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}