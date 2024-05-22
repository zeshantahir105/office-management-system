"use strict";
module.exports = (sequelize, DataTypes) => {
  const LeaveRequestNote = sequelize.define(
    "leave_request_notes",
    {
      noteId: {
        field: "note_id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      leaveRequestId: {
        field: "leave_request_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "leave_requests",
          key: "leave_request_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      replyToNoteId: {
        field: "reply_to_note_id",
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "leave_request_notes",
          key: "note_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      dateTime: {
        field: "date_time",
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "leave_request_notes",
      underscored: true,
      timestamps: true,
    }
  );

  LeaveRequestNote.associate = function (models) {
    LeaveRequestNote.belongsTo(models.leave_requests, {
      foreignKey: "leave_request_id",
      as: "leaveRequest",
    });
    LeaveRequestNote.belongsTo(models.leave_request_notes, {
      foreignKey: "reply_to_note_id",
      as: "replyToNote",
    });
    LeaveRequestNote.hasMany(models.leave_request_notes, {
      foreignKey: "reply_to_note_id",
      as: "replies",
    });
  };

  return LeaveRequestNote;
};
