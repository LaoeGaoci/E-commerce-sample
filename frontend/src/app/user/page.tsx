'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  User, Truck, ShoppingBag, MessageSquare, MapPin, ChevronRight, X
} from 'react-feather';
import Image from 'next/image';

const MyPage: React.FC = () => {
  const [isMessageSidebarOpen, setIsMessageSidebarOpen] = useState(false);
  const [isAddressSidebarOpen, setIsAddressSidebarOpen] = useState(false);

  const [editingAddress, setEditingAddress] = useState<typeof addresses[0] | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // 地址
  const [formValues, setFormValues] = useState({
    
    name: '',
    phone: '',
    address: '',
    isDefault: false,
  });
  // interface Address {
  //   id: number | string;
  //   name: string;
  //   phone: string;
  //   address: string;
  //   isDefault: boolean;
  // }

  const recommendedProducts = [
    { 
      id: '101', name: '时尚运动鞋', price: 299,
      imageUrl: 'http://localhost:65/R.jpg'
    },
    { 
      id: '102', name: '无线蓝牙耳机', price: 399,
      imageUrl: 'https://picsum.photos/id/102/200' 
    },
    { 
      id: '103', name: '智能手表', price: 899,
      imageUrl: 'https://picsum.photos/id/103/200' 
    },
    { 
      id: '104', name: '简约背包', price: 199,
      imageUrl: 'https://picsum.photos/id/104/200' 
    },
  ];

  const messages = [
    { id: 1, title: '订单发货通知', content: '您的订单已发货，预计明天送达', time: '10:30' },
    { id: 2, title: '优惠活动', content: '新用户专享优惠券已到账', time: '昨天' },
    { id: 3, title: '系统通知', content: '系统维护通知：今晚23:00-24:00', time: '2023-08-15' },
  ];

  const [addresses, setAddresses] = useState([
    { id: 1, name: '张三', phone: '138****1234', address: '北京市朝阳区建国路88号', isDefault: true },
    { id: 2, name: '张三', phone: '138****5678', address: '上海市浦东新区张江高科技园区', isDefault: false },
  ]);
  
  const saveAddress = () => {
    if (editingAddress) {
      // 编辑已有地址
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id ? { ...addr, ...formValues } : addr
      );
      setAddresses(updatedAddresses);
    } else {
      // 新增地址
      const newAddress = {
        id: Date.now(), // 使用 number 类型更合适作为 id
        ...formValues,
      };
      setAddresses([...addresses, newAddress]);
    }
    closeForm();
  };
  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };
  const openAddForm = () => {
    setEditingAddress(null);
    setFormValues({ name: '', phone: '', address: '', isDefault: false });
    setIsFormOpen(true);
  };
  
  const openEditForm = (address: typeof addresses[0]) => {
    setEditingAddress(address);
    setFormValues({ ...address });
    setIsFormOpen(true);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 space-y-2">


      {/* 用户信息区域 */}
      <div className="p-6 bg-white shadow-md container mx-auto rounded-lg">
        <div className="flex items-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-3 border-2 border-white shadow-md">
              <User size={28} className="text-gray-600" />
            </div>
            <div className="absolute bottom-0 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Freedom</h2>
            <p className="text-sm text-gray-600">ID: 123456789</p>
          </div>
        </div>


      {/* 我的订单区域 */}   
        <div className="flex justify-between items-center mb-4 mt-10">
          <h3 className="font-bold text-lg text-gray-800">我的订单</h3>
          <Link href="/order" className="text-gray-600 text-sm flex items-center hover:text-blue-500 transition-colors">
            查看全部 <ChevronRight size={16} className="text-gray-600" />
          </Link>
        </div>
        <div className="flex justify-around">
          <Link href="/order?status=shipping" className="...">
            <Truck size={28} className="text-gray-600 mb-1" />
            <span className="text-gray-600 text-sm">待发货</span>
          </Link>

          <Link href="/order?status=delivering" className="...">
            <ShoppingBag size={28} className="text-gray-600 mb-1" />
            <span className="text-gray-600 text-sm">待收货</span>
          </Link>
        </div>


      {/* 其他服务区域 */}
      <div className="flex justify-between items-center mb-4 mt-8"></div>
        <h3 className="font-bold mb-4 text-lg text-gray-800">其他服务</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div onClick={() => setIsAddressSidebarOpen(true)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 shadow-sm">
              <MapPin size={20} className="text-gray-600" />
            </div>
            <span className="text-gray-600 text-xs">收货地址</span>
          </div>

          <div onClick={() => setIsMessageSidebarOpen(true)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 shadow-sm">
              <MessageSquare size={20} className="text-gray-600" />
            </div>
            <span className="text-gray-600 text-xs">我的消息</span>
          </div>
        </div>


      {/* 为你挑选区域 */}

        <div className="text-center my-6">
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gray-300"></div>
            <span className="relative z-10 px-4 bg-white text-gray-500 text-sm">—— 为你挑选 ——</span>
            <div className="absolute top-1/2 right-0 w-1/3 h-px bg-gray-300"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recommendedProducts.map((product) => (
            <Link key={product.id} href={`/commodity/${product.id}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all">
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">热卖</div>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h4>
                <p className="text-gray-800 font-bold mt-1">¥{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 消息侧边栏 */}
      {isMessageSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
          <div className="w-4/5 sm:w-96 bg-white h-[93vh] p-4 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">收货地址</h2>
              <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setIsMessageSidebarOpen(false)}>
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800">{message.title}</h3>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{message.content}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 地址侧边栏 */}
      {isAddressSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
          <div className="w-4/5 sm:w-96 bg-white h-[93vh] p-4 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">收货地址</h2>
              <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setIsAddressSidebarOpen(false)}>
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              {addresses.map(address => (
                <div key={address.id} className={`p-3 border rounded-lg cursor-pointer transition-all ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{address.name}</span>
                      <span className="ml-2 text-gray-600">{address.phone}</span>
                    </div>
                    {address.isDefault && <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">默认</span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{address.address}</p>
                  <div className="flex justify-end mt-2">
                  <button className="text-blue-500 text-sm mr-3" onClick={() => openEditForm(address)}>
                    编辑
                  </button>
                    <button className="text-gray-500 text-sm" onClick={() => deleteAddress(address.id)}>删除</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full py-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors" onClick={openAddForm}>
              添加新地址
            </button>
            </div>
          </div>
        </div>
      )}
      {isFormOpen && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-xl font-bold mb-4">{editingAddress ? '编辑地址' : '添加地址'}</h2>

          <input
            type="text"
            placeholder="姓名"
            value={formValues.name}
            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="电话"
            value={formValues.phone}
            onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="地址"
            value={formValues.address}
            onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={formValues.isDefault}
              onChange={(e) => setFormValues({ ...formValues, isDefault: e.target.checked })}
              className="mr-2"
            />
            <span>设为默认地址</span>
          </label>

          <div className="flex justify-end space-x-2">
            <button onClick={closeForm} className="px-4 py-2 bg-gray-300 rounded">取消</button>
            <button onClick={saveAddress} className="px-4 py-2 bg-blue-500 text-white rounded">保存</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default MyPage;