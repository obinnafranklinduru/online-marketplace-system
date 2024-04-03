import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { plainToClass } from "class-transformer";
import { ProductInput } from "../dto/product-input";
import { AppValidationError } from "../utils/errors";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { CategoryRepository } from "../repository/category-repository";
import { ServiceInput } from "../dto/service-input";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, new Error("method not allowed!"));
  }

  async createProduct(event: APIGatewayEvent) {
    try {
      const input = plainToClass(ProductInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(400, error);

      const data = await this._repository.createProduct(input);

      await new CategoryRepository().addItem({
        id: input.category_id,
        products: [data._id],
      });

      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async getProducts(event: APIGatewayEvent) {
    try {
      const data = await this._repository.getAllProducts();
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async getProduct(event: APIGatewayEvent) {
    try {
      const productId = event.pathParameters?.id;
      if (!productId) return ErrorResponse(401, "Please provide product Id");

      const data = await this._repository.getProductById(productId);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async editProduct(event: APIGatewayEvent) {
    try {
      const productId = event.pathParameters?.id;
      if (!productId) return ErrorResponse(401, "Please provide product Id");

      const input = plainToClass(ProductInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(400, error);

      input.id = productId;
      const data = await this._repository.updateProduct(input);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async deleteProduct(event: APIGatewayEvent) {
    try {
      const productId = event.pathParameters?.id;
      if (!productId) return ErrorResponse(401, "Please provide product Id");

      const { category_id, deleteResult } =
        await this._repository.deleteProduct(productId);

      await new CategoryRepository().removeItem({
        id: category_id,
        products: [productId],
      });

      return SuccessResponse(deleteResult);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async handleQueueOperation(event: APIGatewayEvent) {
    try {
      const input = plainToClass(ServiceInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(400, error);

      const { _id, name, price, image_url } =
        await this._repository.getProductById(input.productId);

      return SuccessResponse({
        product_id: _id,
        name,
        price,
        image_url,
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }
}
