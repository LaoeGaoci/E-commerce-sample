'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadFromStorage } from '../data/localStorageUtil';
import { Product } from '../data/products';
import Link from 'next/link';

// PrimeReact 组件
import { ListBox } from 'primereact/listbox';
import { Card } from 'primereact/card';
import './CategoryPage.scss';

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const products = loadFromStorage<Product[]>('products') || [];
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    const catOptions = uniqueCategories.map((cat) => ({ label: cat, value: cat }));
    setCategories(catOptions);
    if (catOptions.length > 0) {
      setActiveCategory(catOptions[0].value);
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

      <section className="category-container p-d-flex">
        {/* 左侧分类栏 */}
        <div className="category-sidebar">
          <ListBox
            value={activeCategory}
            options={categories}
            onChange={(e) => setActiveCategory(e.value)}
            optionLabel="label"
            className="p-listbox-sm"
          />
        </div>

        {/* 右侧商品列表 */}
        <div className="category-products">
          {filteredProducts.length > 0 ? (
            <div className="p-grid">
              {filteredProducts.map((p) => (
                <div className="p-col-12 p-md-4 p-lg-3" key={p.id}>
                  <Link href={`/commodity/${p.id}`} className="product-link">
                    <Card
                      title={p.name}
                      subTitle={`$${p.price}`}
                      className="p-mb-3"
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={`http://localhost:65/${p.image}`}
                        alt={p.name}
                        style={{ width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-m-3">No products found in this category.</div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CategoryPage;
