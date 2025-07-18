import { ZodError } from "zod";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors,
        });
      }

      // Handle other types of errors
      console.error("Unexpected error in validation:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during validation",
      });
    }
  };
};
