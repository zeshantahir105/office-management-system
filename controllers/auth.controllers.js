const db = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/users.model");
const { validateRequest, sendResponse } = require("../utils/validation.utils");
const DTO = require("./dto/auth.controllers.dto");
const { send } = require("express/lib/response");

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
        data,
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
          statusCode: 404,
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

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to mark the attendance of a user.
 */
const markAttendance = async (req, res, next) => {
  try {
    console.log("USER", req.user);

    validateRequest({
      DTO: DTO.MarkAttendanceDTO,
      requestBody: { body: req.body, user: req.user },
    });

    const { status, dateTime } = req.body;
    const { id } = req.user;
    const now = new Date().toISOString();
    const attendanceDate = new Date(dateTime).toISOString();

    if (attendanceDate > now) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 400,
          message: "Bad Request! You cannot mark the future attendance.",
        },
      });
    }

    const prevAttendance = await db.attendance.findOne({
      where: { userId: id, dateTime },
    });

    if (prevAttendance) {
      const creationDate = new Date(prevAttendance.createdAt).toISOString();

      const diffInMs = Math.abs(now - creationDate);
      const diffInMinutes = diffInMs / (1000 * 60);

      if (diffInMinutes > 5) {
        return sendResponse({
          response: res,
          object: {
            data: null,

            statusCode: 500,
            message:
              "Unable to remark the attendance after 5 mins of the attendance creation.",
          },
        });
      }

      const response = await db.attendance.update(
        {
          status,
          dateTime,
        },
        {
          where: { userId: id, dateTime },
        }
      );

      // at 0th index, we will get the number of records updated,
      // if the number of records updated is 1, then the attendance is updated
      // else the attendance is not updated
      if (response?.[0]) {
        return sendResponse({
          response: res,
          object: {
            data: null,
            statusCode: 200,
            message: "Attendance updated successfully",
          },
        });
      }

      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 400,
          message: "Unable to update the attendance",
        },
      });
    }

    const response = await db.attendance.create({
      userId: id,
      status,
      dateTime,
    });

    // if response is non empty, then the attendance is created successfully
    if (response) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 200,
          message: "Attendance marked successfully",
        },
      });
    }

    // else the attendance is not created
    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 400,
        message: "Unable to mark the attendance",
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to add a note to the attendance.
 */
const addAttendanceNote = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.AddAttendanceNoteDTO,
      requestBody: req.body,
    });
    const { note, attendanceId, commenterId } = req.body;

    const attendance = await db.attendance.findOne({
      where: { attendanceId },
    });

    if (!attendance) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Attendance doesn't exist.",
        },
      });
    }

    const response = await db.attendance_notes.create({
      attendanceId,
      note,
      commenterId,
    });

    // if response is non empty, then the attendance is created successfully
    if (response) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 201,
          message: `Note "${note}" added successfully to the attendance with id "${attendanceId}"`,
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 400,
        message: "Unable to add the note",
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAttendanceNote = async (req, res, next) => {
  try {
    const { note: updatedNote, noteId } = req.body;

    validateRequest({
      DTO: DTO.UpdateAttendanceNoteDTO,
      requestBody: req.body,
    });

    const response = await db.attendance_notes.update(
      {
        note: updatedNote,
      },
      {
        where: { noteId },
      }
    );

    if (response?.[0]) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 201,
          message: `Note updated successfully!`,
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 400,
        message: `Unable to update the note!`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to update an attendance note in the database.
 */
const deleteAttendanceNote = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.DeleteAttendanceNoteDTO,
      requestBody: { body: req.body, user: req.user },
    });
    const { noteId } = req.body;
    const { id, roleType } = req.user;

    const note = await db.attendance_notes.findOne({
      where: { noteId },
    });

    if (!note) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Note doesn't exist.",
        },
      });
    }

    // Employee can only delete their own notes
    if (roleType == "employee" && id != note.commenterId) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 401,
          message: "You can only delete your own notes.",
        },
      });
    }

    const response = await db.attendance_notes.destroy({
      where: { noteId },
    });

    // if response is non empty, then the attendance is created successfully
    if (response) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 201,
          message: `Note deleted successfully!`,
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 400,
        message: `Unable to delete the note!`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to fetch the attendance notes from an admin user. It retrieves all the attendance notes associated with the provided `attendanceId` and includes the related attendance and user information.
 */
const viewAdminAttendanceNotes = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.ViewAdminAttendanceNotesDTO,
      requestBody: req.body,
    });
    const { attendanceId, page, pageSize } = req.body;

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    let adminNotes;
    let totalRecords;
    let totalPages;
    const isPaginated = pageSize && page;

    const queryOptions = {
      where: { attendanceId },
      include: {
        model: db.attendance,
        as: "attendance",
        include: {
          model: db.users,
          as: "users",
          where: { roleType: "admin" },
        },
      },
    };

    if (isPaginated) {
      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    adminNotes = await db.attendance_notes.findAll(queryOptions);

    if (isPaginated) {
      totalRecords = await db.attendance_notes.count({
        where: { attendanceId },
        include: {
          model: db.attendance,
          as: "attendance",
          include: {
            model: db.users,
            as: "users",
            where: { roleType: "admin" },
          },
        },
      });
      totalPages = Math.ceil(totalRecords / limit);
    }

    if (!adminNotes?.length) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Notes doesn't exist.",
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: {
          notes: adminNotes,
          pagination: pageSize && {
            totalRecords,
            totalPages,
            currentPage: parseInt(page),
            pageSize: limit,
          },
        },
        statusCode: 200,
        message: "Notes fetched successfully!",
      },
    });
  } catch (error) {
    next(res);
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to reply to an attendance note. It creates a new attendance note with the provided `note` and `commenterId`.
 */
const replyToAttendanceNotes = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.ReplyToAttendanceNotesDTO,
      requestBody: {
        body: req.body,
        user: req.user,
      },
    });
    const { noteId, note } = req.body;
    const { id: commenterId } = req.user;

    const response = db.attendance_notes.create({
      note,
      commenterId,
      replyToNoteId: noteId,
    });

    // if response is non empty, then the attendance is created successfully
    if (response) {
      return sendResponse({
        response: res,
        object: {
          data: response,
          statusCode: 200,
          message: "Your reply has been added to the note.",
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 400,
        message: "Unable to add the reply.",
      },
    });
  } catch (error) {
    next(res);
  }
};

module.exports = {
  registerUser,
  signInUser,
  markAttendance,
  addAttendanceNote,
  updateAttendanceNote,
  deleteAttendanceNote,
  viewAdminAttendanceNotes,
  replyToAttendanceNotes,
};
