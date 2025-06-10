// src/app/order/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { loadFromStorage } from '../data/localStorageUtil';
import { Order } from '../data/orders';
import { Product } from '../data/products';
import { useRouter } from 'next/navigation';
import './order.scss';

export default function OrderPage() {
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null;
  const userId = currentUser?.id || '';
  
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const allOrders = loadFromStorage<Order[]>('orders') || [];
    const userOrders = allOrders.filter(order => order.userId === userId);
    const allProducts = loadFromStorage<Product[]>('products') || [];

    setOrders(userOrders);
    setProducts(allProducts);
  }, [userId]);

  const getProductDetail = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  // 示例按钮触发付款：
  const handlePayNow = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowSuccess(true); // 弹出成功提示
  };

  const onConfirm = () => {
    setShowSuccess(false);
    if (selectedOrderId) {
      router.push(`/order/${selectedOrderId}`); // ✅ 跳转到物流详情页
    }
  };
  return (
    <div className="order-page">
      <Toast ref={toast} />
      <h1>Order</h1>
      {orders.length === 0 ? (
        <p>No Order</p>
      ) : (
        orders.map(order => (
          <Card key={order.id} className="order-card">
            <h3>Id: {order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Type: {order.orderType === 'cart' ? 'Buy Now' : 'Cart'}</p>
            <p>Total: ￥{order.totalPrice.toFixed(2)}</p>
            <div className="order-products">
              {order.productList.map((item, index) => {
                const product = getProductDetail(item.productId);
                if (!product) return null;
                return (
                  <div key={index} className="product-item">
                    <Image src={process.env.NEXT_PUBLIC_NGINX_URL + product.image} alt={product.name} width="150" height="150" />
                    <div className="product-info">
                      <p>Name: {product.name}</p>
                      <p>Quality: {item.quantity}</p>
                      <p>Price: ￥{product.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button label='Pay Now' onClick={() => handlePayNow(order.id)} />
          </Card>
        ))
      )}
      {/* ✅ 支付成功弹窗 */}
      <Dialog
        header="支付成功"
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
        footer={
          <Button label="查看物流信息" icon="pi pi-check" onClick={onConfirm} autoFocus />
        }
      >
        <p>您已成功完成支付！请点击下方按钮查看订单物流详情。</p>
      </Dialog>
    </div>
  );
}
