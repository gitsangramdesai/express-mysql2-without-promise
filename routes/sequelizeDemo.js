let express = require("express");
let router = express.Router();
let models = require("../sequelizeModels");
let { Op } = require("sequelize");
const { where } = require("sequelize");

/* insert a new food item */
router.post("/insert", async function (req, res, next) {
  let foodItemName = req.body.name;
  let foodItemDesc = req.body.description;
  let foodItemPrice = req.body.price;
  try {
    let insertedFoodItem = await models.FoodItem.create({
      name: foodItemName,
      description: foodItemDesc,
      price: foodItemPrice,
    });

    res.json({
      message:insertedFoodItem.id > 0 ? "food item added successfully" : "no food item added",
      error: "",
      data: [insertedFoodItem],
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to add new food item",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

/* get all food item */
router.get("/getAll", async function (req, res, next) {
  try {
    let foodItems = await models.FoodItem.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "createdOn",
        "deletedOn",
        "isDeleted",
      ],
    });

    res.json({
      message: foodItems.length
        ? "all food items retrived successfully"
        : "No food item found",
      error: "",
      data: foodItems,
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to retreive food items",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

/* get all food item */
router.get("/getById", async function (req, res, next) {
  let foodItemId = req.query.id;

  try {
    let foodItem = await models.FoodItem.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "createdOn",
        "deletedOn",
        "isDeleted",
      ],
      where: {
        id: foodItemId,
      },
    });

    console.log(foodItem);

    res.json({
      message: foodItem.length
        ? "food item retrived successfully"
        : "no food item found",
      error: "",
      data: foodItem,
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to retreive food item",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

//update food item all columns
router.put("/update", async function (req, res, next) {
  let foodItemId = req.body.id;
  let foodItemName = req.body.name;
  let foodItemDesc = req.body.description;
  let foodItemPrice = req.body.price;

  try {
    let foodItemId = req.body.id;
    let numberOfRowsUpdated = await models.FoodItem.update(
      {
        price: foodItemPrice,
        name: foodItemName,
        description: foodItemDesc,
      },
      { where: { id: foodItemId } }
    );

    res.json({
      message:
        numberOfRowsUpdated[0] == 1
          ? "food item updated successfully"
          : "no food item found",
      error: "",
      data: [],
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to update food item",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

// //update foot item price
router.patch("/update/price", async function (req, res, next) {
  let foodItemId = req.body.id;
  let foodItemPrice = req.body.price;

  try {
    let foodItemId = req.body.id;
    let numberOfRowsUpdated = await models.FoodItem.update(
      { price: foodItemPrice },
      { where: { id: foodItemId } }
    );

    res.json({
      message:
        numberOfRowsUpdated[0] == 1
          ? "food item price updated successfully"
          : "no food item found",
      error: "",
      data: [],
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to update food item price",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

//delete food item
router.delete("/delete", async function (req, res, next) {
  let foodItemId = req.body.id;
  try {
    let numberOfRowsDeleted = await models.FoodItem.destroy({
      where: {
        id: foodItemId,
      },
    });

    res.json({
      message:
        numberOfRowsDeleted == 1
          ? "food item deleted successfully"
          : "no food item found",
      error: "",
      data: [],
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to delete food item",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

router.delete("/delete/soft", async function (req, res, next) {
  try {
    let foodItemId = req.body.id;
    let numberOfRowsUpdated = await models.FoodItem.update(
      { isDeleted: 1 },
      { where: { id: foodItemId } }
    );
    console.log("Number Of Rows Updated:", numberOfRowsUpdated);

    res.json({
      message:
        numberOfRowsUpdated[0] == 1
          ? "food item soft deleted successfully"
          : "no food item found",
      error: "",
      data: [],
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to soft delete food item",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

//search based on keyword
router.get("/search", async function (req, res, next) {
  let keyword = req.query.keyword;
  try {
    let foodItems = await models.FoodItem.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "createdOn",
        "deletedOn",
        "isDeleted",
      ],
      where: {
        description: {
          [Op.like]: "%" + keyword + "%",
        },
      },
    });

    res.json({
      message: foodItems.length
        ? "food item searched successfully"
        : "no food item found",
      error: "",
      data: foodItems,
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to search food item",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

module.exports = router;
