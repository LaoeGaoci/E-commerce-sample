import { Product } from './product';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // 下单时的价格（可能不同于当前价格）
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'   // 待支付
  | 'paid'      // 已支付
  | 'shipped'   // 已发货
  | 'delivered' // 已送达
  | 'cancelled' // 已取消
  | 'refunded'; // 已退款

export interface ShippingAddress {
  id: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  isDefault: boolean;
}