import { Router, Response, Request } from 'express';
import User from '../models/User';
import { authorization, adminAuthorization } from './verifyToken';
import CryptoJS from 'crypto-js';
import { config } from 'dotenv';
import { validateInputs, checkValidationObject } from '../functions/functions';

config();

const router = Router();
const cryptoPassword = process.env.PASSWORD_SEC as string;

router.put(
	'/users/:id',
	authorization,
	validateInputs('update'),
	async (req: any, res: Response) => {
		checkValidationObject(req, res);
		let { username, email, password } = req.body;
		let encryptedPassword = CryptoJS.AES.encrypt(
			password,
			cryptoPassword
		).toString();
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.user.id,
				{
					$set: {
						username,
						email,
						password: encryptedPassword,
					},
				},
				{ new: true }
			);

			if (updatedUser) {
				const { password, ...others } = updatedUser._doc;
				return res.status(200).json(others);
			}
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

router.delete(
	'/users/:id',
	authorization,
	async (req: Request, res: Response) => {
		try {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json('User has been successfully deleted...');
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

router.get(
	'/users/find/:id',
	adminAuthorization,
	async (req: Request, res: Response) => {
		try {
			const user = await User.findById(req.params.id);
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

router.get('/', adminAuthorization, async (req: Request, res: Response) => {
	const query = req.query.new;
	try {
		const users = query
			? await User.find().sort({ _id: -1 }).limit(5)
			: await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get(
	'/users/stats',
  adminAuthorization,
	async (req: Request, res: Response) => {
		const date = new Date();
		const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

		try {
			const data = await User.aggregate([
				{ $match: { createdAt: { $gte: lastYear } } },
				{ $project: { month: { $month: '$createdAt' } } },
        {$group: {
          _id: '$month',
          total: {$sum: 1}
        }}
			]);

      res.status(200).json(data)
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

export default router;
