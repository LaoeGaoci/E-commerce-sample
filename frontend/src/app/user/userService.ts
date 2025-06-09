import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import { Address } from '../data/addresses';
import { User } from '../data/users';
import { Message } from '../data/messages';

import { v4 as uuidv4 } from 'uuid';

// 实现用户新增收货地址的逻辑，同步数据
export const addAddress = (
  userId: string,
  receiverName: string,
  receiverPhone: string,
  receiverAddress: string
) => {
  const addresses = loadFromStorage<Address[]>('addresses') || [];
  const users = loadFromStorage<User[]>('users') || [];

  const newId = uuidv4();
  const newAddress: Address = {
    id: newId,
    userId,
    receiverName,
    receiverPhone,
    receiverAddress,
  };

  addresses.push(newAddress);

  const user = users.find(u => u.id === userId);
  if (user) {
    user.addressIds.push(newId);
  }

  saveToStorage('addresses', addresses);
  saveToStorage('users', users);
};

// 实现用户修改收货地址的逻辑，同步数据
export const updateAddress = (
  addressId: string,
  updatedFields: Partial<Omit<Address, 'id' | 'userId'>>
) => {
  const addresses = loadFromStorage<Address[]>('addresses') || [];

  const address = addresses.find(a => a.id === addressId);
  if (!address) return;

  Object.assign(address, updatedFields);

  saveToStorage('addresses', addresses);
};

// 实现用户删除收货地址的逻辑，同步数据
export const deleteAddress = (userId: string, addressId: string) => {
  let addresses = loadFromStorage<Address[]>('addresses') || [];
  const users = loadFromStorage<User[]>('users') || [];

  addresses = addresses.filter(a => a.id !== addressId);

  const user = users.find(u => u.id === userId);
  if (user) {
    user.addressIds = user.addressIds.filter(id => id !== addressId);
  }

  saveToStorage('addresses', addresses);
  saveToStorage('users', users);
};

// 删除某条消息（根据 messageId）
export const deleteMessage = (messageId: string): void => {
  const messages = loadFromStorage<Message[]>('messages') || [];
  const updatedMessages = messages.filter(msg => msg.id !== messageId);
  saveToStorage('messages', updatedMessages);
};

// 获取某用户的已读消息
export const getReadMessages = (userId: string): Message[] => {
  const messages = loadFromStorage<Message[]>('messages') || [];
  return messages.filter(msg => msg.userId === userId && msg.isRead);
};

// 获取某用户的未读消息
export const getUnreadMessages = (userId: string): Message[] => {
  const messages = loadFromStorage<Message[]>('messages') || [];
  return messages.filter(msg => msg.userId === userId && !msg.isRead);
};

// 获取指定用户的所有消息
export const getMessagesByUser = (userId: string): Message[] => {
  const all = loadFromStorage<Message[]>('messages') || [];
  return all.filter(m => m.userId === userId);
};

// 标记某条消息为已读
export const markMessageAsRead = (messageId: string): void => {
  const messages = loadFromStorage<Message[]>('messages') || [];
  const target = messages.find(m => m.id === messageId);
  if (target && !target.isRead) {
    target.isRead = true;
    saveToStorage('messages', messages);
  }
};


// 用户注册
export const registerUser = (username: string, password: string): User => {
  const users = loadFromStorage<User[]>('users') || [];
  
  if (users.some(u => u.name === username)) {
    throw new Error('用户名已存在');
  }

  const newUser: User = {
    id: uuidv4(),
    name: username,
    password, // 明文
    addressIds: [],
    messageIds: []
  };

  users.push(newUser);
  saveToStorage('users', users);
  return newUser;
};

// 用户登录验证
export const loginUser = (username: string, password: string): User | null => {
  const users = loadFromStorage<User[]>('users') || [];
  return users.find(u => u.name === username && u.password === password) || null;
};