import { AxiosResponse, AxiosError } from "axios";

export type User = {
  id: string;
  full_name: string;
  businessName: string;
  businessAddress: string;
  industry: string;
  businessType: string;
  businessEmail: string;
  businessCAC: string;
  numberOfEmployees: string;
  country: string;
  zipCode: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  jobTitle: string;
  role: string;
  is_active: boolean;
  authority?: string[];
};

export type Api<T> = {
  status: boolean;
  message: string | Record<string, string[]>;
  data: T;
};

export type ApiList<T> = {
  count: number;
  next: null;
  previous: null;
  results: T;
};

export type ApiResponse<T = unknown> = AxiosResponse<Api<T>>;
export type ApiListResponse<T = unknown> = AxiosResponse<ApiList<Api<T>>>;
export type ApiResponseError = AxiosError<Api<{}>>;

export type ProductData = {
  product_name: string;
  product_category: string;
  available: number;
  product_id: string;
  shelf_life: number;
  price: string;
  product_image: string;
};

export interface CustomerResponseData {
  id: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  payment_method: string;
  payment_method_display: string;
  payment_source: string;
  payment_source_display: string;
  business: null;
  status: string;
  status_display: string;
  subtotal: string;
  tax: string;
  total: string;
  notes: string;
  order_date: string;
  created_at: Date;
  updated_at: Date;
  items: Order[];
}

export interface Order {
  id: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  payment_method: string;
  payment_method_display: string;
  payment_source: string;
  payment_source_display: string;
  business: null;
  status: string;
  status_display: string;
  subtotal: string;
  tax: string;
  total: string;
  notes: string;
  order_date: string;
  created_at: Date;
  updated_at: Date;
  items: Item[];
}

export interface Item {
  id: string;
  product: string;
  product_name: string;
  product_category: string;
  quantity: number;
  price: string;
  subtotal: string;
}
