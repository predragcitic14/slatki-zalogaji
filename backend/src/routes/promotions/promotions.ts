import { Response, Router, Request } from 'express';
import Promotion from '../../models/promotion';
import { upload } from '../../upload';

const router = Router();

// Upload endpoint
router.post('/upload', upload.single('image'), async (req: any, res: Response) => {
  if (!req.file || !req.body.name || !req.body.description) {
    return res.status(400).send('Missing required fields.');
  }

  try {
    const promotion = new Promotion({
      filename: req.file.filename,
      path: req.file.path,
      contentType: req.file.mimetype,
      name: req.body.name,
      description: req.body.description
    });

    await promotion.save();

    res.status(200).json({ message: 'File uploaded successfully', promotion });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Count promotions
router.get('/count', async (req: Request, res: Response) => {
    try {
        const count = await Promotion.countDocuments({});
        res.status(200).json({ count });
      } catch (error) {
        res.status(500).json({ message: 'Error counting documents', error });
      }
})

// Get all promotions
router.get('/', async (req: Request, res: Response) => {
    try {
        const promotions = await Promotion.find({});
        res.status(200).json({ promotions });
    } catch (error) {
        res.status(500).json({ message: 'DB Error', error});
    }
})

export default router;
