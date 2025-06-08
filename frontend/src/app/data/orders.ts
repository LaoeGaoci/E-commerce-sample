export interface Order {
  id: string;
  userId: string;
  productList: {
    productId: string;
    quantity: number;
  }[];
  status: '待收货' | '待发货';
  totalPrice: number;
}

export const initialOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    productList: [
      { productId: '1', quantity: 2 },
      { productId: '3', quantity: 1 },
    ],
    status: '待发货',
    totalPrice: 269.7,
  },
];
