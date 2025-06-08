import { loadFromStorage, saveToStorage } from '../data/localStorageUtil';
import { Address } from '../data/addresses';
import { User } from '../data/users';
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
