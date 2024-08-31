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
  status: "pending" | "approved" | "rejected" | "finished";
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
      status,
      read: true
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// COUNT USER OR ALL
router.get('/count', async (req: Request, res: Response) => {
    try {
        let query = {}
        const { userId, workerId, status } = req.query
        if (userId) {
            if (Array.isArray(userId) || typeof userId !== 'string') {
                return res.status(400).json({message: 'Invalid order id'});
            }
            const objectId = new Types.ObjectId(userId);
            query = {userId: objectId }
        }
        if (workerId) {
            if (Array.isArray(workerId) || typeof workerId !== 'string') {
                return res.status(400).json({ message: 'Invalid worker id' });
            }
            query = { status : { $ne: 'finished' }};
        }
        if (status) {
            query = { status };
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
        const { workerId } = req.query;
        const itemsPerPage = 5;
        const pageNum = parseInt(req.query.pageNum as string, 10) || 1;

        let query = {}

        if (workerId && workerId !== '') {
            query = { status: { $ne: 'finished' } }
        }

        let orders = await Order.find(query)
            .sort({ createdAt: -1 }) 
            .skip((pageNum - 1) * itemsPerPage) 
            .limit(itemsPerPage);

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'DB Error', error });
    }
});

// Get Order by Id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);
  
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
  
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'DB Error', error });
    }
});


// Upload endpoint
router.post('/upload', async (req: any, res: Response) => {
  
    const { newOrder } = req.body;
    console.log(req.body);
    try {
      const product = new Order(req.body);
      await product.save();
      res.status(200).json({ message: 'File uploaded successfully', product });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});


router.patch('/update', async (req: Request, res: Response) => {
    try {
      const { orderId, status } = req.body;
  
      if (!orderId || !status) {
        return res.status(400).json({ message: 'Order ID and status are required.' });
      }
  
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found.' });
      }
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

export default router;
