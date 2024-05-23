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
      requesterId: {
        field: "requester_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      approverId: {
        field: "approver_id",
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        field: "status",
        allowNull: false,
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      dateFrom: {
        field: "date_from",
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateTo: {
        field: "date_to",
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

    LeaveRequest.belongsTo(models.users, {
      foreignKey: "requester_id",
      as: "requester",
    });

    LeaveRequest.belongsTo(models.users, {
      foreignKey: "approver_id",
      as: "approver",
    });
  };

  return LeaveRequest;
};
