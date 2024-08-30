import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    dbConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  };

  try {
    res.send(healthcheck);
  } catch (error) {
    res.status(503).send({ message: error });
  }
});

export default router;
