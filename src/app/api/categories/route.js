
import { connectdb } from '@/lib/config/db';
import Category from '@/lib/models/Category';

import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();
export async function GET(request) {
  const categories = await Category.find();
  return NextResponse.json({ categories });
}

export async function POST(request) {
  const { name } = await request.json();
  const category = await Category.create({ name });
  return NextResponse.json({ category });
}
