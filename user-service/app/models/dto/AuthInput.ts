import { IsEmail, Length, Matches } from "class-validator";

export class LoginInput {
  @IsEmail({}, { message: "Please provide a valid email address." })
  email: string;

  @Length(6, 32, { message: "Password must be between 6 and 32 characters." })
  password: string;
}

export class SignupInput extends LoginInput {
  @Length(11, 15, { message: "Phone number must be between 11 and 15 digits." })
  phone: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      "Password must contain atleast one letter, one number, and one special character.",
  })
  password: string;
}

export class VerificationInput {
  @Length(6)
  code: string;
}
