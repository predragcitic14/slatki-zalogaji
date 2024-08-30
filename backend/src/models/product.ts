import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  filename: { type: String, required: false},
  path: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: { type: String, required: true },
  type: { type: String, required: true }
});

const Product = model('Product', productSchema);

export default Product;