import { Order, OrderItem, OrderStatus, ShippingAddress } from '@/types/order';
import { Product } from '@/types/product';
import { getProductById } from './productService';
import { v4 as uuidv4 } from 'uuid';

// 模拟数据源
const mockOrders: Order[] = [];
const mockAddresses: ShippingAddress[] = [
  {
    id: 'addr1',
    recipient: '大梨',
    phone: '18033441849',
    province: '广东省',
    city: '深圳市',
    district: '福田区',
    street: '市民街道',
    isDefault: true,
  }
];

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  return mockOrders.find(order => order.id === id);
};

export const createOrder = async (
  userId: string,
  items: { productId: string; quantity: number }[],
  addressId: string
): Promise<Order> => {
  // 查找地址
  const address = mockAddresses.find(addr => addr.id === addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  
  // 获取商品详情
  const orderItems: OrderItem[] = [];
  let totalAmount = 0;
  
  for (const item of items) {
    const product = await getProductById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    
    const orderItem: OrderItem = {
      product,
      quantity: item.quantity,
      price: product.price,
    };
    
    orderItems.push(orderItem);
    totalAmount += product.price * item.quantity;
  }
  
  // 创建新订单
  const newOrder: Order = {
    id: uuidv4(),
    userId,
    items: orderItems,
    totalAmount,
    shippingAddress: address,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockOrders.push(newOrder);
  return newOrder;
};

export const getUserAddresses = async (userId: string): Promise<ShippingAddress[]> => {
  return mockAddresses;
};