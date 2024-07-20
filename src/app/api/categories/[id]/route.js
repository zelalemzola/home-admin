


import { NextResponse } from 'next/server';

import { connectdb } from '@/lib/config/db';
import Category from '@/lib/models/Category';
import Maid from '@/lib/models/Maid';
const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function PUT(request) {
//   const { id } = request.nextUrl.searchParams;
  const { id,name } = await request.json();
  const category = await Category.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
  return NextResponse.json({ category });
}

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');

  try {
    // Delete all businesses with the given category ID
    await Maid.deleteMany({ category: id });

    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({ msg: 'Category and associated Workers deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}