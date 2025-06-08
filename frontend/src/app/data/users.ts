export interface User {
  id: string;
  name: string;
  addressIds: string[];
}

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'LaoeGaoci',
    addressIds: ['1'],
  },
];
