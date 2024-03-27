import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { plainToClass } from "class-transformer";
import { ProductInput } from "../dto/product-input";
import { AppValidationError } from "../utils/errors";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { CategoryRepository } from "../repository/category-repository";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, new Error("method not allowed!"));
  }

  async createProduct(event: APIGatewayEvent) {
    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);

    const data = await this._repository.createProduct(input);

    await new CategoryRepository().addItem({
      id: input.category_id,
      products: [data._id],
    });

    return SuccessResponse(data);
  }

  async getProducts(event: APIGatewayEvent) {
    const data = await this._repository.getAllProducts();
    return SuccessResponse(data);
  }

  async getProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "Please provide product Id");

    const data = await this._repository.getProductById(productId);
    return SuccessResponse(data);
  }

  async editProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "Please provide product Id");

    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);

    input.id = productId;
    const data = await this._repository.updateProduct(input);
    return SuccessResponse(data);
  }

  async deleteProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "Please provide product Id");

    const { category_id, deleteResult } = await this._repository.deleteProduct(
      productId
    );

    await new CategoryRepository().removeItem({
      id: category_id,
      products: [productId],
    });

    return SuccessResponse(deleteResult);
  }
}
