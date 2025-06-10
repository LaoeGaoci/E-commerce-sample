'use client';

import { useParams } from 'next/navigation';
import { loadFromStorage } from '../../data/localStorageUtil';
import { Order } from '../../data/orders';
import { Product } from '../../data/products';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import './OrderDetail.scss';
import { useRouter } from 'next/navigation';
export default function OrderDetailPage() {
  const { id } = useParams();
  const order = (loadFromStorage<Order[]>('orders') ?? []).find(o => o.id === id);
  const products = loadFromStorage<Product[]>('products') ?? [];
const router = useRouter();
  if (!order) return <p style={{ padding: '2rem' }}>订单不存在</p>;

  const stepItems = [
    { label: '订单已提交' },
    { label: '仓库打包' },
    { label: '已发货' },
    { label: '运输中' },
    { label: '已送达' }
  ];

  // 模拟状态：映射到当前物流步骤索引
  const statusStepMap: Record<string, number> = {
    '待发货': 1, // 仓库打包
    '待收货': 3, // 运输中
  };

  const activeIndex = statusStepMap[order.status] ?? 0;

  return (
    <div className="order-detail-container">
      <h2 className="order-title">订单详情</h2>
      <div className="order-status">状态：{order.status}</div>

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
                  <p>单价：¥{product.price}</p>
                  <p>数量：{item.quantity}</p>
                  <p>总计：¥{(product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="order-total">
        <h3>订单总价：¥{order.totalPrice.toFixed(2)}</h3>
        <Button label="返回我的订单" icon="pi pi-arrow-left" className="mt-3" onClick={() => router.push(`/user`)} />
      </div>
    </div>
  );
};
