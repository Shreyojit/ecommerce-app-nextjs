import { cache } from 'react';
import dbConnect from '../dbConnect';
import ProductModel, { Product } from '../models/ProductModel';

export const revalidate = 3600;

const getLatest = cache(async () => {
    await dbConnect();
    const products = await ProductModel.find({})
        .sort({ _id: -1 })
        .limit(4)
        .lean();
    return products as Product[];
});

const getFeatured = cache(async () => {
    await dbConnect();
    const products = await ProductModel.find({ isFeatured: true })
        .limit(3)
        .lean();
    return products as Product[];
});

const getHotSelling = cache(async () => {
    await dbConnect();
    const products = await ProductModel.find({})
        .sort({ numReviews: -1 }) // Assuming "hot selling" is based on review count
        .limit(3)
        .lean();
    return products as Product[];
});

const getMostReviewed = cache(async () => {
    await dbConnect();
    const products = await ProductModel.find({})
        .sort({ numReviews: -1 }) // Most reviewed based on review count
        .limit(3)
        .lean();
    return products as Product[];
});

const getMostPopular = cache(async () => {
    await dbConnect();
    const products = await ProductModel.find({})
        .sort({ rating: -1 }) // Most popular based on rating
        .limit(3)
        .lean();
    return products as Product[];
});

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    await dbConnect();
    const productDoc = await ProductModel.findOne({ slug }).lean().exec();
    return productDoc ? (productDoc as Product) : null;
};

const getCategories = cache(async () => {
    await dbConnect();
    const categories = await ProductModel.find().distinct('category');
    return categories as string[];
});

const PAGE_SIZE = 3;

const getByQuery = cache(async ({
    q = '',
    category = 'all',
    sort = 'newest',
    price = 'all',
    rating = 'all',
    page = '1',
}: {
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
}) => {
    await dbConnect();

    // Build filters
    const buildFilter = (): Record<string, any> => {
        const filters: Record<string, any> = {};

        if (q && q !== 'all') {
            filters.name = { $regex: q, $options: 'i' };
        }

        if (category && category !== 'all') {
            filters.category = category;
        }

        if (rating && rating !== 'all') {
            filters.rating = { $gte: Number(rating) };
        }

        if (price && price !== 'all') {
            const [minPrice, maxPrice] = price.split('-').map(Number);
            filters.price = { $gte: minPrice, $lte: maxPrice };
        }

        return filters;
    };

    // Get sorting order
    const getSortOrder = (): Record<string, 1 | -1> => {
        switch (sort) {
            case 'lowest':
                return { price: 1 };
            case 'highest':
                return { price: -1 };
            case 'toprated':
                return { rating: -1 };
            default:
                return { _id: -1 };
        }
    };

    // Retrieve distinct categories
    const categories = await ProductModel.find().distinct('category');

    // Query products
    const filter = buildFilter();
    const sortOrder = getSortOrder();
    const products = await ProductModel.find(filter, '-reviews')
        .sort(sortOrder)
        .skip(PAGE_SIZE * (Number(page) - 1))
        .limit(PAGE_SIZE)
        .lean();

    // Count total documents matching the filter
    const countProducts = await ProductModel.countDocuments(filter);

    return {
        products: products as Product[],
        countProducts,
        page,
        pages: Math.ceil(countProducts / PAGE_SIZE),
        categories,
    };
});

const productService = {
    getLatest,
    getFeatured,
    getProductBySlug,
    getCategories,
    getByQuery,
    getHotSelling,
    getMostReviewed,
    getMostPopular,
};

export default productService;
