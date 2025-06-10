'use client';

import { useParams } from 'next/navigation';
import { loadFromStorage } from '../../data/localStorageUtil';
import { Order } from '../../data/orders';
import { Product } from '../../data/products';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import './OrderDetail.scss';
import { Address } from '../../data/addresses';

import { useRouter } from 'next/navigation';


export default function OrderDetailPage() {
  const { id } = useParams();
  const order = (loadFromStorage<Order[]>('orders') ?? []).find(o => o.id === id);
  const products = loadFromStorage<Product[]>('products') ?? [];
  const router = useRouter();

  if (!order) return <p style={{ padding: '2rem' }}>No Order</p>;
  const addresses = loadFromStorage<Address[]>('addresses') ?? [];
  const address = addresses.find(
    (a) => a.id === order.addressId && a.userId === order.userId
  );

  const stepItems = [
    { label: 'Submitted' },
    { label: 'Warehouse' },
    { label: 'Shipped' },
    { label: 'Transit' },
    { label: 'Delivered' }
  ];


  // 模拟状态：映射到当前物流步骤索引
  const statusStepMap: Record<string, number> = {
    'Shipment': 1, // 仓库打包
    'Receipt': 3, // 运输中
  };

  const activeIndex = statusStepMap[order.status] ?? 0;

  return (
    <div className="order-detail-container">
      <Header />
      <h2 className="order-title">Order Detial</h2>
      <div className="order-status">Status: {order.status}</div>
      {address && (
        <div className="order-address">
          <h4>Address</h4>
          <p>{address.receiverName}({address.receiverPhone})</p>
          <p>{address.receiverAddress}</p>
        </div>
      )}
      <div className="order-steps">
        <Steps model={stepItems} activeIndex={activeIndex} readOnly />
      </div>

      <div className="order-product-list">
        {order.productList.map((item) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;

          return (
            <Card key={product.id} className="order-product-card">
              <div className="order-product-content">
                <Image
                  src={process.env.NEXT_PUBLIC_NGINX_URL + product.image}
                  alt={product.name}
                  width='100'
                  height='100'
                  className="product-image"
                />
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <p>Price: ¥{product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ¥{(product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="order-total">
        <h3>Total: ¥{order.totalPrice.toFixed(2)}</h3>
        <Button label="返回我的订单" icon="pi pi-arrow-left" className="mt-3" onClick={() => router.push(`/user`)} />
      </div>
      <Footer />
    </div>
  );
};
