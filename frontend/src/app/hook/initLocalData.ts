'use client';

import { useEffect } from 'react';
import { initialProducts } from '../data/products';
import { initialUsers } from '../data/users';
import { initialOrders } from '../data/orders';
import { initialAddresses } from '../data/addresses';
import { initialCarts } from '../data/carts';
import { saveToStorage, loadFromStorage } from '../data/localStorageUtil';
import { initialMessages } from '../data/messages';

export const useInitLocalData = () => {
  useEffect(() => {
    if (!loadFromStorage('products')) saveToStorage('products', initialProducts);
    if (!loadFromStorage('users')) saveToStorage('users', initialUsers);
    if (!loadFromStorage('orders')) saveToStorage('orders', initialOrders);
    if (!loadFromStorage('addresses')) saveToStorage('addresses', initialAddresses);
    if (!loadFromStorage('carts')) saveToStorage('carts', initialCarts);
    if (!loadFromStorage('messages')) saveToStorage('messages', initialMessages);
  }, []);
};
