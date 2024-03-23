import { Length } from "class-validator";

export class AddressInput {
  id: number;

  @Length(3, 32, {
    message: "Address line must be between 3 and 32 characters.",
  })
  addressLine1: string;
  addressLine2: string;

  @Length(3, 12, { message: "City must be between 3 and 12 characters." })
  city: string;

  @Length(4, 6, { message: "Post code must be between 4 and 6 characters." })
  postCode: string;

  @Length(2, 3, { message: "Country must be between 2 and 3 characters." })
  country: string;
}

export class ProfileInput {
  @Length(3, 32, { message: "First name must be between 3 and 32 characters." })
  firstName: string;

  @Length(3, 32, { message: "Last name must be between 3 and 32 characters." })
  lastName: string;

  @Length(5, 6, { message: "User type must be between 5 and 6 characters." })
  userType: string;

  address: AddressInput;
}
