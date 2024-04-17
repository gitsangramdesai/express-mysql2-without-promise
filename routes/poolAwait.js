const express = require("express");
const router = express.Router();
const mysql2 = require("mysql2/promise");

async function getMysqlPromisifiedPoolConnection() {
  const pool = await mysql2.createPool({
    host: "localhost",
    user: "root",
    database: "demo",
    password: "sangram#81",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
  const connection = await pool.getConnection();
  return connection;
}

/* insert a new food item */
router.post("/insert", async function (req, res, next) {
  let pool = await getMysqlPromisifiedPoolConnection();
  let foodItemName = req.body.name;
  let foodItemDesc = req.body.description;
  let foodItemPrice = req.body.price;

  try {
    let [results] = await pool.execute(
      "INSERT INTO foodItem(name,description,price) values(?,?,?)",
      [foodItemName, foodItemDesc, foodItemPrice]
    );
    res.json({
      message: "food item saved successfully",
      error: "",
      data: results,
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to save food item",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

/* get all food item */
router.get("/getAll", async function (req, res, next) {
  let pool = await getMysqlPromisifiedPoolConnection();

  try {
    let [results, fields] = await pool.execute(
      "select * from foodItem where isDeleted=0"
    );
    //we dont want certain field in output also want to format date
    results = results.map((elem) => {
      delete elem.isDeleted;
      delete elem.deletedOn;
      elem.createdOn = new Date(elem.createdOn)
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");

      return elem;
    });

    res.json({
      message: "all food items retrived successfully",
      error: "",
      data: results,
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
  let pool = await getMysqlPromisifiedPoolConnection();

  try {
    let [results] = await pool.execute(
      "select * from foodItem where isDeleted=0 and id=?",
      [foodItemId]
    );
    results = results.map((elem) => {
      elem.createdOn = new Date(elem.createdOn)
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");

      return elem;
    });

    //their are chances that the id doesn't fetch any record
    res.json({
      message: results.length
        ? "food item retrived successfully"
        : "no food item found",
      error: "",
      data: results,
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to retrieve a food item",
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
  let pool = await getMysqlPromisifiedPoolConnection();

  try {
    let [results] = await pool.execute(
      "UPDATE foodItem set name=?,description=?,price=? where id=?",
      [foodItemName, foodItemDesc, foodItemPrice, foodItemId]
    );
    res.json({
      message: results.affectedRows
        ? "food item updated successfully"
        : "food item not found",
      error: "",
      data: results,
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

//update foot item price
router.patch("/update/price", async function (req, res, next) {
  let foodItemId = req.body.id;
  let foodItemPrice = req.body.price;

  let pool = await getMysqlPromisifiedPoolConnection();

  try {
    let [results] = await pool.execute(
      "UPDATE foodItem set price=? where id=?",
      [foodItemPrice, foodItemId]
    );
    res.json({
      message: results.affectedRows
        ? "food item price updated successfully"
        : "food item not found",
      error: "",
      data: results,
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
  let pool = await getMysqlPromisifiedPoolConnection();

  try {
    //insert
    let [results] = await pool.execute("Delete from foodItem where id=?", [
      foodItemId,
    ]);
    res.json({
      message: results.affectedRows
        ? "food item deleted successfully"
        : "food item not found",
      error: "",
      data: results,
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

//mark as deleted not actually deleting
router.delete("/delete/soft", async function (req, res, next) {
  let foodItemId = req.body.id;
  let pool = await getMysqlPromisifiedPoolConnection();

  try {
    //insert
    let [results] = await pool.execute(
      "Update foodItem set isDeleted=1,deletedOn=now() where isDeleted=0 and id=?",
      [foodItemId]
    );
    res.json({
      message: results.affectedRows
        ? "food item marked as deleted successfully"
        : "food item not found or already marked as deleted",
      error: "",
      data: results,
      success: true,
    });
  } catch (err) {
    res.json({
      message: "unable to mark food item as deleted",
      error: err.message.toString(),
      data: [],
      success: false,
    });
  }
});

//search based on keyword
router.get("/search", async function (req, res, next) {
  let keyword = "%" + req.query.keyword + "%";
  let pool = await getMysqlPromisifiedPoolConnection();
  //insert
  let [results] = await pool.execute(
    "SELECT * from foodItem where description like ?;",
    [keyword]
  );

  try {
    res.json({
      message: results.length
        ? "food item searched successfully"
        : "food item not found",
      error: "",
      data: results,
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
