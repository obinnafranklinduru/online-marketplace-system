import { IsNumber, Length } from "class-validator";

export class ProductInput {
  id: string;

  @Length(3, 128, { message: "Name must be between 3 and 128 characters long" })
  name: string;

  @Length(3, 256, {
    message: "Description must be between 3 and 256 characters long",
  })
  description: string;

  category_id: string;

  image_url: string;

  @IsNumber({}, { message: "Price must be a number" })
  price: number;

  availability: boolean;
}
