import { connectdb } from '@/lib/config/db';
import Maid from '@/lib/models/Maid';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function GET(request) {
  const maids = await Maid.find().populate('category');
  return NextResponse.json({ maids });
}

export async function POST(request) {
  const { name, fathersName, grandFathersName, imageUrl, imageKey, price, experience, review, category, documentUrl, documentKey, documentName, isAvailable } = await request.json();
  const maid = await Maid.create({ name, fathersName, grandFathersName, imageUrl, imageKey, price, experience, review, category, documentUrl, documentKey, documentName, isAvailable });
  return NextResponse.json({ maid });
}
