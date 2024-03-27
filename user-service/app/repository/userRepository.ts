import { AddressModel } from "../models/addressModel";
import { ProfileInput } from "../models/dto/AddressInput";
import { UserModel } from "../models/userModel";
import { DBOperation } from "./dbOperation";

export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async createAccount({ email, password, salt, phone, user_type }: UserModel) {
    const queryString =
      "INSERT INTO users(email, password, salt, phone, user_type) VALUES($1, $2, $3, $4, $5) RETURNING verified, email, phone, user_type";
    const values = [email, password, salt, phone, user_type];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("Failed to create user account");
  }

  async findAccount(email: string) {
    const queryString =
      "SELECT user_id, email, password, phone, salt, verification_code, expiry FROM users WHERE email = $1";
    const values = [email];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount < 1) {
      throw new Error("User does not exist with provided email id");
    }

    return result.rows[0] as UserModel;
  }

  async updateVerificationCode(userId: number, code: number, expiry: Date) {
    const queryString =
      "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING verified, email, phone, user_type";
    const values = [code, expiry, userId];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error(
      "Creates a new user profile in the database.User already verified or does not exist"
    );
  }

  async updateVerifyUser(userId: number) {
    const queryString =
      "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING verified, email, phone, user_type";
    const values = [userId];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("User already verified or does not exist");
  }

  async updateUser(
    userId: number,
    firstName: string,
    lastName: string,
    userType: string
  ) {
    const queryString =
      "UPDATE users SET first_name=$1, last_name=$2, user_type=$3 WHERE user_id=$4 RETURNING verified, email, phone, user_type";
    const values = [firstName, lastName, userType, userId];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("Failed to update user");
  }

  async createProfile(
    userId: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, postCode, country },
    }: ProfileInput
  ) {
    await this.updateUser(userId, firstName, lastName, userType);

    const queryString =
      "INSERT INTO address(user_id, address_line1, address_line2, city, post_code, country) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";

    const values = [
      userId,
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
    ];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as AddressModel;
    }

    throw new Error("Failed to create profile");
  }

  async getUserProfile(userId: number) {
    const profileQuery =
      "SELECT first_name, last_name, email, phone, user_type, verified FROM users WHERE user_id = $1";
    const profileValues = [userId];
    const profileResult = await this.executeQuery(profileQuery, profileValues);

    if (profileResult.rowCount < 1) {
      throw new Error("User profile does not exist");
    }

    const userProfile = profileResult.rows[0] as UserModel;

    const addressQuery =
      "SELECT id, address_line1, address_line2, city, post_code, country FROM address WHERE user_id=$1";
    const addressValues = [userId];
    const addressResult = await this.executeQuery(addressQuery, addressValues);

    if (addressResult.rowCount > 0) {
      userProfile.address = addressResult.rows as AddressModel[];
    } else {
      userProfile.address = [];
    }

    return userProfile;
  }

  async editProfile(
    user_id: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, postCode, country, id },
    }: ProfileInput
  ) {
    await this.updateUser(user_id, firstName, lastName, userType);

    const addressQuery =
      "UPDATE address SET address_line1=$1, address_line2=$2, city=$3, post_code=$4, country=$5 WHERE id=$6";

    const addressValues = [
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
      id,
    ];

    const addressResult = await this.executeQuery(addressQuery, addressValues);

    if (addressResult.rowCount < 1) {
      throw new Error("error while updating profile!");
    }
    return true;
  }
}
