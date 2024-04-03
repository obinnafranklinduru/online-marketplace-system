import aws from "aws-sdk";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { ErrorResponse, SuccessResponse } from "../utils/response"; //
import { AppValidationError } from "../utils/errors";
import { VerifyToken } from "../utils/password";
import { CartRepository } from "../repository/cartRspository";
import { CartInput, UpdateCartInput } from "../models/dto/CartInput";
import { PullData } from "../message-queue";
import { CartItemModel } from "../models/cartItemsModel";

@autoInjectable()
export class CartService {
  repository: CartRepository;
  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "requested method is not supported!");
  }

  async CreateCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(401, "authorization failed!");

      const input = plainToClass(CartInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(400, error);

      let currentCart = await this.repository.findShoppingCart(payload.user_id); // Finding existing shopping cart for user
      if (!currentCart)
        // If shopping cart doesn't exist, create a new one
        currentCart = await this.repository.createShoppingCart(payload.user_id);

      let currentProduct = await this.repository.findCartItemByProductId(
        input.productId
      ); // Finding cart item by product ID
      if (currentProduct) {
        // If product already exists in cart, update its quantity
        await this.repository.updateCartItemByProductId(
          input.productId,
          (currentProduct.item_qty += input.qty)
        );
      } else {
        // If product doesn't exist in cart, add it
        const { data, status } = await PullData({
          action: "PULL_PRODUCT_DATA",
          productId: input.productId,
        }); // Pulling product data from message queue
        console.log("Getting Product", data); // Logging retrieved product data
        if (status !== 200) {
          // If product data retrieval fails, return internal server error
          return ErrorResponse(500, "failed to get product data!");
        }

        let cartItem = data.data as CartItemModel; // Casting retrieved data to CartItemModel
        cartItem.cart_id = currentCart.cart_id; // Assigning cart ID to cart item
        cartItem.item_qty = input.qty; // Setting item quantity
        // Finally create cart item
        await this.repository.createCartItem(cartItem); // Creating new cart item in database
      }
      const cartItems = await this.repository.findCartItemsByCartId(
        currentCart.cart_id
      ); // Finding all cart items for current cart

      return SuccessResponse(cartItems); // Returning success response with cart items
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    // Method to get user's shopping cart
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(401, "authorization failed!");

      const result = await this.repository.findCartItems(payload.user_id); // Finding all cart items for user
      return SuccessResponse(result); // Returning success response with cart items
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    // Method to update cart item quantity
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(401, "authorization failed!");

      const cartItemId = Number(event.pathParameters.id); // Extracting cart item ID from request path parameters

      const input = plainToClass(UpdateCartInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(400, error);
      const cartItem = await this.repository.updateCartItemById(
        cartItemId,
        input.qty
      ); // Updating cart item quantity in database
      if (!cartItem) return ErrorResponse(404, "item does not exist"); // Returning not found error if cart item doesn't exist

      return SuccessResponse(cartItem); // Returning success response with updated cart item
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async DeleteCart(event: APIGatewayProxyEventV2) {
    // Method to delete cart item
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(401, "authorization failed!");

      const cartItemId = Number(event.pathParameters.id); // Extracting cart item ID from request path parameters

      const deletedItem = await this.repository.deleteCartItem(cartItemId); // Deleting cart item from database
      return SuccessResponse(deletedItem); // Returning success response with deleted cart item
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async CollectPayment(event: APIGatewayProxyEventV2) {
    // Method to collect payment and place order
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(401, "authorization failed!");

      // initilize Payment gateway

      // authenticate payment confirmation

      // get cart items

      const cartItems = await this.repository.findCartItems(payload.user_id); // Finding all cart items for user

      // Send SNS topic to create Order [Transaction MS] => email to user
      const params = {
        // Creating SNS publish parameters
        Message: JSON.stringify(cartItems), // Converting cart items to JSON string
        TopicArn: process.env.SNS_TOPIC, // Setting SNS topic ARN from environment variables
        MessageAttributes: {
          // Defining message attributes
          actionType: {
            DataType: "String",
            StringValue: "place_order",
          },
        },
      };
      const sns = new aws.SNS(); // Creating SNS instance
      const response = await sns.publish(params).promise(); // Publishing message to SNS topic

      // Send tentative message to user

      return SuccessResponse({ msg: "Payment Processing...", response }); // Returning success response with processing message and SNS response
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  // async GetOrders(event: APIGatewayProxyEventV2) {
  //   try {
  //     return SuccessResponse({ msg: "get orders..." });
  //   } catch (error) {
  //     console.log(error);
  //     return ErrorResponse(500, error);
  //   }
  // }

  // async GetOrder(event: APIGatewayProxyEventV2) {
  //   try {
  //     return SuccessResponse({ msg: "get order by id..." });
  //   } catch (error) {
  //     console.log(error);
  //     return ErrorResponse(500, error);
  //   }
  // }
}
