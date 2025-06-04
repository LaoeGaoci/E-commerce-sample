import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Order } from '@/types/order';

interface OrderPreviewProps {
  order: Order;
  onPay?: () => void;
}

const OrderPreview: React.FC<OrderPreviewProps> = ({ order, onPay }) => {
  return (
    <Panel header="当前订单" toggleable collapsed className="mt-8 shadow-sm">
      <div className="p-4">
        <div className="mb-4">
          <div className="font-medium">{order.shippingAddress.recipient} {order.shippingAddress.phone}</div>
          <div className="text-gray-600 text-sm">
            {order.shippingAddress.province} {order.shippingAddress.city} 
            {order.shippingAddress.district} {order.shippingAddress.street}
          </div>
        </div>
        
        <Divider />
        
        <div className="my-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between py-2">
              <div>
                <div className="font-medium">{item.product.name}</div>
                <div className="text-gray-600 text-sm">x{item.quantity}</div>
              </div>
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        
        <Divider />
        
        <div className="mt-4">
          <div className="flex justify-between py-1">
            <span>小计</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>运费</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between py-1 font-bold mt-2">
            <span>总计</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          label="立即支付" 
          className="w-full mt-4 bg-blue-600 border-blue-600 hover:bg-blue-700" 
          onClick={onPay}
        />
      </div>
    </Panel>
  );
};

export default OrderPreview;