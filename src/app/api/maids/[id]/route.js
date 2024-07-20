import { connectdb } from '@/lib/config/db';
import Maid from '@/lib/models/Maid';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function PUT(request) {
  const { name, fathersName, grandFathersName, imageUrl, imageKey, price, experience, review, category, documentUrl, documentKey, documentName, isAvailable } = await request.json();
  const id = request.nextUrl.pathname.split('/').pop();
  const maid = await Maid.findByIdAndUpdate(
    id, 
    { name, fathersName, grandFathersName, imageUrl, imageKey, price, experience, review, category, documentUrl, documentKey, documentName, isAvailable },
    { new: true, runValidators: true }
  );
  return NextResponse.json({ maid });
}

export async function DELETE(request) {
  const id = request.nextUrl.pathname.split('/').pop();
  await Maid.findByIdAndDelete(id);
  return NextResponse.json({ msg: 'Maid Deleted' });
}
