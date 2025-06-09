import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import { Product } from '../data/products';
import { Order } from '../data/orders';
import { Cart } from '../data/carts';
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
    status: '待付款',
    totalPrice: product.price * quantity,
    orderType: 'direct'
  };

  orders.push(newOrder);
  saveToStorage('orders', orders);
  return newOrder;
};

export const checkoutCart = (userId: string, cartId: string) => {
  const orders = loadFromStorage<Order[]>('orders') || [];
  const carts = loadFromStorage<Cart[]>('carts') || [];
  const products = loadFromStorage<Product[]>('products') || [];

  const cart = carts.find(c => c.id === cartId && c.userId === userId);
  if (!cart) return null;

  // 计算总价并创建订单
  const totalPrice = cart.products.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const newOrder: Order = {
    id: uuidv4(),
    userId,
    productList: cart.products,
    status: '待付款',
    totalPrice,
    orderType: 'cart',
    cartId: cart.id
  };

  // 清空购物车
  const updatedCarts = carts.map(c => 
    c.id === cartId ? { ...c, products: [], totalPrice: 0 } : c
  );

  saveToStorage('orders', [...orders, newOrder]);
  saveToStorage('carts', updatedCarts);
  return newOrder;
};