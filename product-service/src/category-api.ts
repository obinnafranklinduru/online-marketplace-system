import "./utils";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CategoryRepository } from "./repository/category-repository";
import { CategoryService } from "./service/category-service";

const service = new CategoryService(new CategoryRepository());

export const handler = middy(
  async (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const isRoot = event.pathParameters == null;

    switch (event.httpMethod.toLowerCase()) {
      case "get":
        if (isRoot) {
          return await service.getCategories(event);
        } else {
          return await service.getCategory(event);
        }
      case "post":
        return await service.createCategory(event);
      case "put":
        return await service.editCategory(event);
      case "delete":
        return await service.deleteCategory(event);
      default:
        return await service.ResponseWithError(event);
    }
  }
).use(jsonBodyParser());
