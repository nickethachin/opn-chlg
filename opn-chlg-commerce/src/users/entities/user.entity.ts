export class User {
  _id?: number;
  email: string;
  password: string;
  name: string;
  birthdate: Date;
  gender: string;
  address: string;
  is_subscribe: boolean;
  role?: string = 'user';
}
