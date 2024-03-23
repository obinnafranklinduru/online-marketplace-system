import { AddressModel } from "./addressModel";

export interface UserModel {
  user_id?: number;
  email: string;
  password: string;
  salt: string;
  phone: string;
  user_type: "BUYER" | "SELLER";
  first_name?: string;
  last_name?: string;
  profile_pic?: string;
  verification_code?: number;
  expiry?: string;
  address?: AddressModel[];
}
