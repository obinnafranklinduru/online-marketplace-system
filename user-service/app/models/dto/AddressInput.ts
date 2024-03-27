import { Length, IsOptional, IsString } from "class-validator";

export class AddressInput {
  id: string;

  @Length(3, 32, {
    message: "Address line must be between 3 and 32 characters.",
  })
  @IsString({ message: "Address must be a string." })
  addressLine1: string;

  @IsOptional()
  @Length(3, 32, {
    message: "Address line must be between 3 and 32 characters.",
  })
  @IsString({ message: "Address must be a string." })
  addressLine2: string;

  @Length(3, 12, { message: "City must be between 3 and 12 characters." })
  @IsString({ message: "City must be a string." })
  city: string;

  @Length(4, 6, { message: "Post code must be between 4 and 6 characters." })
  @IsString({ message: "Post Code must be a string." })
  postCode: string;

  @Length(2, 3, { message: "Country must be between 2 and 3 characters." })
  @IsString({ message: "Country must be a string." })
  country: string;
}

export class ProfileInput {
  @Length(3, 32, { message: "First name must be between 3 and 32 characters." })
  @IsString({ message: "First name must be a string." })
  firstName: string;

  @Length(3, 32, { message: "Last name must be between 3 and 32 characters." })
  @IsString({ message: "Last name must be a string." })
  lastName: string;

  @Length(5, 6, { message: "User type must be between 5 and 6 characters." })
  @IsString({ message: "User Type must be a string." })
  userType: string;

  address: AddressInput;
}
