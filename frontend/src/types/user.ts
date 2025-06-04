import { ShippingAddress } from './order';

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  inviteCode: string;
  addresses: ShippingAddress[];
  createdAt: Date;
  updatedAt: Date;
}