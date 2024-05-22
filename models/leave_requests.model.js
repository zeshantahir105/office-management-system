"use strict";
module.exports = (sequelize, DataTypes) => {
  const LeaveRequest = sequelize.define(
    "leave_requests",
    {
      leaveRequestId: {
        field: "leave_request_id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      requestorId: {
        field: "requestor_id",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        field: "status",
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateTime: {
        field: "date_time",
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "leave_requests",
      underscored: true,
      timestamps: true,
    }
  );

  LeaveRequest.associate = function (models) {
    LeaveRequest.hasMany(models.leave_request_notes, {
      foreignKey: "leave_request_id",
      as: "notes",
    });
  };

  return LeaveRequest;
};
