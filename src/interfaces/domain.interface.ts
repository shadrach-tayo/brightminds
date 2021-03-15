import { TransactionStatus } from './domain.enum';

export interface BaseDomain {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface Admin extends BaseDomain {
  email?: string;
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
  username: string;
  address?: Record<string, any>;
}

export interface Address extends BaseDomain {
  city?: string;
  state: string;
  lga: string;
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
  start_date: string;
  end_date: string;
  event_time: string;
  banner?: string;
  location: string;
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
  event?: Event;
  eventId?: string;
  userId?: string;
  user?: User;
}

export interface Plan extends BaseDomain {
  price: string;
  description?: string;
  plan_name: string;
  is_active: boolean;
  valid_from?: string;
  valid_to?: string;
}

export interface Subscription extends BaseDomain {
  amount: string;
  userId?: string;
  status?: number;
  valid_to?: string;
  valid_from?: string;
  transaction_ref?: string;
  planId?: string;
  date_subscribed?: string;
  date_unsubscribed?: string;
}

export interface Invoice extends BaseDomain {
  description?: string;
  userId?: string;
  amount: string;
  transaction_ref: string;
  subscriptionId?: string;
  planId?: string;
  date_paid: string;
}
