import { Router, Request, Response } from 'express';
import User from '../../models/user'; 
import { userValidationSchema } from '../../validation-schemas/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import nodemailer from 'nodemailer';

const router = Router();
const jwtSecret = 'test';

// Email transport setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'slatkizalogaji14@gmail.com',
    pass: 'mdxa gfra ourv jjrq'
  }
});


// REGISTER
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

// LOGIN
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

// UPDATE USER
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

// SEND EMAIL FOR FORGOTTEN PASSWORD
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    const encodedToken = encodeURIComponent(resetToken);

    const resetUrl = `http://localhost:4200/reset-password/${encodedToken}`;

    const mailOptions = {
      from: 'Slatki Zalogaji',
      to: user.email,
      subject: 'Promena lozinke',
      html: `<p>Zatrazili ste promenu lozinke. Klinkite <a href="${resetUrl}">ovde</a> da resetujete lozinku. Ovaj link istice za 1 sat.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent successfully', success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// RESET-PASSWORD

router.post('/reset-password', async (req: Request, res: Response) => {
  const { token } = req.body;
  const { newPassword } = req.body;

  console.log('TOKEN', token);
  console.log('NEW PASS', newPassword);

  try {
    const decoded: any = jwt.verify(token, jwtSecret);
    console.log('DECODED', decoded);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronadjen' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Uspesno promenjena lozinka', success: true });
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Istekao token' });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});


export default router;


