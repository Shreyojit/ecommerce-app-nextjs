import mongoose from 'mongoose'; // Make sure mongoose is imported
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel, { OrderItem } from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import { round2 } from '@/lib/utils';

const calcPrices = (orderItems: OrderItem[]) => {
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      { status: 401 }
    );
  }

  const { user } = req.auth;
  try {
    const payload = await req.json();
    console.log('Request Payload:', payload);

    await dbConnect();

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error('No items in the payload');
    }

    // Extract slugs from payload
    const itemSlugs: string[] = payload.items.map((item: any) => item.slug);
    console.log('Item Slugs:', itemSlugs);

    // Find product prices from DB based on slugs
    const dbProductPrices = await ProductModel.find(
      {
        slug: { $in: itemSlugs }
      },
      'price slug _id'
    );
    console.log('Database Product Prices:', dbProductPrices);

    if (dbProductPrices.length === 0) {
      throw new Error('No products found in the database for the given slugs');
    }

    // Map prices to order items
    const dbOrderItems = payload.items.map((item: any) => {
      const product = dbProductPrices.find((p) => p.slug === item.slug);
      if (!product) {
        console.error(`Product with slug ${item.slug} not found in DB`);
        throw new Error(`Product with slug ${item.slug} not found in DB`);
      }
      return {
        ...item,
        product: product._id,
        price: product.price,
        _id: undefined // Handle based on your actual schema
      };
    });
    console.log('Mapped Order Items:', dbOrderItems);

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id,
    });

    const createdOrder = await newOrder.save();
    return Response.json(
      { message: 'Order has been created', order: createdOrder },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in order creation:', err);
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}) as any;
