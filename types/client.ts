

// types/client.ts
// types/client.ts
// types/client.ts
export interface Client {
  _id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  phone?: string;
  address?: string;
  products: Array<{
    name: string;
    characteristics: Record<string, string>;
    subProducts: Array<{
      name: string;
      specifications: string;
    }>;
  }>;
}
  export interface ClientDocument extends Client, Document {}