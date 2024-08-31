import { Schema, model} from 'mongoose';

const orderItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  productId: { type: String, required: false},
});

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  read: { type: Boolean, required: false},
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "finished"], 
    default: "pending", 
    required: true 
  }
}, {
    timestamps: true
});

const Order = model('Order', orderSchema);

export default Order;