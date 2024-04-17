const sequelizeConnection = require("../sequelizeConnection");
const moment = require("moment");
const models = require("../sequelizeModels");

module.exports = function (sequelize, DataTypes) {
  const FoodItem = sequelizeConnection.define(
    "FoodItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        field: "name",
        validate: {
          notEmpty: {
            args: true,
            msg: "name is Required",
          },
          is: {
            args: ["^[a-z ]+$", "i"],
            msg: "In name Only letters allowed",
          },
          len: {
            args: [2, 255],
            msg: "name string length is not in this range",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        field: "description",
        validate: {
          notEmpty: {
            args: true,
            msg: "description is Required",
          },
          is: {
            args: ["^[a-z ]+$", "i"],
            msg: "In description Only letters allowed",
          },
          len: {
            args: [10, 255],
            msg: "description string length is not in this range",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        validate: {},
      },
      createdOn: {
        type: DataTypes.DATE,
        get: function () {
          var originalDate = this.getDataValue("createdOn");
          return moment(originalDate)
            .utcOffset(330)
            .format("YYYY-MM-DD HH:mm:ss");
        },
      },
      deletedOn: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        get: function () {
          var originalDate = this.getDataValue("deletedOn");
          return moment(originalDate)
            .utcOffset(330)
            .format("YYYY-MM-DD HH:mm:ss");
        },
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
    },
    {
      validate: {},
      freezeTableName: true,
      tableName: "foodItem",
      hooks: {
        beforeCreate: async (foodItem, options) => {},
      },
      classMethods: {},
      instanceMethods: {},
    }
  );

  //this.work on instance
  FoodItem.prototype.getName = function () {
    return this.name;
  };

  //this.work on instance
  FoodItem.prototype.CapitalizeName = function () {
    var upperCaseFirstName = this.get("name").toUpperCase();
    this.set("name", upperCaseFirstName);
    return this.save();
  };
  return FoodItem;
};
