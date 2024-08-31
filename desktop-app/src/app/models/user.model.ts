export interface User {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  lastname: string;
  phone: string;
  type?: "common" | "worker";
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}
