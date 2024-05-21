"use strict";
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "attendance",
    {
      attendanceId: {
        field: "attendance_id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        field: "status",
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      dateTime: {
        field: "date_time",
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "attendance",
      underscored: true,
      timestamps: true,
    }
  );

  Attendance.associate = function (models) {
    Attendance.hasMany(models.attendance_notes, {
      foreignKey: "attendance_id",
      as: "notes",
    });

    Attendance.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "users",
    });
  };

  return Attendance;
};
