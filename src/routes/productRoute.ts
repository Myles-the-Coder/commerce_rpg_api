import { Router, Response, Request } from 'express';
import Product from '../models/Product';
import { adminAuthorization } from './verifyToken';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
	const newProduct = new Product(req.body);
	try {
		const savedProduct = await newProduct.save();
		res.status(200).json(savedProduct);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.put('/:id', async (req: any, res: Response) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);

		res.status(200).json(updatedProduct);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.delete(
	'/users/:id',
	adminAuthorization,
	async (req: Request, res: Response) => {
		try {
			await Product.findByIdAndDelete(req.params.id);
			res.status(200).json('Product has been successfully deleted...');
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

router.get('/find/:id', async (req: Request, res: Response) => {
	try {
		const product = await Product.findById(req.params.id);
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/', async (req: Request, res: Response) => {
	const qNew = req.query.new;
	const qCategory = req.query.category;

	try {
		let products = qNew
			? await Product.find().sort({ createdAt: -1 }).limit(5)
			: qCategory
			? await Product.find({
					categories: {
						$in: [qCategory],
					},
			  })
			: await Product.find();

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
