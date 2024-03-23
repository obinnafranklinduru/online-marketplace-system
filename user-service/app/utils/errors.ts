import { ValidationError, validate } from "class-validator";

// Function to validate input and return validation errors if any
export const AppValidationError = async (
  input: any
): Promise<ValidationError[] | false> => {
  // Validate the input using class-validator
  const errors = await validate(input, {
    ValidationError: { target: true },
  });

  // If there are validation errors, return them
  if (errors.length) {
    return errors;
  }

  // If there are no validation errors, return false
  return false;
};
