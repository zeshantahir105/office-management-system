const db = require("../models/index");
const { validateRequest, sendResponse } = require("../utils/validation.utils");
const DTO = require("./dtos/leave-requests.controllers.dto");
const GeneralDTO = require("./dtos/general.dto");
const HelpersDTO = require("./dtos/helpers.controllers.dto");
const { Op } = require("sequelize");
const { viewPaginatedRecordList } = require("./helpers/helpers.controllers");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to create a new leave request.
 */
const createOrUpdateLeaveRequest = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.CreateOrUpdateLeaveRequestDTO,
      requestBody: { body: req.body, user: req.user },
    });

    const { dateFrom, dateTo, leaveRequestId } = req.body;
    const { id } = req.user;
    const now = new Date().toISOString();
    const dateFromTimestamp = new Date(dateFrom).toISOString();
    const dateToTimestamp = new Date(dateTo).toISOString();

    if (dateFromTimestamp <= now) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 400,
          message: "Start date cannot be in the past.",
        },
      });
    }

    if (dateFromTimestamp > dateToTimestamp) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 400,
          message: "Start date cannot be greater than end date.",
        },
      });
    }

    if (!leaveRequestId) {
      // If the user is going to create the leave request instead of updating
      const existingLeaveRequest = await db.leave_requests.findOne({
        where: {
          [Op.and]: [
            { dateFrom: { [Op.gte]: dateFrom } },
            { dateTo: { [Op.lte]: dateTo } },
          ],
        },
      });
      if (existingLeaveRequest) {
        return sendResponse({
          response: res,
          object: {
            data: null,
            statusCode: 400,
            message: "Leave request already exists.",
          },
        });
      }
    } else {
      // if the user is going to update the leave request
      const existingLeaveRequest = await db.leave_requests.findOne({
        where: { id: leaveRequestId },
      });

      // Updating existing leave request
      if (existingLeaveRequest) {
        if (existingLeaveRequest.status == "pending") {
          return sendResponse({
            response: res,
            object: {
              data: null,
              statusCode: 400,
              message:
                "Unable to update the Leave request as it's already pending.",
            },
          });
        }

        const creationDate = new Date(
          existingLeaveRequest.createdAt
        ).toISOString();

        const diffInMs = Math.abs(now - creationDate);
        const diffInMinutes = diffInMs / (1000 * 60);

        if (diffInMinutes > 5) {
          return sendResponse({
            response: res,
            object: {
              data: null,
              statusCode: 400,
              message:
                "Unable to update the leave request after 5 mins of the leave request creation.",
            },
          });
        }

        existingLeaveRequest.dateFrom = dateFrom;
        existingLeaveRequest.dateTo = dateTo;
        existingLeaveRequest.staus = "pending";
        await existingLeaveRequest.save();
        return sendResponse({
          response: res,
          object: {
            data: existingLeaveRequest,
            statusCode: 200,
            message: "Leave request updated successfully",
          },
        });
      }
    }

    // Creating leave request
    const response = await db.leave_requests.create({
      dateFrom,
      dateTo,
      requesterId: id,
    });

    // if response is non empty, then the leave request is created successfully
    if (response) {
      return sendResponse({
        response: res,
        object: {
          data: response,
          statusCode: 201,
          message: "Leave request created successfully",
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const approveOrRejectLeaveRequest = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.ApproveOrRejectLeaveRequestDTO,
      requestBody: { body: req.body, user: req.user },
    });

    const { leaveRequestId, status } = req.body;
    const { id } = req.user;
    const leaveRequest = await db.leave_requests.findOne({
      where: { leaveRequestId },
    });

    if (!leaveRequest) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Leave Request doesn't exist.",
        },
      });
    }

    const response = await db.leave_requests.update(
      {
        status,
        approverId: id,
      },
      {
        where: { leaveRequestId },
      }
    );

    // at 0th index, we will get the number of records updated,
    // if the number of records updated is 1, then the leave request is updated
    // else the leave request is not updated
    if (response?.[0]) {
      return sendResponse({
        response: res,
        object: {
          data: {
            success: true,
          },
          statusCode: 200,
          message: `Leave request ${status}!`,
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 500,
        message: "Unable to update the leave request",
      },
    });
  } catch (error) {
    next(error);
  }
};

const viewLeaveRequests = async (req, res, next) => {
  try {
    validateRequest({
      DTO: HelpersDTO.ViewPaginatedRecordListDTO,
      requestBody: { user: req.user, body: req.body },
    });

    const { userId } = req.body;
    const { id } = req.user;

    const predefinedQueryOptions = id && {
      where: { requesterId: userId || id },
    };

    return viewPaginatedRecordList({
      req,
      res,
      next,
      predefinedQueryOptions,
      dateTimeColName: "dateFrom",
      tableName: "leave_requests",
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
 * @description - This function is used to add a note to the leave request.
 */
const addLeaveRequestNote = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.AddLeaveRequestNoteDTO,
      requestBody: { body: req.body, user: req.user },
    });
    const { note, leaveRequestId } = req.body;
    const { id: commenterId } = req.user;
    const leaveRequest = await db.leave_requests.findOne({
      where: { leaveRequestId },
    });

    if (!leaveRequest) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Leave Request doesn't exist.",
        },
      });
    }

    const response = await db.leave_request_notes.create({
      leaveRequestId,
      note,
      commenterId,
    });

    // if response is non empty, then the leave request is created successfully
    if (response) {
      return sendResponse({
        response: res,
        object: {
          data: response,
          statusCode: 201,
          message: `Note "${note}" added successfully to the leave request with id "${leaveRequestId}"`,
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
 * @description - This function is used to update the leave request notes of a user.
 */
const updateLeaveRequestNote = async (req, res, next) => {
  try {
    const { note: updatedNote, noteId } = req.body;

    validateRequest({
      DTO: GeneralDTO.UpdateNoteDTO,
      requestBody: req.body,
    });

    const existingLeaveRequestNote = await db.leave_request_notes.findOne({
      where: { noteId },
    });

    if (!existingLeaveRequestNote) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Note doesn't exist.",
        },
      });
    }

    if (existingLeaveRequestNote.commenterId != req.user.id) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 401,
          message: "You can only update your own notes.",
        },
      });
    }

    const response = await db.leave_request_notes.update(
      {
        note: updatedNote,
      },
      {
        where: { noteId },
      }
    );

    // at 0th index, we will get the number of records updated,
    // if the number of records updated is 1, then the leave request is updated
    // else the leave request is not updated
    if (response?.[0]) {
      return sendResponse({
        response: res,
        object: {
          data: updatedNote,
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
 * @description - This function is used to update an leave request note in the database.
 */
const deleteLeaveRequestNote = async (req, res, next) => {
  try {
    validateRequest({
      DTO: GeneralDTO.DeleteNoteDTO,
      requestBody: { body: req.body, user: req.user },
    });

    const { noteId } = req.body;
    const { id, roleType } = req.user;

    const note = await db.leave_request_notes.findOne({
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

    const response = await db.leave_request_notes.destroy({
      where: { noteId },
    });

    // if response is non empty, then the leaveRequest is created successfully
    if (response) {
      return sendResponse({
        response: res,
        object: {
          data: null,
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
 * @description - This function is used to fetch the leave request notes. It retrieves all the leave request notes associated with the provided `leaveRequestId` and includes the related leave request and user information.
 */
const viewLeaveRequestNotes = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.ViewLeaveRequestNotesDTO,
      requestBody: req.body,
    });
    const { leaveRequestId, getNotesOfRoleType } = req.body;

    const queryOptions = {
      where: { leaveRequestId },
    };

    if (getNotesOfRoleType) {
      queryOptions.include = {
        model: db.leave_requests,
        as: "leaveRequest",
        include: {
          model: db.users,
          as: "users",
          where: { roleType: getNotesOfRoleType },
        },
      };
    }

    const updatedReq = req;

    delete updatedReq.body.leaveRequestId;
    delete updatedReq.body.getNotesOfRoleType;

    // Get paginated record list
    return viewPaginatedRecordList({
      res,
      next,
      req: updatedReq,
      predefinedQueryOptions: queryOptions,
      tableName: "leave_request_notes",
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
 * @description - This function is used to reply to an leave request note. It creates a new leave request note with the provided `note` and `commenterId`.
 */
const replyToLeaveRequestNotes = async (req, res, next) => {
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

    const leaveRequestNote = await db.leave_request_notes.findOne({
      where: { noteId },
    });

    if (!leaveRequestNote) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Leave Request doesn't exist.",
        },
      });
    }

    const response = db.leave_request_notes.create({
      note,
      commenterId,
      replyToNoteId: noteId,
    });

    // if response is non empty, then the leave request is created successfully
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

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - Returns a response object with the status code and message.
 * @description - This function is used to delete an leave request.
 */
const deleteLeaveRequest = async (req, res, next) => {
  try {
    validateRequest({
      DTO: DTO.DeleteLeaveRequestDTO,
      requestBody: {
        body: req.body,
        user: req.user,
      },
    });
    const { leaveRequestId } = req.body;

    const leaveRequest = await db.leave_requests.findOne({
      where: { leaveRequestId },
    });

    if (!leaveRequest) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "Leave Request doesn't exist.",
        },
      });
    }

    if (leaveRequest.status == "pending") {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 400,
          message: "You cannot delete pending leave requests.",
        },
      });
    }

    const response = await db.leave_requests.destroy({
      where: { leaveRequestId },
    });

    if (response) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 200,
          message: "Leave Request deleted successfully!",
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: null,
        statusCode: 500,
        message: "Unable to delete the leave request.",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateLeaveRequest,
  viewLeaveRequests,
  addLeaveRequestNote,
  updateLeaveRequestNote,
  deleteLeaveRequestNote,
  viewLeaveRequestNotes,
  replyToLeaveRequestNotes,
  deleteLeaveRequest,
  approveOrRejectLeaveRequest,
};
