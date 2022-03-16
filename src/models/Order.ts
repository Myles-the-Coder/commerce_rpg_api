import { Schema, model, Types } from 'mongoose';

interface Product {
	productId: string;
	quantity: number;
}

interface Order {
	userId: string;
	products: Types.DocumentArray<Product>;
  amount: number
  address: object
  status: string
}

const orderSchema = new Schema<Order>(
	{
		userId: { type: String, required: true },
		products: [{ productId: String, quantity: { type: Number, default: 1 } }],
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, default: 'pending'}
	},
	{ timestamps: true }
);

export default model('Order', orderSchema);
