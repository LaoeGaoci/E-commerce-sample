import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import { Product } from '../data/products';
import { Order } from '../data/orders';
import { v4 as uuidv4 } from 'uuid';

// 实现商品加入订单的逻辑（用户直接购买单个商品）
export const buyNow = (userId: string, productId: string, quantity: number = 1) => {
  const orders = loadFromStorage<Order[]>('orders') || [];
  const products = loadFromStorage<Product[]>('products') || [];

  const product = products.find(p => p.id === productId);
  if (!product) return;

  const totalPrice = product.price * quantity;
  const newOrder: Order = {
    id: uuidv4(),
    userId,
    productList: [{ productId, quantity }],
    status: '待发货',
    totalPrice,
  };

  orders.push(newOrder);
  saveToStorage('orders', orders);
};
