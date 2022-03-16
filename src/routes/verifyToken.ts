import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
	const token = req.headers['authorization'];
	if (token) {
		const accessToken = token.split(' ')[1];
		jwt.verify(
			accessToken,
			process.env.JWT_SEC as string,
			(err: any, user: any) => {
				if (err) res.status(403).json('Token is not valid');
				req.user = user;
				next();
			}
		);
	} else {
		return res.status(401).json('You are not verified');
	}
};

export const adminAuthorization = (req: any, res: any, next: any) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			res.status(403).json('You are not authorized to perform this action');
		}
	});
};

export const authorization = (req: any, res: any, next: any) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id) {
			next();
		} else {
			res.status(403).json('You are not verified');
		}
	});
};
