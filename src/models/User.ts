import { Schema, model } from 'mongoose';

interface User {
	_doc: any;
	username: string;
	email: string;
	password: string;
	isAdmin: boolean;
}

const userSchema = new Schema<User>(
	{
		username: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default model('User', userSchema);
