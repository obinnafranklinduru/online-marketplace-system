import "./utils";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { ProductRepository } from "./repository/product-repository";
import { ProductService } from "./service/product-service";

const service = new ProductService(new ProductRepository());

export const handler = middy(
  async (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const isRoot = event.pathParameters === null;

    switch (event.httpMethod.toLowerCase()) {
      case "get":
        if (isRoot) {
          return await service.getProducts(event);
        } else {
          return await service.getProduct(event);
        }
      case "post":
        return await service.createProduct(event);
      case "put":
        return await service.editProduct(event);
      case "delete":
        return await service.deleteProduct(event);
      default:
        return await service.ResponseWithError(event);
    }
  }
).use(jsonBodyParser());
