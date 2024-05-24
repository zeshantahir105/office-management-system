"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance_notes", {
      note_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      attendance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "attendance",
          key: "attendance_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reply_to_note_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "attendance_notes",
          key: "note_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      commenter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      note: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable("attendance_notes");
  },
};
