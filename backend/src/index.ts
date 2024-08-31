import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import healthcheck from './routes/healthcheck';
import users from './routes/users/users';
import promotions from './routes/promotions/promotions';
import products from './routes/products/products'
import comments from './routes/comments/comments';
import orders from './routes/orders/orders'

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/healthcheck', healthcheck);
app.use('/users', users);
app.use('/promotions', promotions);
app.use('/products', products);
app.use('/comments', comments);
app.use('/orders', orders)

// Serve uploads
app.use('/uploads', express.static(path.join('uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/slatki-zalogaji')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error:', error));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
