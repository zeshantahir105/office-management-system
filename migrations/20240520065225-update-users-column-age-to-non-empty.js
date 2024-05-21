"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn("users", "age", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn("users", "age", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
