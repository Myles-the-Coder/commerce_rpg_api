import { Schema, model, Types } from 'mongoose';

interface Product {
	title: string;
	desc: string;
	img: string;
  categories: Types.Array<string>
  price: number
}

 const productSchema = new Schema<Product>(
	{
		title: { type: String, required: true, unique: true },
		desc: { type: String, required: true },
		img: { type: String, required: true },
		categories: [String],
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);

export default model('Product',productSchema)