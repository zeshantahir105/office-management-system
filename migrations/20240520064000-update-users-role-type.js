"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "role_type", {
      type: Sequelize.ENUM("admin", "employee"),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "role_type", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
