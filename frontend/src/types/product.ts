export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    stock: number;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // 商品分类
  export type ProductCategory = 
    | 'books'
    | 'electronics'
    | 'clothing'
    | 'home'
    | 'food'
    | 'other';