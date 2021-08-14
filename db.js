const sql = require("mssql");
const { DefaultDeserializer } = require("v8");

const config = {
  user: "quynhlm",
  password: "123@Qweasd",
  server: "quinnie.database.windows.net", // You can use 'localhost\\instance' to connect to named instance
  database: "mcdonald",
  trustServerCertificate: true,
  encrypt: true,
  trustedConnection: true,
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => {
    console.log("Database connection failed !", err);
  });

module.exports = { sql, poolPromise };

// sql
//   .connect(config)
//   .then((pool) => {
//     // Query

//     return pool
//       .request()
//       .input("input_parameter", sql.Int, value)
//       .query("Select UserPhone, Name, Address, Fbid From User");
//   })
//   .then((result) => {
//     console.dir(result);
//   })
//   .catch((err) => {
//     console.log("Database connection failed !", err);
//   });
