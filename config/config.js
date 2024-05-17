module.exports = {
  local: {
    url: "postgres://postgres:root@localhost:5432/zeshan-oms",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: { connectTimeout: 60000 },
  },
};
