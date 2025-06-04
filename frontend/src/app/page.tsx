"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import ProductList from '@/components/ProductList';
import OrderPreview from '@/components/OrderPreview';
import { getRecommendedProducts } from '@/services/productService';
import { getUserAddresses, createOrder } from '@/services/orderService';
import { Product } from '@/types/product';
import { Order, ShippingAddress } from '@/types/order';
import { User } from '@/types/user';

export default function ShoppingPlatform() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(3);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    // 模拟数据加载
    const loadData = async () => {
      // 获取推荐商品
      const recommendedProducts = await getRecommendedProducts();
      setProducts(recommendedProducts);
      
      // 模拟用户数据
      setUser({
        id: '1',
        username: 'Freedom',
        email: 'freedom@example.com',
        inviteCode: '12345',
        createdAt: new Date(),
        updatedAt: new Date(),
        addresses: [],
      });
      
      // 获取用户地址
      const userAddresses = await getUserAddresses('1');
      setAddresses(userAddresses);
      
      // 如果有默认地址，设置为当前订单地址
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        // 模拟订单创建
        const orderItems = cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
        
        if (orderItems.length > 0) {
          const newOrder = await createOrder('1', orderItems, defaultAddress.id);
          setCurrentOrder(newOrder);
        }
      }
    };
    
    loadData();
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handlePay = () => {
    if (currentOrder) {
      router.push(`/order/${currentOrder.id}`);
    }
  };

  // 其他服务
  const services = [
    { label: '商品收藏', icon: 'pi pi-heart' },
    { label: '收货地址', icon: 'pi pi-map-marker' },
    { label: '我的消息', icon: 'pi pi-comments' }
  ];

  // 订单状态
  const orderStatus = [
    { label: '购物车', value: 'cart', count: cartItems.length },
    { label: '待发货', value: 'pending', count: 2 },
    { label: '待收货', value: 'delivering', count: 1 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部状态栏 */}
      <div className="bg-white p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <span className="font-bold text-xl">我的</span>
        </div>
        <div className="text-gray-500">9:41</div>
      </div>

      {/* 用户信息区域 */}
      <Card className="m-4 shadow-none border-none">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar icon="pi pi-user" size="large" shape="circle" className="bg-blue-500" />
            <div className="ml-3">
              <h2 className="text-lg font-bold">{user?.username || '加载中...'}</h2>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">邀请码：</span>
                <InputText value={user?.inviteCode || '12345'} className="w-20 h-8 text-sm" />
              </div>
            </div>
          </div>
          <Button icon="pi pi-cog" text rounded aria-label="Settings" />
        </div>
      </Card>

      {/* 订单状态卡片 */}
      <Card className="m-4 shadow-sm">
        <div className="flex justify-around">
          {orderStatus.map((status, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >
              <div className="relative">
                <i className={`pi ${status.value === 'cart' ? 'pi-shopping-cart' : status.value === 'pending' ? 'pi-box' : 'pi-truck'} text-2xl text-blue-500`}></i>
                {status.count > 0 && (
                  <Badge value={status.count} severity="danger" className="absolute -top-1 -right-1"></Badge>
                )}
              </div>
              <span className="mt-2 text-sm">{status.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 其他服务 */}
      <Card className="m-4 shadow-sm">
        <h3 className="font-medium mb-4">其他服务</h3>
        <div className="grid grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center">
                <i className={`${service.icon} text-blue-500 text-xl`}></i>
              </div>
              <span className="mt-2 text-sm">{service.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 推荐商品 */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">—— 为你挑选 ——</h2>
          <span className="text-blue-500 text-sm">更多</span>
        </div>
        
        <ProductList 
          products={products} 
          onAddToCart={handleAddToCart} 
        />
      </div>

      {/* 订单预览面板 */}
      {currentOrder && (
        <OrderPreview order={currentOrder} onPay={handlePay} />
      )}

      {/* 底部导航栏 */}
      {/* ...底部导航栏代码... */}
    </div>
  );
}