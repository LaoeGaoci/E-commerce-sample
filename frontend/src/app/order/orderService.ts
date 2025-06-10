import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import { Product } from '../data/products';
import { Order } from '../data/orders';
import { v4 as uuidv4 } from 'uuid';

export const buyNow = (userId: string, productId: string, quantity: number = 1) => {
  const orders = loadFromStorage<Order[]>('orders') || [];
  const products = loadFromStorage<Product[]>('products') || [];
  
  const product = products.find(p => p.id === productId);
  if (!product) return null;

  const newOrder: Order = {
    id: uuidv4(),
    userId,
    productList: [{ productId, quantity }],
    status: 'Receipt',
    totalPrice: product.price * quantity,
    orderType: 'direct'
  };

  orders.push(newOrder);
  saveToStorage('orders', orders);
  return newOrder;
};