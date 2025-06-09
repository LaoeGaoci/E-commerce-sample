'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Image } from 'primereact/image';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Product } from '../data/products';
import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import './commodity.scss';

const initialProducts: Product[] = []

const CommodityListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // 初始化加载商品数据
  useEffect(() => {
    const storedProducts = loadFromStorage<Product[]>('products');
    if (storedProducts) {
      setProducts(storedProducts);
    } else {
      // 如果没有存储数据，则使用初始数据
      setProducts(initialProducts);
      saveToStorage('products', initialProducts);
    }

    // 加载购物车数据
    const storedCart = loadFromStorage<Product[]>('cart');
    if (storedCart) {
      setCartItems(storedCart);
    }
  }, []);

  // 添加到购物车
  const addToCart = (product: Product) => {
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    saveToStorage('cart', updatedCart);
  };

  return (
    <div className="commodity-container">
      <h2 className="commodity-title">Product List</h2>
      <div className="commodity-grid">
        {products.map(product => (
          <Card key={product.id} className="commodity-card">
            <Link href={`/commodity/${product.id}`} className="commodity-link">
              <Image src={`/${product.image}`} alt={product.name} />
              <h4>{product.name}</h4>
              <p>¥{product.price}</p>
            </Link>
            <Button
              label="Add to Cart"
              icon="pi pi-shopping-cart"
              onClick={() => addToCart(product)}
              className="p-button-sm mt-2"
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommodityListPage;