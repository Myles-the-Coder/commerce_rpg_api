import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';

export const validateInputs = (endpoint: string) => {
	return endpoint === 'register'
		? [
				check('username', 'Username is required')
					.notEmpty()
					.isLength({ min: 5 }),
				check('password', 'Password is required')
					.notEmpty()
					.isLength({ min: 5 }),
				check('email', 'Email does not appear to be valid.')
					.normalizeEmail()
					.isEmail(),
		  ]
		: [
				check('username', 'Username is not valid')
					.notEmpty()
					.isLength({ min: 5 })
					.optional({ nullable: true }),
				check('password', 'Password is not valid')
					.notEmpty()
					.isLength({ min: 5 })
					.optional({ nullable: true }),
				check('email', 'Email does not appear to be valid.')
					.isEmail()
					.optional({ nullable: true }),
		  ];
};

export const checkValidationObject = (req: Request, res: Response) => {
	let errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
};
