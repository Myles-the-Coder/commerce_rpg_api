import { Router, Response, Request } from 'express';
import Order from '../models/Order';
import { authorization, adminAuthorization } from './verifyToken';

const router = Router();

router.post('/', authorization, async (req: Request, res: Response) => {
	const newOrder = new Order(req.body);
	try {
		const savedOrder = await newOrder.save();
		res.status(200).json(savedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.put('/:id', adminAuthorization, async (req: any, res: Response) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);

		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.delete(
	'/:id',
	adminAuthorization,
	async (req: Request, res: Response) => {
		try {
			await Order.findByIdAndDelete(req.params.id);
			res.status(200).json('Order has been successfully deleted...');
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

router.get(
	'/find/:userId',
	authorization,
	async (req: Request, res: Response) => {
		try {
			const order = await Order.find({ userId: req.params.userId });
			res.status(200).json(order);
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

router.get('/', adminAuthorization, async (req: Request, res: Response) => {
	try {
		const orders = await Order.find();
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get Monthly Income
router.get(
	'/stats',
	adminAuthorization,
	async (req: Request, res: Response) => {
		const date = new Date();
		const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
		const previousMonth = new Date(
			new Date().setMonth(lastMonth.getMonth() - 1)
		);

		try {
			const income = await Order.aggregate([
				{ $match: { createdAt: { $gte: previousMonth } } },
				{ $project: { month: { $month: '$createdAt' }, sales: '$amount' } },
				{
					$group: {
						_id: '$month',
						total: { $sum: '$sales' },
					},
				},
			]);

			res.status(200).json(income);
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

export default router;
