import { Response, Router, Request } from 'express';
import Product from '../../models/product';
import { upload } from '../../upload';

const router = Router();

// Upload endpoint
router.post('/upload', upload.single('image'), async (req: any, res: Response) => {
  if (!req.file || !req.body.name || !req.body.description) {
    return res.status(400).send('Missing required fields.');
  }

  try {
    const product = new Product({
      name: req.body.name,
      filename: req.file.filename,
      path: req.file.path,
      contentType: req.file.mimetype,
      description: req.body.description,
      price: req.body.price,
      ingredients: req.body.ingredients,
      type: req.body.type
    });

    await product.save();

    res.status(200).json({ message: 'File uploaded successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Count products
router.get('/count', async (req: Request, res: Response) => {
    try {
        const type = req.query.type;
        const query = type ? { type } : { }
        const count = await Product.countDocuments(query);
        res.status(200).json({ count });
      } catch (error) {
        res.status(500).json({ message: 'Error counting documents', error });
      }
})

// Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const itemsPerPage = 3;
        const pageNum = parseInt(req.query.pageNum as string, 10) || 0;
        const type = req.query.type;
        const products = await Product.find({ type }).skip((pageNum - 1) * itemsPerPage).limit(itemsPerPage);
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'DB Error', error});
    }
})

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
      const product = await Product.findById(req.params.id);

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ product });
  } catch (error) {
      res.status(500).json({ message: 'DB Error', error });
  }
});

export default router;
