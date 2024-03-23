import { APIGatewayProxyEventV2 } from "aws-lambda";
import { container } from "tsyringe";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

import { UserService } from "../service/userService";

// Resolve UserService dependency using tsyringe container
const service = container.resolve(UserService);

// Middleware functions for handling various HTTP requests

// Signup endpoint handler
export const Signup = middy(async (event: APIGatewayProxyEventV2) => {
  return await service.CreateUser(event);
}).use(middyJsonBodyParser());

// Login endpoint handler
export const Login = middy(async (event: APIGatewayProxyEventV2) => {
  return service.UserLogin(event);
}).use(middyJsonBodyParser());

// Verify endpoint handler
export const Verify = middy(async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();

  // Determine action based on HTTP method
  if (httpMethod === "post") {
    return service.VerifyUser(event);
  } else if (httpMethod === "get") {
    return service.GetVerificationToken(event);
  } else {
    return service.ResponseWithError(event);
  }
}).use(middyJsonBodyParser());

// Profile endpoint handler
export const Profile = middy(async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();

  // Determine action based on HTTP method
  if (httpMethod === "post") {
    return service.CreateProfile(event);
  } else if (httpMethod === "get") {
    return service.GetProfile(event);
  } else if (httpMethod === "put") {
    return service.EditProfile(event);
  } else {
    return service.ResponseWithError(event);
  }
}).use(middyJsonBodyParser());

// Cart endpoint handler
export const Cart = middy(async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();

  // Determine action based on HTTP method
  if (httpMethod === "post") {
    return service.CreateCart(event);
  } else if (httpMethod === "get") {
    return service.GetCart(event);
  } else if (httpMethod === "put") {
    return service.UpdateCart(event);
  } else {
    return service.ResponseWithError(event);
  }
}).use(middyJsonBodyParser());

// Payment endpoint handler
export const Payment = middy(async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();

  // Determine action based on HTTP method
  if (httpMethod === "post") {
    return service.CreatePaymentMethod(event);
  } else if (httpMethod === "get") {
    return service.GetPaymentMethod(event);
  } else if (httpMethod === "put") {
    return service.UpdatePaymentMethod(event);
  } else {
    return service.ResponseWithError(event);
  }
}).use(middyJsonBodyParser());
