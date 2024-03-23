import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { UserRepository } from "../repository/userRepository";
import {
  LoginInput,
  SignupInput,
  VerificationInput,
} from "../models/dto/AuthInput";
import { ProfileInput } from "../models/dto/AddressInput";
import { AppValidationError } from "../utils/errors";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword,
  GetToken,
  VerifyToken,
} from "../utils/password";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "../utils/notification";
import { TimeDifference } from "../utils/dateHelper";

@autoInjectable()
export class UserService {
  repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "requested method is not supported");
  }

  // User Creation, Validation & Login
  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignupInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const salt = await GetSalt();
      const hashedPassword = await GetHashedPassword(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        user_type: "BUYER",
        salt: salt,
      });

      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const data = await this.repository.findAccount(input.email);
      console.log(data);

      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );

      if (!verified) {
        throw new Error("Password does not match");
      }

      const token = GetToken(data);

      return SuccessResponse({ token });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const { code, expiry } = GenerateAccessCode();

      // save on DB to confirm verfication
      await this.repository.updateVerificationCode(
        payload.user_id,
        code,
        expiry
      );

      await SendVerificationCode({ code, email: payload.email });

      return SuccessResponse({
        message: "Verification code is sent to your registered email address",
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const input = plainToClass(VerificationInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const { verification_code, expiry } = await this.repository.findAccount(
        payload.email
      );

      // find the user account
      if (verification_code === parseInt(input.code, 10)) {
        // check expiry
        const currentTime = new Date();
        const diff = TimeDifference(expiry, currentTime.toISOString(), "m");
        if (diff > 0) {
          console.log("verified successfully");
          // update on DB
          await this.repository.updateVerifyUser(payload.user_id);
        } else {
          return ErrorResponse(403, "verification code is expired");
        }
      }

      return SuccessResponse({ message: "user verified" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  // User Progile
  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      // DB Operation
      await this.repository.createProfile(payload.user_id, input);
      return SuccessResponse({ message: "profile created!" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const result = await this.repository.getUserProfile(payload.user_id);
      return SuccessResponse(result);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async EditProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      // DB Operation
      await this.repository.editProfile(payload.user_id, input);
      return SuccessResponse({ message: "profile updated!" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  // Cart Section
  async CreateCart(event: APIGatewayProxyEventV2) {
    try {
      return SuccessResponse({ message: "Response from create cart" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    try {
      return SuccessResponse({ message: "Response from get cart" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    try {
      return SuccessResponse({ message: "Response from update cart" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  // Payment Section
  async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
    try {
      return SuccessResponse({
        message: "Response from create payment method",
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetPaymentMethod(event: APIGatewayProxyEventV2) {
    try {
      return SuccessResponse({ message: "Response from get payment method" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async UpdatePaymentMethod(event: APIGatewayProxyEventV2) {
    try {
      return SuccessResponse({
        message: "Response from update payment method",
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }
}
