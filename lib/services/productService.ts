import {cache} from 'react'
import dbConnect from '../dbConnect'
import ProductModel, { Product } from '../models/ProductModel'

export const revalidate = 3600

const getLatest = cache(async () => {
    await dbConnect()
    console.log(process.env.MONGO_URI)
    const products = await ProductModel.find({}).sort({_id:-1}).limit(4).lean()
    
    return products as Product[]
})
const getFeatured = cache(async () => {
    await dbConnect()
    const products = await ProductModel.find({isFeatured: true}).limit(3).lean()
    return products
})

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    await dbConnect();
    
    // Fetch product from database
    const productDoc = await ProductModel.findOne({ slug }).lean().exec();
    
    // Check if productDoc is not null
    if (!productDoc) {
      return null;
    }
  
    // Type assertion to match the Product type
    return productDoc as Product;
  };

const productService = {
    getLatest,
    getFeatured,
    getProductBySlug
   
}


export default productService