import { Product, ProductCategory } from '@/types/product';

// 模拟数据源
const mockProducts: Product[] = [
  {
    id: '1',
    name: '简约生活省钱书',
    description: '帮助你节省开支的实用指南',
    price: 10.00,
    category: 'books',
    stock: 100,
    rating: 4.5,
    createdAt: new Date('2025-06-02'),
    updatedAt: new Date('2023-06-04'),
  },
  {
    id: '2',
    name: '高效工作手册',
    description: '提升工作效率的实用指南',
    price: 12.99,
    category: 'books',
    stock: 80,
    rating: 4.7,
    createdAt: new Date('2025-06-02'),
    updatedAt: new Date('2025-06-03'),
  },
  // 更多商品...
];

export const getProductById = async (id: string): Promise<Product | undefined> => {
  return mockProducts.find(product => product.id === id);
};

export const getRecommendedProducts = async (): Promise<Product[]> => {
  return mockProducts.slice(0, 4);
};

export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  return mockProducts.filter(product => product.category === category);
};