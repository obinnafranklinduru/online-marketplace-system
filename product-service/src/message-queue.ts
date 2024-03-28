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
    return await service.handleQueueOperation(event);
  }
).use(jsonBodyParser());
