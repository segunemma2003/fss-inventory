import { AxiosResponse, AxiosError } from "axios";

export type User = {
  id: string;
  full_name: string,
  businessName: string,
  businessAddress: string,
  industry: string,
  businessType: string,
  businessEmail: string,
  businessCAC: string,
  numberOfEmployees: string,
  country: string,
  zipCode: string,
  gender: string,
  email: string,
  dateOfBirth: string,
  phoneNumber: string,
  jobTitle: string,
  role: string,
  is_active: boolean
};

export type Api<T> = {
  status: boolean;
  message: string;
  data: T
};

export type ApiResponse<T = unknown> = AxiosResponse<Api<T>>;
export type ApiResponseError = AxiosError<Api<{}>>;


export type ProductData = {
  product_name: string;
  product_category: string;
  available: number;
  product_id: string;
  shelf_life: number;
  price: string;
  product_image: string;
}