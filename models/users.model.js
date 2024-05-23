"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roleType: {
        field: "role_type",
        type: DataTypes.ENUM("admin", "employee"),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.user_sessions, {
      foreignKey: "user_id",
      as: "sessions",
    });

    User.hasMany(models.attendance, {
      foreignKey: "user_id",
      as: "attendance",
    });

    User.hasMany(models.attendance_notes, {
      foreignKey: "commenter_id",
      as: "attendance_notes",
    });

    User.hasMany(models.leave_requests, {
      foreignKey: "requester_id",
      as: "leave_requests",
    });

    User.hasMany(models.leave_request_notes, {
      foreignKey: "commenter_id",
      as: "leave_request_notes",
    });
  };

  return User;
};
