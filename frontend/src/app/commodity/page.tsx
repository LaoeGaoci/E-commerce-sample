'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'react-feather';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;

}

const CommodityListPage: React.FC = () => {
  // 商品数据
  const products: Product[] = [
    { id: '101', name: '时尚运动鞋', price: 299, imageUrl: 'https://picsum.photos/id/101/200' },
    { id: '102', name: '无线蓝牙耳机', price: 399, imageUrl: 'https://picsum.photos/id/102/200' },
    { id: '103', name: '智能手表', price: 899, imageUrl: 'https://picsum.photos/id/103/200' },
    { id: '104', name: '简约背包', price: 199, imageUrl: 'https://picsum.photos/id/104/200' },
  ];

  // 购物车状态
  const [, setCartItems] = useState<Product[]>([]);

  // 添加到购物车
  const addToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* 页面标题 */}
      <h1 className="text-3xl font-bold text-black mb-6">Shopping List</h1>

      {/* 商品列表 */}
      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex items-start">
            {/* 商品图片 */}
            <div className="w-40 h-40 mr-6">
            <Image
                src={process.env.NEXT_PUBLIC_NGINX_URL + product.imageUrl}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 商品信息 */}
            <div>
              <Link href={`/commodity/${product.id}`}>
                <h3 className="font-semibold text-black mb-2">{product.name}</h3>
                <p className="text-gray-600 font-bold text-lg">¥{product.price}</p>
              </Link>

              {/* 操作按钮 */}
              <div className="mt-4 flex items-center">
                <button 
                  onClick={() => addToCart(product)}
                  className="px-2 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Add to cart
                </button>
                <Heart size={20} className="ml-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommodityListPage;