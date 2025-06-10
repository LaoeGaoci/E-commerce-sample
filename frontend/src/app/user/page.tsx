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
import { useRouter } from 'next/navigation';

import { Image } from 'primereact/image';

const MyPage: React.FC = () => {

  const router = useRouter();

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null;
  const userId = currentUser?.id || '';
  const userName = currentUser?.name || 'Guest';

  const [isMessageSidebarOpen, setIsMessageSidebarOpen] = useState(false);
  const [isAddressSidebarOpen, setIsAddressSidebarOpen] = useState(false);
  const [isOrderSidebarOpen, setIsOrderSidebarOpen] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'Shipment' | 'Receipt' | null>(null);

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formValues, setFormValues] = useState({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    return (loadFromStorage<Address[]>('addresses') ?? []).filter(addr => addr.userId === userId);
  });

  const [orders] = useState<Order[]>(() => {
    return (loadFromStorage<Order[]>('orders') ?? []).filter(order => order.userId === userId);
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

  const openOrderSidebar = (status: 'Receipt' | 'Shipment') => {
    console.log(orders);
    setOrderStatusFilter(status);
    setIsOrderSidebarOpen(true);
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const closeForm = () => setIsFormOpen(false);

  return (
    <div className="mypage-container">
      <Card className="mypage-card">
        <div className="mypage-user-info">
          <Avatar icon="pi pi-user" image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" size="xlarge" style={{ marginRight: '1rem' }} />
          <h2>{userName}</h2>
          <Button
            icon="pi pi-sign-out"
            label="logout"
            onClick={() => {
              localStorage.removeItem('currentUser');
              router.push('/user/login'); // 改为跳转到登录页
            }}
            severity="warning"
            text
          />
        </div>

        <div className="mypage-order-header">
          <h3>My Order</h3>
        </div>

        <div className="mypage-order-links">
          <Button icon="pi pi-inbox" label="Shipment" onClick={() => openOrderSidebar('Shipment')} text />
          <Button icon="pi pi-truck" label="Receipt" onClick={() => openOrderSidebar('Receipt')} text />
        </div>

        <h3 className="mypage-section-title">More</h3>
        <div className="mypage-service-options">
          <Button icon="pi pi-map-marker" label="Address" onClick={() => setIsAddressSidebarOpen(true)} text />
          <Button icon="pi pi-comment" label="Messages" onClick={() => setIsMessageSidebarOpen(true)} text />
        </div>

        {/* ✅ 猜你喜欢 */}
        <section className="section">
          <h2 className='You-may-also-like-title'>You May Also Like</h2>
          <div className="product-grid">
            {recommendedProducts.map((item) => (
              <div
                key={item.id}
                className="product-card"
                onClick={() => router.push(`/commodity/${item.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-img">
                  <Image
                    src={process.env.NEXT_PUBLIC_NGINX_URL + item.image}
                    alt={item.name}
                    width="100%"
                    preview // 支持点击放大预览
                  />
                </div>
                <div className="product-title">{item.name}</div>
                <div className="product-price">${item.price}</div>
              </div>
            ))}
          </div>
        </section>
      </Card>

      {/* 地址侧边栏 */}
      <Sidebar visible={isAddressSidebarOpen} position="right" onHide={() => setIsAddressSidebarOpen(false)} className="mypage-sidebar">
        <h3>Address</h3>
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
        <Button label="Add a New Address" icon="pi pi-plus" onClick={openAddForm} className="p-button-sm mt-3" />
      </Sidebar>

      <Sidebar visible={isMessageSidebarOpen} position="right" onHide={() => setIsMessageSidebarOpen(false)} className="mypage-sidebar">
        <h3>Messages</h3>

        <TabView>
          <TabPanel header="Unread">
            {unreadMessages.length === 0 ? <p style={{ fontSize: '14px' }}>	No unread messages</p> : null}
            {unreadMessages.map(msg => (
              <div key={msg.id} className="mypage-message-item">
                <div>
                  <strong>{msg.title}</strong>
                  <span style={{ float: 'right', fontSize: '12px' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div>{msg.content}</div>
                <div className="mypage-message-actions">
                  <Button label="Read" size="small" onClick={() => handleMarkAsRead(msg.id)} text />
                  <Button label="Delete" icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDeleteMessage(msg.id)} text />
                </div>
              </div>
            ))}
          </TabPanel>

          <TabPanel header="Read">
            {readMessages.length === 0 ? <p style={{ fontSize: '14px' }}>No read messages</p> : null}
            {readMessages.map(msg => (
              <div key={msg.id} className="mypage-message-item mypage-message-read">
                <div>
                  <strong>{msg.title}</strong>
                  <span style={{ float: 'right', fontSize: '12px' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div>{msg.content}</div>
                <div className="mypage-message-actions">
                  <Button label="Delete" icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDeleteMessage(msg.id)} text />
                </div>
              </div>
            ))}
          </TabPanel>
        </TabView>
      </Sidebar>


      {/* 订单侧边栏 */}
      <Sidebar
        visible={isOrderSidebarOpen}
        position="right"
        onHide={() => setIsOrderSidebarOpen(false)}
        className="mypage-sidebar"
      >
        <h3>{orderStatusFilter}</h3>
        <div className="order-card-list">
          {orders.filter(o => o.status === orderStatusFilter).map(order => (
            <Link href={`/order/${order.id}`} key={order.id} className="order-card-link">
              <Card className="order-card" title={`Order ID: ${order.id}`} subTitle={`Status: ${order.status}`}>
                <p>Quantity: {order.productList.length}</p>
                <p>Total: ¥{order.totalPrice}</p>
                <Button label="logistics" icon="pi pi-angle-right" link />
              </Card>
            </Link>
          ))}
        </div>
      </Sidebar>


      <Dialog header={editingAddress ? 'Edit Address' : 'Add Address'} visible={isFormOpen} style={{ width: '400px' }} onHide={closeForm} modal>
        <div className="mypage-form">
          <span className="p-float-label">
            <InputText id="name" value={formValues.receiverName} onChange={e => setFormValues({ ...formValues, receiverName: e.target.value })} />
            <label htmlFor="name">Name</label>
          </span>
          <span className="p-float-label">
            <InputText id="phone" value={formValues.receiverPhone} onChange={e => setFormValues({ ...formValues, receiverPhone: e.target.value })} />
            <label htmlFor="phone">Phone Number</label>
          </span>
          <span className="p-float-label">
            <InputText id="address" value={formValues.receiverAddress} onChange={e => setFormValues({ ...formValues, receiverAddress: e.target.value })} />
            <label htmlFor="address">Address</label>
          </span>
          <div className="mypage-form-buttons">
            <Button label="Cancel" severity="secondary" onClick={closeForm} />
            <Button label="Save" onClick={saveAddress} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MyPage;
