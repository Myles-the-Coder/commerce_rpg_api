import express, { Request, Response, Application, json } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import authRouter from './routes/authRoute';
import userRouter from './routes/userRoute';
import productRouter from './routes/productRoute';
import cartRouter from './routes/cartRoute';
import orderRouter from './routes/orderRoute';
import stripeRoute from './routes/stripeRoute';
import cors from 'cors';

config();
const app: Application = express();
app.use(cors());

mongoose
	.connect(process.env.MONGO_URL as string)
	.then(() => console.log('DBConnection Successful'))
	.catch(err => console.error(err));

app.use(json());

const PORT = process.env.PORT || 5000;

app.use(authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/checkout', stripeRoute);

app.get('/', (req: Request, res: Response): void => {
	res.send('Hello TypeScript from Node.js');
});

app.listen(PORT, (): void => {
	console.log(`Running on Port:${PORT}`);
});
