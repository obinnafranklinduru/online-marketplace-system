import { Length } from "class-validator";

export class ServiceInput {
  action: string;

  @Length(12, 24, {
    message: "ProductId must be between 12 and 24 characters long",
  })
  productId: string;
}
