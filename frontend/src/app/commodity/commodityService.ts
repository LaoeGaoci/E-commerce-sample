import { loadFromStorage } from '../data/localStorageUtil';
import { Product } from '../data/products';

/**
 * 根据分类名从 localStorage 中获取该分类的商品
 * @param category 分类名称（如“电子产品”、“服装鞋帽”等）
 */
export const getProductsByCategory = (category: string): Product[] => {
  const products = loadFromStorage<Product[]>('products') || [];
  return products.filter(p => p.category === category);
};
