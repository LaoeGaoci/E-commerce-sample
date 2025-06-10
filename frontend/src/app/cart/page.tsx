'use client';

import React from 'react';
import { loadFromStorage } from '../data/localStorageUtil';
import { Cart } from '../data/carts';
import { Product } from '../data/products';
import { removeFromCart, checkoutCart } from './cartService';
import { Image } from 'primereact/image';
import { useRouter } from 'next/navigation';
import './CartPage.scss';

const EmptyPage: React.FC = () => {

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null;
  const userId = currentUser?.id || '';

  const carts = loadFromStorage<Cart[]>('carts') || [];
  const products = loadFromStorage<Product[]>('products') || [];
  const router = useRouter();
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

  const handleCheckout = () => {
    checkoutCart(userId);       // 执行结算
    router.push('/order');      // 跳转订单页
  };

  return (
    <main className="cart-page">
      <div className="cart-content">
        <section className="cart-section">
          <h2 className="cart-title">Shopping Cart</h2>

          {cartItems.length === 0 && <div className="empty-cart">Your cart is empty.</div>}

          {cartItems.map((item) => {
            const product = getProductInfo(item.productId);
            if (!product) return null;
            return (
              <div key={product.id} className="cart-item" onClick={() => router.push(`/commodity/${product.id}`)}>
                <Image
                  src={process.env.NEXT_PUBLIC_NGINX_URL + product.image}
                  alt={product.name}
                  width="80"
                  height="80"
                  className="cart-item-img"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{product.name}</div>
                  <div className="cart-item-price">
                    {item.quantity} x ${product.price.toFixed(2)}
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={(e) => {e.stopPropagation(); handleRemove(e, product.id);}}
                  aria-label="Remove item"
                >
                  x
                </button>
              </div>
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
            <button className="checkout-btn" onClick={handleCheckout}>
              Check Out
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default EmptyPage;
