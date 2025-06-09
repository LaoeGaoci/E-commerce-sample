'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadFromStorage } from '../data/localStorageUtil';
import { Cart } from '../data/carts';
import { Product } from '../data/products';
import { removeFromCart } from './cartService';
import './CartPage.scss';

const EmptyPage: React.FC = () => {
  const userId = '1'; // 模拟登录用户ID

  const carts = loadFromStorage<Cart[]>('carts') || [];
  const products = loadFromStorage<Product[]>('products') || [];

  const cart = carts.find((c) => c.userId === userId);
  const cartItems = cart?.products || [];

  const getProductInfo = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const subtotal = cart?.totalPrice || 0;

  const handleRemove = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    removeFromCart(userId, productId);
    window.location.reload(); // 简化：重新加载页面
  };

  return (
    <main className="cart-page">
      <Header />

      <div className="cart-content">
        <section className="cart-section">
          <h2 className="cart-title">Shopping Cart</h2>

          {cartItems.length === 0 && <div className="empty-cart">Your cart is empty.</div>}

          {cartItems.map((item) => {
            const product = getProductInfo(item.productId);
            if (!product) return null;
            return (
              <Link href={`/commodity/${product.id}`} key={product.id} className="cart-item">
                <Image
                  src={`http://localhost:65/${product.image}`}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{product.name}</div>
                  <div className="cart-item-price">
                    {item.quantity} × ${product.price.toFixed(2)}
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={(e) => handleRemove(e, product.id)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </Link>
            );
          })}
        </section>

        {/* ✅ 底部小结区域 */}
        {cartItems.length > 0 && (
          <div className="cart-bottom">
            <div className="cart-subtotal">
              <span>Subtotal:</span>
              <span className="subtotal-price">${subtotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">Check Out</button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default EmptyPage;
