export interface Order {
  id: string;
  userId: string;
  productList: {
    productId: string;
    quantity: number;
  }[];
  status: "Receipt" | "Shipment";
  totalPrice: number;
  orderType: "direct" | "cart"; // 新增订单类型字段
  cartId?: string; // 如果是购物车订单，记录来源购物车ID
  addressId: string;
}

export const initialOrders: Order[] = [
  {
    id: "1",
    userId: "1",
    productList: [
      { productId: "1", quantity: 2 },
      { productId: "3", quantity: 1 },
    ],
    status: "Shipment",
    totalPrice: 269.7,
    orderType: "cart",
    cartId: "1",
    addressId: "1",
  },
];
