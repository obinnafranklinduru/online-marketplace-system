// Function to format the response object
const formatResponse = (statusCode: number, message: string, data: unknown) => {
  // Check if data is provided
  if (data) {
    // If data is provided, include it in the response body
    return {
      statusCode,
      body: JSON.stringify({ message, data }, null, 2),
    };
  } else {
    // If no data is provided, exclude data from the response body
    return {
      statusCode,
      body: JSON.stringify({ message }, null, 2),
    };
  }
};

// Function to generate a success response
export const SuccessResponse = (data: object) => {
  // Return a formatted success response with the provided data
  return formatResponse(200, "success", data);
};

// Function to generate an error response
export const ErrorResponse = (code = 1000, error: unknown) => {
  // Check if the error is an array of validation errors
  if (Array.isArray(error)) {
    // Extract the error message from the first validation error
    const errorObject = error[0].constraints;
    const errorMessage =
      errorObject[Object.keys(errorObject)[0]] || "Error Occurred";

    // Return a formatted error response with the validation error message
    return formatResponse(code, "failed", `${errorMessage}`);
  }

  // If the error is not an array, return a formatted error response with the provided error message
  return formatResponse(code, "failed", `${error}`);
};
