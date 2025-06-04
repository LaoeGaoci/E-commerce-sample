"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { getOrderById } from '@/services/orderService';
import { Order } from '@/types/order';

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to load order:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>订单不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航 */}
      <div className="bg-white p-4 flex items-center shadow-sm">
        <Button 
          icon="pi pi-arrow-left" 
          text 
          rounded 
          onClick={() => router.back()} 
          aria-label="Back"
        />
        <div className="flex-1 text-center font-bold">订单页面</div>
        <Button icon="pi pi-ellipsis-v" text rounded aria-label="Menu" />
      </div>

      {/* 页面标题 */}
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold">Order</h1>
      </div>

      {/* 收货地址 */}
      <Card className="m-4 shadow-sm">
        <div className="flex items-start">
          <i className="pi pi-map-marker text-blue-500 text-xl mr-3 mt-1"></i>
          <div>
            <div className="flex items-center">
              <span className="font-medium mr-3">{order.shippingAddress.recipient}</span>
              <span>{order.shippingAddress.phone}</span>
            </div>
            <div className="text-gray-600 mt-1">
              {order.shippingAddress.province} {order.shippingAddress.city} 
              {order.shippingAddress.district} {order.shippingAddress.street}
            </div>
          </div>
        </div>
      </Card>

      {/* 商品列表 */}
      <Card className="m-4 shadow-sm">
        <div className="font-medium text-gray-500 mb-3">商品信息</div>
        <Divider />
        
        {order.items.map((item, index) => (
          <div key={index} className="py-4">
            <div className="flex">
              <div className="bg-gray-200 border-round w-16 h-16 flex items-center justify-center mr-3">
                <i className="pi pi-book text-2xl text-gray-500"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-gray-600 text-sm mt-1">x{item.quantity}</div>
              </div>
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* 价格汇总 */}
      <Card className="m-4 shadow-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>商品小计</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>运费</span>
            <span>$0.00</span>
          </div>
          <Divider />
          <div className="flex justify-between font-bold text-lg">
            <span>总计</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* 支付按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <Button 
          label="立即支付" 
          className="w-full bg-blue-600 border-blue-600 hover:bg-blue-700" 
        />
      </div>
    </div>
  );
}