import { body, param } from "express-validator";

// Validator for user registration
export const registerInputValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .notEmpty()
    .withMessage("Phone number is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง~])(?=.*[a-zA-Z]).{6,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  body("role")
    .isIn(["Admin", "Waiter", "Chef", "User"])
    .withMessage("Invalid role")
    .notEmpty()
    .withMessage("Role is required"),
];

// Validator for user login
export const loginInputValidator = [
  body("identifier").notEmpty().withMessage("Identifier is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Change password
export const changePasswordInputValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง~])(?=.*[a-zA-Z]).{6,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),
];

// Active Deactive
export const activeDeactiveInput = [
  body("isActive")
    .notEmpty()
    .withMessage("isActive is required")
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

// Update profile
export const updateProfileInput = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number format"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง~])(?=.*[a-zA-Z]).{6,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  body("dateOfBirth").optional().isDate().withMessage("Invalid date format"),
  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),
  body("role")
    .optional()
    .isIn(["Admin", "Waiter", "Chef", "User"])
    .withMessage("Invalid role"),
];

// Category input
export const categoryInput = [
  body("name").notEmpty().withMessage("Category name is required"),
];

// Add item
export const addItemInput = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("mainPrice").notEmpty().withMessage("Main price is required").isNumeric().withMessage("Main price must be a number").isFloat({ min: 0 }).withMessage("Main price must be a positive number"),
  body("discountedPrice").optional().isNumeric().withMessage("Discounted price must be a number").isFloat({ min: 0 }).withMessage("Discounted price must be a positive number"),
  body("offer.type").optional().isIn(["percentage", "fixed"]).withMessage("Offer type must be either 'percentage' or 'fixed'"),
  body("offer.amount").optional().isNumeric().withMessage("Offer amount must be a number").isFloat({ min: 0 }).withMessage("Offer amount must be a positive number"),
  body("category").optional().isMongoId().withMessage("Category must be a valid MongoDB ID"),
  body("ingredients").optional().isArray().withMessage("Ingredients must be an array"),
  body("availability").optional().isBoolean().withMessage("Availability must be a boolean value"),
  body("customizable").optional().isBoolean().withMessage("Customizable must be a boolean value"),
  body("options.*.name").optional().isString().withMessage("Option name must be a string"),
  body("options.*.choices").optional().isArray().withMessage("Option choices must be an array"),
  body("options.*.required").optional().isBoolean().withMessage("Option required must be a boolean value"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*").optional().isString().withMessage("Image must be a string"),
  body("veg").optional().isBoolean().withMessage("Veg must be a boolean value"),
  body("allergens").optional().isArray().withMessage("Allergens must be an array"),
  body("isDeleted").optional().isBoolean().withMessage("IsDeleted must be a boolean value"),
  body("popular").optional().isBoolean().withMessage("Popular must be a boolean value"),
];

export const updateAvailabilityValidation = [
  body("availability")
    .isBoolean().withMessage("Availability must be a boolean value")
    .notEmpty().withMessage("Availability is required"),
];