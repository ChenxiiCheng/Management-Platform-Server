import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
const cookieParser = require('cookie-parser');
import 'colors';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import insuranceRoutes from './routes/insurance.routes';
import invoiceRoutes from './routes/invoice.routes';

const app = express();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/insu', insuranceRoutes);
app.use('/invoice', invoiceRoutes);

export const server = async () => {
  await app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`.green);
  });
};
