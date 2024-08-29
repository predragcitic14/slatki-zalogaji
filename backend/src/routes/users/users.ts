import { Router, Request, Response } from 'express';
import User from '../../models/user'; 
import { userValidationSchema } from '../../validation-schemas/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';

const router = Router();
const jwtSecret = 'test';

router.post('/register', async (req: Request, res: Response) => {
  try {
    userValidationSchema.parse(req.body);

    const { email, password, name, lastname, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const type = req.body.type ? req.body.type : "common"

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      lastname,
      phone,
      address,
      type
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: error });
  }
});

router.post('/login', async(req: Request, res: Response) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    const { password: _, __v, ...userInfo } = user;

    res.cookie('authToken', token, {
      httpOnly: true, 
      secure: true,  
      sameSite: 'strict', 
      maxAge: 3600000  
    });

    res.json({ user: userInfo });
  } catch (error) {
    res.status(500).json({message: 'Server error'});
  }
})

router.patch('/update/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const parsedData = userValidationSchema.partial().parse(req.body);
    console.log(parsedData);
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (parsedData.password) {
      const saltRounds = 10;
      parsedData.password = await bcrypt.hash(parsedData.password, saltRounds);
    }

    console.log(parsedData);

    Object.assign(user, parsedData);

    await user.save();

    const { password: _, __v, ...updatedUser } = user.toObject();

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
