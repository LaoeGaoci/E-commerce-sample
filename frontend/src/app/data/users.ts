export interface User {
  id: string;
  name: string;
  password: string;
  addressIds: string[];
  messageIds: string[];
}

export const initialUsers: User[] = [
  {
    id: "1",
    name: "LaoeGaoci",
    password: "123456",
    addressIds: ["1"],
    messageIds: ["1"],
  },
  {
    id: "admin",
    name: "admin",
    password: "123",
    addressIds: [""],
    messageIds: [""],
  },
];
