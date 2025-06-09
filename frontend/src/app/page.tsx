'use client';

import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';
import { loadFromStorage } from './data/localStorageUtil';
import { Product } from './data/products';
import './HomePage.scss';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [currentAd, setCurrentAd] = useState(0);
  const [paused, setPaused] = useState(false);

  const ads = [
    'http://localhost:65/ad1.png',
    'http://localhost:65/ad2.png',
    'http://localhost:65/ad4.png'
  ];

  useEffect(() => {
    const all = loadFromStorage<Product[]>('products') || [];
    setAllProducts(all);

    const shuffled = [...all].sort(() => Math.random() - 0.5);
    const hot = shuffled.filter(p => p.isHot).slice(0, 8);
    const recommend = shuffled.filter(p => !hot.find(h => h.id === p.id)).slice(0, 6);

    setHotProducts(hot);
    setRecommended(recommend);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ads.length, paused]);

  return (
    <main className="homepage">
      <Header />

      {/* 轮播图 */}
      <section
        className="banner-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img src={ads[currentAd]} alt="Ad Banner" className="banner-image" />
        <div className="banner-indicator">
          {ads.map((_, index) => (
            <span
              key={index}
              className={index === currentAd ? 'active' : ''}
              onClick={() => setCurrentAd(index)}
            />
          ))}
        </div>
      </section>

      {/* 分类区域 */}
      <section className="category-grid">
        {Array.from(new Set(allProducts.map(p => p.category))).map((cat) => (
          <div className="category-item" key={cat}>{cat}</div>
        ))}
      </section>

      {/* 热门商品 */}
      <section className="section">
        <h2>Hot Project</h2>
        <div className="product-grid">
          {hotProducts.map((product) => (
            <Link href={`/commodity/${product.id}`} key={product.id} className="product-card">
              <div className="product-img">
                <img src={`http://localhost:65/${product.image}`} alt={product.name} />
              </div>
              <div className="product-title">{product.name}</div>
              <div className="product-price">${product.price}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 猜你喜欢 */}
      <section className="section">
        <h2>You May Also Like</h2>
        <div className="product-grid">
          {recommended.map((product) => (
            <Link href={`/commodity/${product.id}`} key={product.id} className="product-card">
              <div className="product-img">
                <img src={`http://localhost:65/${product.image}`} alt={product.name} />
              </div>
              <div className="product-title">{product.name}</div>
              <div className="product-price">${product.price}</div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
