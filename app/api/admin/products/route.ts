import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'




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
    console.log('Unauthorized access attempt');
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const data = await req.formData();

    // Validate required fields
    const name = data.get('name')?.toString().trim();
    const slug = data.get('slug')?.toString().trim();
    const price = parseFloat(data.get('price') as string);
    const category = data.get('category')?.toString().trim();
    const image = data.get('image')?.toString().trim(); // Handle file upload separately if necessary
    const brand = data.get('brand')?.toString().trim();
    const countInStock = parseInt(data.get('countInStock') as string, 10);
    const description = data.get('description')?.toString().trim();

    // Ensure all required fields are provided
    if (!name || !slug || !price || !category || !image || !brand || isNaN(countInStock) || !description) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    console.log('Received data:', {
      name,
      slug,
      price,
      category,
      image,
      brand,
      countInStock,
      description,
    });


    await dbConnect();
    console.log('Database connected');

    const product = new ProductModel({
      name,
      slug,
      price,
      category,
      image,
      brand,
      countInStock,
      description,
    });

    const savedProduct = await product.save();
    console.log('Product created:', savedProduct);

    return new Response(JSON.stringify(savedProduct), { status: 201 });
  } catch (err: any) {
    console.log('Error occurred:', err.message);
    if (err.code === 11000) {
      return new Response(JSON.stringify({ message: 'Product with this slug already exists.' }), { status: 400 });
    }
    return new Response(
      JSON.stringify({ message: err.message }),
      { status: 500 }
    );
  }
});
