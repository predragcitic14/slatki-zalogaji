export interface User {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  ingredients: string;
  picture: string;
  type: 'cake' | 'cookie';
  createdAt?: Date;
  updatedAt?: Date;
}
