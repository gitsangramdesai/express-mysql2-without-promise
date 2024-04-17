const Sequelize = require("sequelize");
const sequelize = new Sequelize("demo", "root", "sangram#81", {
  dialect: "mysql",
  host: "localhost",
  port: "3306",
  define: {
    timestamps: false,
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
  timezone: "+05:30", // for writing to database
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
