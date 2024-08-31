import { Schema, model, Types } from 'mongoose';

const commentSchema = new Schema({
  content: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },   
  productId: { type: Types.ObjectId, ref: 'Product', required: true } 
}, {
  timestamps: true  
});

const Comment = model('Comment', commentSchema);

export default Comment;