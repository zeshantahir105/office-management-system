"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leave_request_notes", {
      note_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      leave_request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "leave_requests",
          key: "leave_request_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reply_to_note_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "leave_request_notes",
          key: "note_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      date_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("leave_request_notes");
  },
};
