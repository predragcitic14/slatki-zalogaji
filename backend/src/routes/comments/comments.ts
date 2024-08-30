import { Response, Router, Request } from 'express';
import Comment from '../../models/comment';
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

const router = Router();

const handleStringifiedObjectId = (req: Request, res: Response) => {
    let query = {}
    const { productId } = req.query
    if (productId) {
        if (Array.isArray(productId) || typeof productId !== 'string') {
            return res.status(400).json({message: 'Invalid product id'});
        }
        const objectId = new Types.ObjectId(productId);
        query = {productId: objectId }
    }
}


// Upload endpoint
router.post('/upload', async (req: any, res: Response) => {
  console.log('USO', req.body);
  if (!req.body.content || !req.body.userId || !req.body.productId) {
    return res.status(400).send('Missing required fields.');
  }

  const { content, userId, productId } = req.body;

  try {
    const comment = new Comment({
        content,
        userId,
        productId
    });

    await comment.save();

    res.status(200).json({ message: 'Comment uploaded successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Count comments
router.get('/count', async (req: Request, res: Response) => {
    try {
        let query = {}
        const { productId } = req.query
        if (productId) {
            if (Array.isArray(productId) || typeof productId !== 'string') {
                return res.status(400).json({message: 'Invalid product id'});
            }
            const objectId = new Types.ObjectId(productId);
            query = {productId: objectId }
        }
        const count = await Comment.countDocuments(query);
        res.status(200).json({ count });
      } catch (error) {
        res.status(500).json({ message: 'Error counting documents', error });
      }
})

// Get all comments for product
router.get('/', async (req: Request, res: Response) => {
    try {
        let query = {}
        const { productId } = req.query
        if (productId) {
            if (Array.isArray(productId) || typeof productId !== 'string') {
                return res.status(400).json({message: 'Invalid product id'});
            }
            const objectId = new Types.ObjectId(productId);
            query = {productId: objectId }
        }

        const itemsPerPage = 3;
        const pageNum = parseInt(req.query.pageNum as string, 10) || 0;
        const comments = await Comment.find(query).sort({createdAt: -1}).skip((pageNum - 1) * itemsPerPage).limit(itemsPerPage);
        res.status(200).json({ comments });
    } catch (error) {
        res.status(500).json({ message: 'DB Error', error});
    }
})

// Get comment by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      res.status(200).json({ comment });
  } catch (error) {
      res.status(500).json({ message: 'DB Error', error });
  }
});

export default router;
