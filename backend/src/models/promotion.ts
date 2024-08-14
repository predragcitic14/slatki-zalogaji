import { Schema, model } from 'mongoose';

const promotionSchema = new Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  contentType: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
});

const Promotion = model('Promotion', promotionSchema);

export default Promotion;