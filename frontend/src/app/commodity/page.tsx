'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Image } from 'primereact/image';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Product } from '../data/products';
import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import { addToCart } from '../cart/cartService';
import { useRouter } from 'next/navigation';
import './commodity.scss';

const initialProducts: Product[] = [];

const CommodityListPage: React.FC = () => {
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null;
  const userId = currentUser?.id || '';
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';
  const router = useRouter();

  useEffect(() => {
    const storedProducts = loadFromStorage<Product[]>('products');
    const products = storedProducts || initialProducts;

    if (query) {
      const matched = products.filter(p =>
        p.name.toLowerCase().includes(query)
      );
      setFilteredProducts(matched);
    } else {
      setFilteredProducts(products);
    }

    if (!storedProducts) {
      saveToStorage('products', initialProducts);
    }
  }, [query]);

  const handleAddToCart = (product: Product) => {
    addToCart(userId, product.id, 1);
  };

  return (
    <div className="commodity-container">
      <h2 className="Search-Title">
        {query ? `Search results for "${query}"` : 'All Products'}
      </h2>
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No matching products found.</p>
      ) : (
        <div className="commodityList">
          {filteredProducts.map(product => (
            <Card key={product.id} className='commodity-card' onClick={() => router.push(`/commodity/${product.id}`)}>
              <div className="commodity-item">
                <Image
                  src={process.env.NEXT_PUBLIC_NGINX_URL + product.image}
                  alt={product.name}
                  width="150"
                  height="150"
                  preview
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="commodity-info">
                  <h5>{product.name}</h5>
                  <p>{product.description}</p>
                  <div className="buy-commodity">
                    <span className="price">¥{product.price}</span>
                    <Button
                      label="Add"
                      icon="pi pi-shopping-cart"
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className="add-cart"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommodityListPage;
