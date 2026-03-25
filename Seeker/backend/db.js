const sql = require("mssql");

const config = {
  user: "sa",
  password: "123456",
  server: "LENOVO",   // machine name
  database: "project",
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  instanceName: "SQLEXPRESS"  // 🔥 IMPORTANT
};

sql.connect(config)
  .then(() => console.log("Connected to SQL Server"))
  .catch(err => console.log("DB Error:", err));

module.exports = sql;