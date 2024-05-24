require("dotenv").config();

const {
  NODE_ENV,
  DB_DIALECT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

module.exports = {
  [NODE_ENV]: {
    url: `${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    dialect: DB_DIALECT,
  },
};
