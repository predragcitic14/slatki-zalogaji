export interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  ingredients: string;
  filename: string;
  path: string;
  type: 'torta' | 'kolac';
  createdAt?: Date;
  updatedAt?: Date;
}
