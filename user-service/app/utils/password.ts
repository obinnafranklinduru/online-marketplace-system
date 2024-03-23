import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";

// Define the application secret used for JWT signing
const APP_SECRET = process.env.APP_SECRET!;

// Function to generate a salt for hashing passwords
export const GetSalt = async () => {
  return await bcrypt.genSalt(10);
};

// Function to hash a password using a given salt
export const GetHashedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

// Function to validate a password against a hashed password using a given salt
export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GetHashedPassword(enteredPassword, salt)) === savedPassword;
};

// Function to generate a JWT token for a user
export const GetToken = ({ user_id, email, phone, user_type }: UserModel) => {
  return jwt.sign(
    {
      user_id,
      email,
      phone,
      user_type,
    },
    APP_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// Function to verify and decode a JWT token
export const VerifyToken = async (
  token: string
): Promise<UserModel | false> => {
  try {
    if (token !== "") {
      // Split token string to get the actual token value
      const payload = await jwt.verify(token.split(" ")[1], APP_SECRET);
      return payload as UserModel; // Return the decoded payload as UserModel
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
