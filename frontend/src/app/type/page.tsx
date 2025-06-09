'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadFromStorage } from '../data/localStorageUtil';
import { Product } from '../data/products';
import Link from 'next/link';
import './CategoryPage.scss';

const EmptyPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const products = loadFromStorage<Product[]>('products') || [];
    const cats = Array.from(new Set(products.map((p) => p.category)));
    setCategories(cats);
    if (cats.length > 0) {
      setActiveCategory(cats[0]);
    }
  }, []);

  useEffect(() => {
    const products = loadFromStorage<Product[]>('products') || [];
    const result = products.filter((p) => p.category === activeCategory);
    setFilteredProducts(result);
  }, [activeCategory]);

  return (
    <main className="category-page">
      <Header />

      <section className="category-container">
        {/* 左侧分类栏 */}
        <aside className="category-list">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`category-item ${cat === activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </aside>

        {/* 右侧商品列表 */}
        <section className="product-results">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <Link href={`/commodity/${p.id}`} key={p.id} className="product-card">
                <div className="product-img">
                  <img src={`http://localhost:65/${p.image}`} alt={p.name} />
                </div>
                <div className="product-title">{p.name}</div>
                <div className="product-price">${p.price}</div>
              </Link>
            ))
          ) : (
            <div className="no-result">No products found in this category.</div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default EmptyPage;
