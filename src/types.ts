import { AxiosResponse, AxiosError } from "axios";

export type User = {
  id: string;
  first_name: string,
  last_name: string,
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
};

export type ApiError = {
  status: boolean;
  message: string;
};

export type ApiResponse<T = unknown> = AxiosResponse<T>;
export type ApiResponseError = AxiosError<ApiError>;
