import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import { Cart } from '../data/carts';
import { Product } from '../data/products';
import { Order } from '../data/orders';
import { v4 as uuidv4 } from 'uuid';

// 商品加入购物车
export const addToCart = (userId: string, productId: string, quantity: number = 1) => {
  const carts = loadFromStorage<Cart[]>('carts') || [];
  const products = loadFromStorage<Product[]>('products') || [];

  let cart = carts.find(c => c.userId === userId);
  if (!cart) {
    cart = { id: uuidv4(), userId, products: [], totalPrice: 0 };
    carts.push(cart);
  }

  const existing = cart.products.find(p => p.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  cart.totalPrice = cart.products.reduce((total, item) => {
    const prod = products.find(p => p.id === item.productId);
    return total + (prod ? prod.price * item.quantity : 0);
  }, 0);

  saveToStorage('carts', carts);
};

// 购物车结算
export const checkoutCart = (userId: string) => {
  const carts = loadFromStorage<Cart[]>('carts') || [];
  const products = loadFromStorage<Product[]>('products') || [];
  const orders = loadFromStorage<Order[]>('orders') || [];

  const cart = carts.find(c => c.userId === userId);
  if (!cart || cart.products.length === 0) return;

  const totalPrice = cart.products.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const newOrder: Order = {
    id: uuidv4(),
    userId,
    productList: [...cart.products],
    status: '待发货',
    totalPrice,
    orderType: 'cart',
    cartId: cart.id
  };

  orders.push(newOrder);
  cart.products = [];
  cart.totalPrice = 0;

  saveToStorage('orders', orders);
  saveToStorage('carts', carts);
};

// 删除购物车商品
export const removeFromCart = (userId: string, productId: string) => {
  const carts = loadFromStorage<Cart[]>('carts') || [];
  const products = loadFromStorage<Product[]>('products') || [];

  const cart = carts.find(c => c.userId === userId);
  if (!cart) return;

  cart.products = cart.products.filter(p => p.productId !== productId);

  cart.totalPrice = cart.products.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  saveToStorage('carts', carts);
};
