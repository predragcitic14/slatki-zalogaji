export interface User {
  _id?: string;          // Optional because it might not be set when creating a new user
  email: string;
  password?: string;
  name: string;
  lastname: string;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}
