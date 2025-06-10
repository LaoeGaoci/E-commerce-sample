'use client';

import { useEffect } from 'react';
import { Product, initialProducts } from '@/mock/products';
import { saveToStorage } from '@/mock/localStorageUtil';

const InitProductsToStorage = () => {
  useEffect(() => {
    const STORAGE_KEY = 'products';
    saveToStorage<Product[]>(STORAGE_KEY, initialProducts);
    console.log('✅ 商品数据已写入 localStorage');
  }, []);

  return <div>初始化商品数据中……请打开控制台查看结果</div>;
};

export default InitProductsToStorage;
