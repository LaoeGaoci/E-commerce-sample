// app/order/payment/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, MapPin, X } from 'react-feather';
import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}
// 地址类型定义
interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
  }
const OrderPaymentPage: React.FC = () => {
  // 订单商品数据
  const orderItems: OrderItem[] = [
    {
        id: '1001', name: '时尚运动鞋', price: 299,
        imageUrl: 'http://localhost:65/R.jpg',
    },
    {
        id: '1002', name: '简约背包', price: 199,
        imageUrl: 'https://picsum.photos/id/102/200',
    },
    {
        id: '1003', name: '运动配饰', price: 49,
        imageUrl: 'https://picsum.photos/id/103/200',
    },
    {
      id: '1004', name: '运动配饰', price: 49,
      imageUrl: 'https://picsum.photos/id/103/200',
  },
  {
    id: '1005', name: '运动配饰', price: 49,
    imageUrl: 'https://picsum.photos/id/103/200',
  },
  ];

  // 地址侧边栏状态
  const [isAddressSidebarOpen, setIsAddressSidebarOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(1); // 默认选中第一个地址

  // 地址数据（与user页面保持一致）
  const addresses: Address[] = [
    { id: 1, name: '张三', phone: '138****1234', address: '北京市朝阳区建国路88号', isDefault: true },
    { id: 2, name: '张三', phone: '138****5678', address: '上海市浦东新区张江高科技园区', isDefault: false },
    ];

  // 获取当前选中地址
  const currentAddress = addresses.find(addr => addr.id === selectedAddress);

  // 订单总价
  const totalPrice = orderItems.reduce((total, item) => total + item.price, 0);

  // 支付成功弹窗状态
  const [isPaymentSuccessModalOpen, setPaymentSuccessModalOpen] = useState(false);

  // 处理支付按钮点击事件
  const handlePayNowClick = () => {
    // 模拟支付逻辑
    setPaymentSuccessModalOpen(true);
  };

  // 关闭支付成功弹窗
  const handleCloseModal = () => {
    setPaymentSuccessModalOpen(false);
  };

  return (
  <div className="bg-white p-4 mb-4 container mx-auto rounded-lg cursor-pointer hover:bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Pay</h1>

      {/* 收货地址可点击区域 */}
      <div 
        className="bg-blue-50 p-4 w-full rounded-lg cursor-pointer hover:bg-gray-50"
        onClick={() => setIsAddressSidebarOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="text-gray-600 mr-2" />
            <div>
              <p className="text-gray-800">{currentAddress?.name} {currentAddress?.phone}</p>
              <p className="text-gray-600">{currentAddress?.address}</p>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </div>
      </div>

      {/* 地址选择侧边栏（复用user页面样式） */}
      {isAddressSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
        <div className="w-4/5 sm:w-96 bg-white h-[93vh] p-4 shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">收货地址</h2>
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡到父级
                setIsAddressSidebarOpen(false);
              }}
            >
              <X className="text-gray-600" />
            </button>
            </div>
            
            <div className="space-y-4">
              {addresses.map(address => (
                <div
                  key={address.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedAddress === address.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => {
                    setSelectedAddress(address.id);
                    setIsAddressSidebarOpen(false);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{address.name}</span>
                      <span className="ml-2 text-gray-600">{address.phone}</span>
                    </div>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                        默认
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{address.address}</p>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-4 right-4">
            <button
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡
                setIsAddressSidebarOpen(false);
              }}
            >
              确认选择
            </button>
            </div>
          </div>
        </div>
      )}

      {/* 商品列表 */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-360px)]">
        <div className="flex justify-between items-center mb-4 mt-10">
          <span className="font-bold text-gray-800">Product</span>
          <span className="font-bold text-gray-800">Price</span>
        </div>
        <div className="divide-y divide-gray-200">
          {orderItems.map((item) => (
            <Link 
              key={item.id}
              href={`/commodity/${item.id}`}
              className="flex items-center py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 h-16 mr-4 rounded relative overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{item.name}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-800">¥{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 总价和支付按钮固定在底部 */}
      <div className="fixed bottom-10 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-md z-10">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-gray-800">¥{totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePayNowClick}
          className="w-full py-3 mt-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Pay Now
        </button>
      </div>

      {/* 支付成功弹窗 */}
      {isPaymentSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <CheckCircle size={48} className="text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            <button
              onClick={handleCloseModal}
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPaymentPage;