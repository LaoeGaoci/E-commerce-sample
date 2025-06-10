import { loadFromStorage, saveToStorage } from "../data/localStorageUtil";
import { Product } from "../data/products";
import { Order } from "../data/orders";
import { v4 as uuidv4 } from "uuid";

export const buyNow = (
  userId: string,
  productId: string,
  quantity: number = 1
): Order | null => {
  const orders = loadFromStorage<Order[]>("orders") || [];
  const products = loadFromStorage<Product[]>("products") || [];

  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const newOrder: Order = {
    id: uuidv4(),
    userId,
    productList: [{ productId, quantity }],
    status: "Shipment",
    totalPrice: product.price * quantity,
    orderType: "direct",
    addressId: "",
  };

  orders.push(newOrder);
  saveToStorage("orders", orders);
  return newOrder;
};

/**
 * 将指定订单状态修改为 'Receipt'
 * @param orderId 要修改的订单 ID
 * @returns 是否修改成功
 */
export const markOrderAsReceived = (orderId: string): boolean => {
  const orders = loadFromStorage<Order[]>("orders") || [];
  const order = orders.find((o) => o.id === orderId);
  if (!order) return false;

  order.status = "Receipt";
  saveToStorage("orders", orders);
  return true;
};

/**
 * 为订单设置地址ID（绑定用户选择的收货地址）
 * @param orderId 订单ID
 * @param addressId 地址ID
 */
export const addOrderAddress = (orderId: string, addressId: string): boolean => {
  const orders = loadFromStorage<Order[]>('orders') || [];
  const order = orders.find(o => o.id === orderId);

  if (!order) return false;

  order.addressId = addressId; // ✅ 正式写入地址ID
  saveToStorage('orders', orders);
  return true;
};