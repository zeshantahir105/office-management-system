"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserSession = sequelize.define(
    "user_sessions",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "user_sessions",
      underscored: true,
      timestamps: true,
    }
  );

  UserSession.associate = function (models) {
    UserSession.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return UserSession;
};
