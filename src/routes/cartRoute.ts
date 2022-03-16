import { Router, Response, Request } from 'express';
import Cart from '../models/Cart';
import { authorization, adminAuthorization } from './verifyToken';

const router = Router();

router.post('/', authorization, async (req: Request, res: Response) => {
	const newCart = new Cart(req.body);
	try {
		const savedCart = await newCart.save();
		res.status(200).json(savedCart);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.put('/:id', authorization, async (req: any, res: Response) => {
	try {
		const updatedCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);

		res.status(200).json(updatedCart);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.delete(
	'/:id',
  adminAuthorization,
	async (req: Request, res: Response) => {
		try {
			await Cart.findByIdAndDelete(req.params.id);
			res.status(200).json('Cart has been successfully deleted...');
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

router.get('/find/:userId', adminAuthorization, async (req: Request, res: Response) => {
	try {
		const cart = await Cart.findOne({userId: req.params.userId});
		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/', adminAuthorization, async (req: Request, res: Response) => {
	try {
    const carts = await Cart.find()
		res.status(200).json(carts);
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router