"use strict";
module.exports = (sequelize, DataTypes) => {
  const AttendanceNote = sequelize.define(
    "attendance_notes",
    {
      noteId: {
        field: "note_id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      attendanceId: {
        field: "attendance_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "attendance",
          key: "attendance_id",
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
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "attendance_notes",
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );

  AttendanceNote.associate = function (models) {
    AttendanceNote.belongsTo(models.attendance, {
      foreignKey: "attendance_id",
      as: "attendance",
    });
  };

  return AttendanceNote;
};
