const {
  validateRequest,
  sendResponse,
} = require("../../utils/validation.utils");
const DTO = require("./helpers.controllers.dto");
const { Op } = require("sequelize");
const db = require("../../models");

const viewPaginatedRecordList = async ({
  req,
  res,
  next,
  tableName,
  predefinedQueryOptions,
}) => {
  try {
    validateRequest({
      DTO: DTO.ViewPaginatedRecordListDTO,
      requestBody: { body: req.body, user: req.user },
    });

    const { dateFrom, dateTo, page, pageSize, userId } = req.body;

    const { id: loggedInUserId, roleType } = req.user;

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    let records;
    let totalRecords;
    let totalPages;

    const queryOptions = predefinedQueryOptions || {
      where: {
        // employee will be able to see his/her own records, however admins can see records of other user with id as userId
        userId: roleType == "employee" ? loggedInUserId : userId,
      },
    };

    const isPaginated = pageSize && page;
    const hasDateRange = dateFrom && dateTo;

    // If they want to see in a date range
    if (hasDateRange) {
      queryOptions.where.dateTime = { [Op.between]: [dateFrom, dateTo] };
    }

    // if it is paginated
    if (isPaginated) {
      totalRecords = await db[tableName].count(queryOptions);
      totalPages = Math.ceil(totalRecords / limit);

      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    records = await db[tableName].findAll(queryOptions);

    if (!records?.length) {
      return sendResponse({
        response: res,
        object: {
          data: null,
          statusCode: 404,
          message: "No records found.",
        },
      });
    }

    return sendResponse({
      response: res,
      object: {
        data: {
          records,
          pagination: isPaginated && {
            totalRecords,
            totalPages,
            currentPage: parseInt(page),
            pageSize: limit,
          },
        },
        statusCode: 200,
        message: "Records fetched successfully!",
      },
    });
  } catch (error) {
    next?.(error);
  }
};

module.exports = { viewPaginatedRecordList };
