import { Schema, model, Types } from 'mongoose';

interface Product {
	productId: string;
	quantity: number;
}

interface Cart {
	userId: string;
	products: Types.DocumentArray<Product>;
}

const cartSchema = new Schema<Cart>(
	{
		userId: { type: String, required: true },
		products: [{ productId: String, quantity: { type: Number, default: 1 } }],
	},
	{ timestamps: true }
);

export default model('Cart', cartSchema);
