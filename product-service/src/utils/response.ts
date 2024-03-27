const formatResponse = (statusCode: number, message: string, data: unknown) => {
  if (!data)
    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Orgin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    };

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Orgin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, data }),
  };
};

export const SuccessResponse = (data: object) =>
  formatResponse(200, "success", data);

export const ErrorResponse = (code = 1000, error: unknown) => {
  if (Array.isArray(error)) {
    const errorObject = error[0].constraints;
    const errorMessage =
      errorObject[Object.keys(errorObject)[0]] || "Error Occured";
    return formatResponse(code, errorMessage, errorMessage);
  }

  return formatResponse(code, `${error}`, error);
};
