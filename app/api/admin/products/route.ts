import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

import { NextResponse } from 'next/server'
import { z } from 'zod'


// Define Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image URL is required"),
  price: z.number().min(0, "Price must be positive"),
  brand: z.string().min(1, "Brand is required"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
  numReviews: z.number().min(0, "Number of reviews must be positive"),
  countInStock: z.number().min(0, "Count in stock must be positive"),
  description: z.string().min(1, "Description is required"),
  isFeatured: z.boolean().optional(),
  banner: z.string().optional(),
});




export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const products = await ProductModel.find()
  console.log(products)
  return Response.json(products)
}) as any

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return NextResponse.json(
      { message: 'unauthorized' },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    // Parse and validate the request body
    const data = await req.json();
    const parsedData = productSchema.parse(data);

    // Create and save the new product
    const product = new ProductModel(parsedData);
    await product.save();

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (err: any) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: err.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}) as any;