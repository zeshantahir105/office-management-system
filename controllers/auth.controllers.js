const db = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/users.model");
const { validateRequest, sendResponse } = require("../utils/validation.utils");
const DTO = require("./dtos/auth.controllers.dto");
const { Op } = require("sequelize");

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to register a new user.
 */
const registerUser = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.RegisterUserDTO,
      requestBody: req.body,
    });

    const { name, email, password, age, roleType } = req.body;

    // Check if the email exists
    const userExists = await db.users.findOne({
      where: { email },
      attributes: ["id"],
    });

    if (userExists) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 400,
          message: "Email is already associated with an account",
        },
      });
    }

    const encryptedPassword = await bcrypt.hash(
      password,
      bcrypt.genSaltSync(8)
    );

    const data = await db.users.create({
      name,
      email,
      age,
      roleType,
      password: encryptedPassword,
    });

    return sendResponse({
      response: res,
      object: {
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          age: data.age,
          roleType: data.roleType,
        },
        statusCode: 200,
        message: "Registration successful",
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to login a user.
 */
const signInUser = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.SignInUserDTO,
      requestBody: req.body,
    });

    const { email, password } = req.body;
    const user = await db.users.findOne({
      where: { email },
    });
    if (!user) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "User doesn't exist.",
        },
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 400,
          message: "Invalid Credentials",
        },
      });
    }

    // Authenticate user with jwt
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    // Creating user session
    db.user_sessions.create({
      token,
      userId: user.id,
    });

    return sendResponse({
      response: res,
      object: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken: token,
        },
        statusCode: 200,
        message: "Successfully signed in!",
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  signInUser,
};
