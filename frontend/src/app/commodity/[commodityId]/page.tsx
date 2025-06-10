'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { addToCart } from '../../cart/cartService';
import { loadFromStorage } from '../../data/localStorageUtil';
import { Product } from '../../data/products';
import './ProductPage.scss';

const EmptyPage: React.FC = () => {
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null;
  const userId = currentUser?.id || '';
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const commodityId = String(params?.commodityId);

  const products = loadFromStorage<Product[]>('products') || [];
  const product = products.find((p) => p.id === commodityId);

  if (!product) {
    return <div className="p-4 text-center text-red-500">商品不存在或参数错误</div>;
  }

  // ✅ 过滤掉当前商品本身，防止出现在猜你喜欢中
  const recommended = products.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(userId, product.id, quantity);
  };

  return (
    <main className="product-page">
      <Header />

      <section className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-subtitle">{product.description}</p>
        <div className="product-rating">
          <span>⭐ {product.rating.toFixed(1)}</span>
          <span> | {product.purchaseCount} Reviews {product.orderCount} orders</span>
        </div>

        <div className="product-image">
          <img src={process.env.NEXT_PUBLIC_NGINX_URL + product.image} alt="Product Image" />
        </div>

        <div className="product-price">
          <span className="current">US ${product.price.toFixed(2)}</span>
        </div>

        <div className="quantity">
          <label>Quantity:</label>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        <div className="actions">
          <button className="buy">Buy Now</button>
          <button className="cart" onClick={handleAddToCart}>🛒</button>
        </div>
      </section>

      {/* ✅ 猜你喜欢 */}
      <section className="section">
        <h2>You May Also Like</h2>
        <div className="product-grid">
          {recommended.map((item) => (
            <Link href={`/commodity/${item.id}`} key={item.id} className="product-card">
              <div className="product-img">
                <img src={process.env.NEXT_PUBLIC_NGINX_URL + item.image} alt={item.name} />
              </div>
              <div className="product-title">{item.name}</div>
              <div className="product-price">${item.price}</div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default EmptyPage;
