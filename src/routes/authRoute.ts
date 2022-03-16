import { Router, Response, Request } from 'express';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import CryptoJS from 'crypto-js';
import {validateInputs, checkValidationObject} from '../functions/functions'

config()
const router = Router();
const cryptoPassword = process.env.PASSWORD_SEC as string;

//REGISTER
router.post('/register', validateInputs('register'), async (req: Request, res: Response) => {
	try {
    checkValidationObject(req, res)
		const { username, email, password } = req.body;
		const encryptedPassword = CryptoJS.AES.encrypt(password, cryptoPassword);
		const newUser = new User({
			username,
			email,
			password: encryptedPassword,
		});
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json(error);
	}
});

//LOGIN
router.post('/login', async (req: Request, res: Response) => {
	try {
		const { username } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json('Wrong Credentials');
		}

		const hashedPassword = CryptoJS.AES.decrypt(
			user.password as string,
			cryptoPassword
		).toString(CryptoJS.enc.Utf8);

		if (hashedPassword !== req.body.password) {
			return res.status(401).json('Wrong Credentials');
		}

		const { _id, isAdmin } = user;
		const accessToken = jwt.sign(
			{ id: _id, isAdmin },
			process.env.JWT_SEC as string,
			{ expiresIn: '3d' }
		);

		const { password, ...others } = user._doc;
		res.status(200).json({ ...others, accessToken });
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
