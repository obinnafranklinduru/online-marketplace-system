import { APIGatewayEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utils/errors";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { CategoryRepository } from "../repository/category-repository";
import { CategoryInput } from "../dto/category-input";

export class CategoryService {
  _repository: CategoryRepository;
  constructor(repository: CategoryRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, new Error("method not allowed!"));
  }

  async createCategory(event: APIGatewayEvent) {
    const input = plainToClass(CategoryInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(400, error);

    const data = await this._repository.createCategory(input);
    return SuccessResponse(data);
  }

  async getCategories(event: APIGatewayEvent) {
    const type = event.queryStringParameters?.type;
    if (type?.toLowerCase() === "top") {
      const data = await this._repository.getTopCategories();
      return SuccessResponse(data);
    }

    const data = await this._repository.getAllCategories();
    return SuccessResponse(data);
  }

  async getCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    if (!categoryId) return ErrorResponse(400, "Please provide category id");

    const offset = Number(event.queryStringParameters?.offset);
    const pages = Number(event.queryStringParameters?.pages);

    const data = await this._repository.getCategoryById(
      categoryId,
      offset,
      pages
    );
    return SuccessResponse(data);
  }

  async editCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    if (!categoryId) return ErrorResponse(400, "Please provide category id");

    const input = plainToClass(CategoryInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(400, error);

    input.id = categoryId;
    const data = await this._repository.updateCategory(input);
    return SuccessResponse(data);
  }

  async deleteCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    if (!categoryId) return ErrorResponse(400, "Please provide category id");

    const data = await this._repository.deleteCategory(categoryId);
    return SuccessResponse(data);
  }
}
