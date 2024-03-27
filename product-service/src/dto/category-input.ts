import { IsNumber, Length } from "class-validator";

export class CategoryInput {
  id: string;

  @Length(3, 128, { message: "Name must be between 3 and 128 characters long" })
  name: string;

  parentId?: string;

  products: string[];

  @IsNumber({}, { message: "Display order must be a number" })
  displayOrder: number;

  imageUrl: string;
}

export class AddItemInput {
  @Length(3, 128, { message: "ID must be between 3 and 128 characters long" })
  id: string;

  products: string[];
}
