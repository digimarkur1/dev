const { body, param } = require("express-validator");

exports.signupValidation = [

  body("name")
    .notEmpty().withMessage("Name required")
    .isLength({ min: 3 }).withMessage("Min 3 chars"),

  body("id")
    .notEmpty().withMessage("ID required")
    .isNumeric().withMessage("ID must be number"),

  body("password")
    .notEmpty().withMessage("Password required")
    .isLength({ min: 6 }).withMessage("Password min 6"),

  body("role")
    .notEmpty()
    .isIn(["admin","manager","user"])
    .withMessage("Invalid role")

];

exports.loginValidation = [

  body("name")
    .notEmpty().withMessage("Name required"),

  body("password")
    .notEmpty().withMessage("Password required")

];

exports.tokenValidation = [

  body("token")
    .notEmpty().withMessage("Refresh token required")

];

exports.userIdParamValidation = [

  param("id")
    .notEmpty()
    .isNumeric().withMessage("ID must be number")

];