'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Address } from '../data/addresses';
import { Cart } from '../data/carts';
import { Product } from '../data/products';
import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import { checkoutCart } from './orderService';
import './order.scss';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const OrderPaymentPage: React.FC = () => {
  const router = useRouter();
  const userId = '1'; // 假设当前用户ID为1

  // 状态管理
  const [isAddressSidebarOpen, setIsAddressSidebarOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isPaymentSuccessModalOpen, setPaymentSuccessModalOpen] = useState(false);

  // 获取地址和购物车数据
  useEffect(() => {
    const storedAddresses = loadFromStorage<Address[]>('addresses') || [];
    const userAddresses = storedAddresses.filter(addr => addr.userId === userId);
    setAddresses(userAddresses);

    if (userAddresses.length > 0 && !selectedAddress) {
      setSelectedAddress(userAddresses[0].id);
    }

    const carts: Cart[] = loadFromStorage<Cart[]>('carts') || [];
    const userCart = carts.find(c => c.userId === userId) || null;

    if (userCart) {
      setCart(userCart);
      const products = loadFromStorage<Product[]>('products') || [];

      const items = userCart.products.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          id: item.productId,
          name: product?.name || '未知商品',
          price: product?.price || 0,
          imageUrl: product?.image || '/images/default.jpg',
          quantity: item.quantity,
        };
      });
      setOrderItems(items);
    }
  }, [userId, selectedAddress]);

  // 当前地址
  const currentAddress = addresses.find(addr => addr.id === selectedAddress);

  // 总价计算
  const totalPrice = useMemo(() => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [orderItems]);

  // 支付处理
  const handlePayNowClick = () => {
    if (!cart) return;

    // 调用购物车结算服务
    const newOrder = checkoutCart(userId, cart.id);
    
    if (newOrder) {
      setPaymentSuccessModalOpen(true);
      // 更新本地购物车状态
      setCart(prev => prev ? { ...prev, products: [], totalPrice: 0 } : null);
      setOrderItems([]);
    }
  };

  // 关闭支付成功弹窗
  const handleCloseModal = () => {
    setPaymentSuccessModalOpen(false);
    router.push('/orders');
  };

  // 地址选择界面
  const renderAddressSidebar = () => (
    <Dialog
      visible={isAddressSidebarOpen}
      onHide={() => setIsAddressSidebarOpen(false)}
      header="Choose Address"
      style={{ width: '90%', maxWidth: '400px' }}
    >
      <div className="address-list">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`address-item ${selectedAddress === address.id ? 'selected' : ''}`}
            onClick={() => setSelectedAddress(address.id)}
          >
            <div className="address-name-phone">
              {address.receiverName} {address.receiverPhone}
            </div>
            <div className="address-detail">{address.receiverAddress}</div>
          </div>
        ))}
        <Button
          label="Confirm Selection"
          icon="pi pi-check"
          className="mt-3 w-full"
          onClick={() => setIsAddressSidebarOpen(false)}
        />
      </div>
    </Dialog>
  );

  // 支付成功弹窗
  const renderSuccessModal = () => (
    <Dialog
      visible={isPaymentSuccessModalOpen}
      onHide={handleCloseModal}
      header=""
      style={{ width: '300px' }}
      modal
    >
      <div className="text-center">
        <i className="pi pi-check-circle text-green-500 text-5xl mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="mb-4">Your order has been placed successfully.</p>
        <Button label="OK" icon="pi pi-check" onClick={handleCloseModal} />
      </div>
    </Dialog>
  );

  return (
    <div className="payment-container">
      <Card className="mypage-card">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Pay</h1>

        {/* 收货地址区域 */}
        <div className="mypage-address-item" onClick={() => setIsAddressSidebarOpen(true)}>
          <div>
            {currentAddress ? (
              <>
                <div>{currentAddress.receiverName} - {currentAddress.receiverPhone}</div>
                <div>{currentAddress.receiverAddress}</div>
              </>
            ) : (
              <div>Please select a shipping address</div>
            )}
          </div>
          <div className="flex justify-end mt-2">
            <button className="text-blue-500 hover:text-blue-700">
              <i className="pi pi-pencil mr-1" />
              Edit Address
            </button>
          </div>
        </div>

        {/* 商品列表 */}
        <h3 className="mypage-section-title">—— Products List ——</h3>
        <div className="mypage-recommendations">
          {orderItems.map((item) => (
            <Link key={item.id} href={`/commodity/${item.id}`} className="mypage-product-card">
              <Image src={item.imageUrl} alt={item.name} width={80} height={80} />
              <div className="product-details">
                <h4>{item.name}</h4>
                <p>¥{item.price.toFixed(2)} × {item.quantity}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* 底部支付栏 */}
      <div className="payment-summary">
        <div className="total-amount">
          <span>Total:</span>
          <span>¥{totalPrice.toFixed(2)}</span>
        </div>
        <button 
          className="payment-button" 
          onClick={handlePayNowClick}
          disabled={!cart?.products.length}
        >
          <i className="pi pi-credit-card mr-2" />
          Pay Now
        </button>
      </div>

      {/* 弹窗组件 */}
      {renderAddressSidebar()}
      {renderSuccessModal()}
    </div>
  );
};

export default OrderPaymentPage;