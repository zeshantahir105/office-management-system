module.exports = {
  // development: {
  //   url: '',
  //   dialect: 'postgres'
  // },
  test: {
    url: "postgres://postgres:root@localhost:5432/zeshan-oms",
    dialect: "postgres",
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
  },
  // production: {
  //   url: '',
  //   dialect: 'postgres'
  // }
};
