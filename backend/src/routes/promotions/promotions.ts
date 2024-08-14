import { Response, Router } from 'express';
import Promotion from '../../models/promotion';
import { upload } from '../../upload';

const router = Router();

// Upload endpoint
router.post('/upload-promotion', upload.single('image'), async (req: any, res: Response) => {
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

export default router;
