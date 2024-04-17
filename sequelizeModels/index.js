var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var sequelizeConnection = require("../sequelizeConnection");
var basename = path.basename(__filename);
var db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    var model = require(path.join(__dirname, file))(
      sequelizeConnection,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelizeConnection = sequelizeConnection;
db.Sequelize = Sequelize;

module.exports = db;
