import { TransactionStatus } from './domain.enum';

export interface BaseDomain {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Admin extends BaseDomain {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role?: string;
  avatar_url?: string;
  phoneNumber: string;
}

export interface User extends Admin {
  dob: string;
  gender: string;
  addressId?: string;
  school: string;
}

export interface Address extends BaseDomain {
  city: string;
  state?: string;
  lga?: string;
  street?: string;
}

export interface Notification extends BaseDomain {
  title: string;
  content: string;
  payload?: any;
}

export interface Charge extends BaseDomain {
  unit_price: number;
  currency: string;
  event_id: string;
}

export interface Event extends BaseDomain {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image_url: string;
  addressId?: string;
  chargeId?: string;
  transactionId?: string;
}

export interface Competition extends BaseDomain {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image_url: string;
  address?: Address;
  charge?: Charge;
  transaction?: Transaction;
}

export interface Transaction extends BaseDomain {
  event?: Event;
  competition?: Competition;
  transaction_ref: string;
  amount_paid: number;
  status: TransactionStatus;
}

export interface Ticket extends BaseDomain {
  event: string;
  quantity: number;
  fee: Charge;
  total_price: number;
  transaction: string;
}
