import { z } from 'zod';

const userValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  lastname: z.string(),
  phone: z.string(),
  address: z.string(),
  type: z.string().optional() // user can choose type property only if its an admin user
});

export { userValidationSchema };
