import { Schema, model, Types } from 'mongoose';

const commentSchema = new Schema({
  content: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },   // Reference to User model
  productId: { type: Types.ObjectId, ref: 'Product', required: true } // Reference to Product model
}, {
  timestamps: true  // Automatically creates `createdAt` and `updatedAt` fields
});

const Comment = model('Comment', commentSchema);

export default Comment;