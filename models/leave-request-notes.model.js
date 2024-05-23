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
      commenterId: {
        field: "commenter_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id",
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
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "leave_request_notes",
      underscored: true,
      timestamps: true,
      paranoid: true,
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

    LeaveRequestNote.belongsTo(models.users, {
      foreignKey: "commenter_id",
      as: "commenter",
    });
  };

  return LeaveRequestNote;
};
