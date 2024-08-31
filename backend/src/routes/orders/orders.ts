import { Request, Response, Router } from 'express';
import Order from '../../models/order';
import { Types } from 'mongoose';

const router = Router();

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRequestBody {
  userId: string;
  items: OrderItem[];
  timestamp: string;
  totalPrice: number;
  status: "pending" | "approved" | "rejected";
}


// UPLOAD ORDER
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, items, timestamp, totalPrice, status } = req.body as OrderRequestBody;

    const newOrder = new Order({
      userId,
      items,
      timestamp,
      totalPrice,
      status
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// COUNT
router.get('/count', async (req: Request, res: Response) => {
    try {
        let query = {}
        const { userId } = req.query
        if (userId) {
            if (Array.isArray(userId) || typeof userId !== 'string') {
                return res.status(400).json({message: 'Invalid order id'});
            }
            const objectId = new Types.ObjectId(userId);
            query = {userId: objectId }
        }
        const count = await Order.countDocuments(query);
        res.status(200).json({ count });
      } catch (error) {
        res.status(500).json({ message: 'Error counting orders', error });
      }
})

// Get all orders for user
router.get('/', async (req: Request, res: Response) => {
    try {
        let query = {}
        const { userId } = req.query
        if (userId) {
            if (Array.isArray(userId) || typeof userId !== 'string') {
                return res.status(400).json({message: 'Invalid user id'});
            }
            const objectId = new Types.ObjectId(userId);
            query = {userId: objectId }
        }

        const itemsPerPage = 5;
        const pageNum = parseInt(req.query.pageNum as string, 10) || 0;
        const orders = await Order.find(query).sort({createdAt: -1}).skip((pageNum - 1) * itemsPerPage).limit(itemsPerPage);
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'DB Error', error});
    }
})

export default router;
