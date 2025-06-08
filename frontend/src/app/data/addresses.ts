export interface Address {
  id: string;
  userId: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
}

export const initialAddresses: Address[] = [
  {
    id: '1',
    userId: '1',
    receiverName: 'Seamher',
    receiverPhone: '13812345678',
    receiverAddress: '北京市朝阳区CBD',
  },
];
