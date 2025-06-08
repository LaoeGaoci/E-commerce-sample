'use client';

import { useEffect } from 'react';
import { initialProducts } from '../data/products';
import { initialUsers } from '../data/users';
import { initialOrders } from '../data/orders';
import { initialAddresses } from '../data/addresses';
import { initialCarts } from '../data/carts';
import { saveToStorage, loadFromStorage } from '../data/localStorageUtil';

export const useInitLocalData = () => {
  useEffect(() => {
    if (!loadFromStorage('products')) saveToStorage('products', initialProducts);
    if (!loadFromStorage('users')) saveToStorage('users', initialUsers);
    if (!loadFromStorage('orders')) saveToStorage('orders', initialOrders);
    if (!loadFromStorage('addresses')) saveToStorage('addresses', initialAddresses);
    if (!loadFromStorage('carts')) saveToStorage('carts', initialCarts);
  }, []);
};
