import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import { auth } from '@/lib/auth'

export const GET = auth(async (...request: any) => {
  console.log("HELLLLLLLOOOOOO")
  const [req, { params }] = request
  console.log('Request received:', req.method, req.url)
  console.log('Request params:', params)
  
  if (!req.auth) {
    console.log('Unauthorized request')
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  
  try {
    await dbConnect()
    console.log('Database connected')
    
    const order = await OrderModel.findById(params.id)
    console.log('Order found:', order)
    
    if (!order) {
      console.log('Order not found')
      return Response.json(
        { message: 'Order not found' },
        {
          status: 404,
        }
      )
    }
    
    return Response.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return Response.json(
      { message: 'Internal server error' },
      {
        status: 500,
      }
    )
  }
}) as any
