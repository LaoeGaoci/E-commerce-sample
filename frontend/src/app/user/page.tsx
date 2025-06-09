// MyPage.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';

import { Address } from '../data/addresses';
import { Product } from '../data/products';
import { Order } from '../data/orders';
import './user.scss';
import { loadFromStorage } from '../data/localStorageUtil';
import { addAddress, updateAddress, deleteAddress as deleteAddressService } from './userService';
import { Message } from '../data/messages';
import { getMessagesByUser, markMessageAsRead, deleteMessage } from './userService';
import { TabView, TabPanel } from 'primereact/tabview';


const MyPage: React.FC = () => {
  const userId = '1';
  const [isMessageSidebarOpen, setIsMessageSidebarOpen] = useState(false);
  const [isAddressSidebarOpen, setIsAddressSidebarOpen] = useState(false);
  const [isOrderSidebarOpen, setIsOrderSidebarOpen] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'待发货' | '待收货' | null>(null);

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formValues, setFormValues] = useState({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    return (loadFromStorage<Address[]>('addresses') ?? []).filter(addr => addr.userId.toString() === userId);
  });

  const [orders] = useState<Order[]>(() => {
    return (loadFromStorage<Order[]>('orders') ?? []).filter(order => order.userId.toString() === userId);
  });

  const [recommendedProducts] = useState<Product[]>(() => {
    return (loadFromStorage<Product[]>('products') ?? []).filter(p => p.isHot).slice(0, 6);
  });

  // 消息定义
  const [messages, setMessages] = useState<Message[]>(() => getMessagesByUser(userId));

  const readMessages = messages.filter(msg => msg.isRead);
  const unreadMessages = messages.filter(msg => !msg.isRead);

  // 信息标记为已读
  const handleMarkAsRead = (id: string) => {
    markMessageAsRead(id);
    setMessages(getMessagesByUser(userId));
  };

  // 信息删除
  const handleDeleteMessage = (id: string) => {
    deleteMessage(id);
    setMessages(getMessagesByUser(userId));
  };

  const saveAddress = () => {
    let updatedAddresses;
    if (editingAddress) {
      updateAddress(editingAddress.id, formValues);
      updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id ? { ...addr, ...formValues } : addr
      );
    } else {
      addAddress(userId, formValues.receiverName, formValues.receiverPhone, formValues.receiverAddress);
      updatedAddresses = [...addresses, {
        id: Date.now().toString(),
        userId,
        ...formValues,
      }];
    }
    setAddresses(updatedAddresses);
    closeForm();
  };

  const deleteAddress = (id: string) => {
    deleteAddressService(userId, id);
    const filtered = addresses.filter(addr => addr.id !== id);
    setAddresses(filtered);
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setFormValues({ receiverName: '', receiverPhone: '', receiverAddress: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (address: Address) => {
    setEditingAddress(address);
    setFormValues({
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      receiverAddress: address.receiverAddress,
    });
    setIsFormOpen(true);
  };

  const openOrderSidebar = (status: '待发货' | '待收货') => {
    setOrderStatusFilter(status);
    setIsOrderSidebarOpen(true);
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const closeForm = () => setIsFormOpen(false);

  return (
    <div className="mypage-container">
      <Card className="mypage-card">
        <div className="mypage-user-info">
          <Avatar icon="pi pi-user" shape="circle" size="xlarge" style={{ marginRight: '1rem' }} />
          <div>
            <h2>Freedom</h2>
          </div>
        </div>

        <div className="mypage-order-header">
          <h3>我的订单</h3>
        </div>

        <div className="mypage-order-links">
          <Button icon="pi pi-inbox" label="待发货" onClick={() => openOrderSidebar('待发货')} text />
          <Button icon="pi pi-truck" label="待收货" onClick={() => openOrderSidebar('待收货')} text />
        </div>

        <h3 className="mypage-section-title">其他服务</h3>
        <div className="mypage-service-options">
          <Button icon="pi pi-map-marker" label="收货地址" onClick={() => setIsAddressSidebarOpen(true)} text />
          <Button icon="pi pi-comment" label="我的消息" onClick={() => setIsMessageSidebarOpen(true)} text />
        </div>

      {/* ✅ 猜你喜欢 */}
      <section className="section">
        <h2>You May Also Like</h2>
        <div className="product-grid">
          {recommendedProducts.map((item) => (
            <Link href={`/commodity/${item.id}`} key={item.id} className="product-card">
              <div className="product-img">
                <img src={`http://localhost:65/${item.image}`} alt={item.name} />
              </div>
              <div className="product-title">{item.name}</div>
              <div className="product-price">${item.price}</div>
            </Link>
          ))}
        </div>
      </section>
      </Card>

      {/* 地址侧边栏 */}
      <Sidebar visible={isAddressSidebarOpen} position="right" onHide={() => setIsAddressSidebarOpen(false)} className="mypage-sidebar">
        <h3>我的地址</h3>
        {addresses.map(addr => (
          <div key={addr.id} className="mypage-address-item">
            <div>{addr.receiverName} - {addr.receiverPhone}</div>
            <div>{addr.receiverAddress}</div>
            <div className="mypage-address-actions">
              <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => openEditForm(addr)} />
              <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => deleteAddress(addr.id)} />
            </div>
          </div>
        ))}
        <Button label="添加新地址" icon="pi pi-plus" onClick={openAddForm} className="p-button-sm mt-3" />
      </Sidebar>

      <Sidebar visible={isMessageSidebarOpen} position="right" onHide={() => setIsMessageSidebarOpen(false)} className="mypage-sidebar">
        <h3>我的消息</h3>

        <TabView>
          <TabPanel header="📬 未读消息">
            {unreadMessages.length === 0 ? <p style={{ fontSize: '14px' }}>暂无未读消息</p> : null}
            {unreadMessages.map(msg => (
              <div key={msg.id} className="mypage-message-item">
                <div>
                  <strong>{msg.title}</strong>
                  <span style={{ float: 'right', fontSize: '12px' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div>{msg.content}</div>
                <div className="mypage-message-actions">
                  <Button label="标为已读" size="small" onClick={() => handleMarkAsRead(msg.id)} text />
                  <Button label="删除" icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDeleteMessage(msg.id)} text />
                </div>
              </div>
            ))}
          </TabPanel>

          <TabPanel header="✅ 已读消息">
            {readMessages.length === 0 ? <p style={{ fontSize: '14px' }}>暂无已读消息</p> : null}
            {readMessages.map(msg => (
              <div key={msg.id} className="mypage-message-item mypage-message-read">
                <div>
                  <strong>{msg.title}</strong>
                  <span style={{ float: 'right', fontSize: '12px' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div>{msg.content}</div>
                <div className="mypage-message-actions">
                  <Button label="删除" icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDeleteMessage(msg.id)} text />
                </div>
              </div>
            ))}
          </TabPanel>
        </TabView>
      </Sidebar>


      {/* 订单侧边栏 */}
      <Sidebar visible={isOrderSidebarOpen} position="right" onHide={() => setIsOrderSidebarOpen(false)} className="mypage-sidebar">
        <h3>{orderStatusFilter}</h3>
        {orders.filter(o => o.status === orderStatusFilter).map(order => (
          <div key={order.id} className="mypage-order-item">
            <div>订单号：{order.id}</div>
            <div>商品数：{order.productList.length}</div>
            <div>总价：¥{order.totalPrice}</div>
          </div>
        ))}
      </Sidebar>

      <Dialog header={editingAddress ? '编辑地址' : '添加地址'} visible={isFormOpen} style={{ width: '400px' }} onHide={closeForm} modal>
        <div className="mypage-form">
          <span className="p-float-label">
            <InputText id="name" value={formValues.receiverName} onChange={e => setFormValues({ ...formValues, receiverName: e.target.value })} />
            <label htmlFor="name">姓名</label>
          </span>
          <span className="p-float-label">
            <InputText id="phone" value={formValues.receiverPhone} onChange={e => setFormValues({ ...formValues, receiverPhone: e.target.value })} />
            <label htmlFor="phone">电话</label>
          </span>
          <span className="p-float-label">
            <InputText id="address" value={formValues.receiverAddress} onChange={e => setFormValues({ ...formValues, receiverAddress: e.target.value })} />
            <label htmlFor="address">地址</label>
          </span>
          <div className="mypage-form-buttons">
            <Button label="取消" severity="secondary" onClick={closeForm} />
            <Button label="保存" onClick={saveAddress} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MyPage;
