const db = require("../models/index");
const { validateRequest, sendResponse } = require("../utils/validation.utils");
const DTO = require("./dtos/attendance.controllers.dto");
const GeneralDTO = require("./dtos/general.dto");
const { viewPaginatedRecordList } = require("./helpers/helpers.controllers");

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to mark the attendance of a user.
 */
const markOrUpdateAttendace = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.MarkOrUpdateAttendanceDTO,
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
      // Update attendance if it already exists
      const creationDate = new Date(prevAttendance.createdAt);

      const diffInMs = Math.abs(new Date() - creationDate);
      const diffInMinutes = diffInMs / (1000 * 60);

      if (diffInMinutes > 5) {
        return sendResponse({
          response: res,
          object: {
            data: null,
            statusCode: 400,
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
            data: {
              succes: true,
            },
            statusCode: 200,
            message: "Attendance updated successfully",
          },
        });
      }

      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 500,
          message: "Unable to update the attendance",
        },
      });
    }

    // Mark Attendace
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
        statusCode: 500,
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
      requestBody: { body: req.body, user: req.user },
    });
    const { note, attendanceId } = req.body;
    const { id: commenterId } = req.user;

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
          data: response,
          statusCode: 201,
          message: `Note "${note}" added successfully to the attendance with id "${attendanceId}"`,
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 500,
        message: "Unable to add the note",
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
 * @description - This function is used to update the attendance notes of a user.
 */
const updateAttendanceNote = async (req, res, next) => {
  try {
    const { note: updatedNote, noteId } = req.body;

    validateRequest({
      DTO: GeneralDTO.UpdateNoteDTO,
      requestBody: req.body,
    });

    const existingNote = await db.attendance_notes.findOne({
      where: { noteId },
    });

    if (!existingNote) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Note doesn't exist.",
        },
      });
    }

    if (existingNote.commenterId != req.user.id) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 401,
          message: "You can only update your own notes.",
        },
      });
    }

    const response = await db.attendance_notes.update(
      {
        note: updatedNote,
      },
      {
        where: { noteId },
      }
    );

    // at 0th index, we will get the number of records updated,
    // if the number of records updated is 1, then the attendance is updated
    // else the attendance is not updated
    if (response?.[0]) {
      return sendResponse({
        response: res,
        object: {
          data: {
            succes: true,
          },
          statusCode: 200,
          message: `Note updated successfully!`,
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 500,
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
      DTO: GeneralDTO.DeleteNoteDTO,
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
          data: {
            succes: true,
          },
          statusCode: 200,
          message: `Note deleted successfully!`,
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 500,
        message: `Unable to delete the note!`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {*} req  // req.body.getNotesOfRoleType will explain the notes of which user type are required, in case of NULL it will fetch all the notes
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to fetch the attendance notes. It retrieves all the attendance notes associated with the provided `attendanceId` and includes the related attendance and user information.
 */
const viewAttendanceNotes = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.ViewAttendanceNotesDTO,
      requestBody: req.body,
    });
    const { attendanceId, getNotesOfRoleType } = req.body;

    const queryOptions = {
      where: { attendanceId },
    };

    if (getNotesOfRoleType) {
      queryOptions.include = [
        {
          model: db.users,
          as: "commenter",
          where: { roleType: getNotesOfRoleType },
          attributes: ["id", "roleType", "name", "email", "age"],
        },
      ];
    }

    const updatedReq = req;

    delete updatedReq.body.attendanceId;
    delete updatedReq.body.getNotesOfRoleType;

    // Get paginated record list
    return viewPaginatedRecordList({
      res,
      next,
      req: updatedReq,
      predefinedQueryOptions: queryOptions,
      tableName: "attendance_notes",
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
 * @description - This function is used to reply to an attendance note. It creates a new attendance note with the provided `note` and `commenterId`.
 */
const replyToAttendanceNotes = async (req, res, next) => {
  try {
    validateRequest({
      DTO: GeneralDTO.ReplyToNotesDTO,
      requestBody: {
        body: req.body,
        user: req.user,
      },
    });
    const { noteId, note } = req.body;
    const { id: commenterId } = req.user;

    const existingAttendanceNote = await db.attendance_notes.findOne({
      where: { noteId },
    });

    if (!existingAttendanceNote) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Note doesn't exist.",
        },
      });
    }

    const response = await db.attendance_notes.create({
      note,
      commenterId,
      replyToNoteId: noteId,
      attendanceId: existingAttendanceNote.attendanceId,
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
        statusCode: 500,
        message: "Unable to add the reply.",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markOrUpdateAttendace,
  addAttendanceNote,
  updateAttendanceNote,
  deleteAttendanceNote,
  viewAttendanceNotes,
  replyToAttendanceNotes,
};
