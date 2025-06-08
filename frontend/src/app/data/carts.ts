export interface Cart {
  id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  totalPrice: number;
}

export const initialCarts: Cart[] = [
  {
    id: '1',
    userId: '1',
    products: [
      { productId: '1', quantity: 1 },
      { productId: '2', quantity: 2 },
    ],
    totalPrice: 199.8,
  },
];
