import { ProductDocument } from "@/lib/models/Product";

// types/client.ts
// types/client.ts
export interface Client {
  _id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  company?: string;
  phone?: string;
  address?: string;
  lastContact?: string;
  products: {
    product: string | ProductDocument;
    subProducts: string[];
  }[];
}
  export interface ClientDocument extends Client, Document {}