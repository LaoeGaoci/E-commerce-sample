'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft } from 'react-feather';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: 'shipping' | 'delivering' | 'paid' | 'completed';
}

const shippingOrders: OrderItem[] = [
  { id: '1001', name: '时尚运动鞋', price: 299, quantity: 1, status: 'shipping' },
  { id: '1002', name: '简约背包', price: 199, quantity: 2, status: 'shipping' },
];

const deliveringOrders: OrderItem[] = [
  { id: '1003', name: '无线蓝牙耳机', price: 399, quantity: 1, status: 'delivering' },
  { id: '1004', name: '智能手表', price: 899, quantity: 1, status: 'delivering' },
];

const paidOrders: OrderItem[] = [

];

const ordersData: Record<string, OrderItem[]> = {
  shipping: shippingOrders,
  delivering: deliveringOrders,
  paid: paidOrders,
  all: [...shippingOrders, ...deliveringOrders, ...paidOrders],
};

// 提取核心逻辑到带 Suspense 的子组件
const OrderContent = () => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'delivering' | 'paid' | 'all'>('all');
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>(ordersData.all);
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status') as typeof activeTab | null;
    const validStatus = status && ['shipping', 'delivering', 'paid', 'all'].includes(status)
      ? status
      : 'all';

    setActiveTab(validStatus);
    setFilteredOrders(ordersData[validStatus]);
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        {/* 添加返回按钮 */}
        <Link href="/user" className="flex items-center text-gray-700 hover:text-blue-500 transition-colors">
          <ArrowLeft size={20} className="mr-1" />
          <span>返回</span>
        </Link>
        <h1 className="text-xl font-bold text-gray-800">我的订单</h1>
        <div style={{ width: '20px' }} /> {/* 占位符保持标题居中 */}
      </div>

      {/* 订单状态标签页 */}
      <div className="bg-white p-2 shadow-sm mb-4">
        <div className="flex justify-around">
          <Link
            href="/order?status=all"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
          >
            全部
          </Link>
          <Link
            href="/order?status=shipping"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'shipping' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
          >
            待发货
          </Link>
          <Link
            href="/order?status=delivering"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'delivering' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
          >
            待收货
          </Link>
          {/* <Link
            href="/order?status=paid"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'paid' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
          >
            待付款
          </Link> */}
        </div>
      </div>

      {/* 订单列表 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Link href={`/commodity/${order.id}`} key={order.id}>
              <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-200">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{order.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">数量: {order.quantity}</p>
                    </div>
                    <span className="text-gray-700 font-bold">¥{order.price * order.quantity}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-right text-xs text-gray-500">
                  状态: {order.status === 'shipping' ? '待发货' : order.status === 'delivering' ? '待收货' : '待支付'}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">暂无订单</div>
        )}
      </div>
    </div>
  );
};

// 主页面组件
const OrdersPage = () => {
  return (
    <Suspense fallback="加载中...">
      <OrderContent />
    </Suspense>
  );
};

export default OrdersPage;