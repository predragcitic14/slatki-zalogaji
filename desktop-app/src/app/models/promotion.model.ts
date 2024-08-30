export interface Promotion {
  _id?: string;
  name: string;
  description: string;
  address: string;
  contentType: string;
  filename: string;
  path: string;
  createdAt?: Date;
  updatedAt?: Date;
}
