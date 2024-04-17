var express = require("express");
var router = express.Router();
var mysql2 = require("mysql2");

// Create the connection to database
const connection = mysql2
  .createConnection({
    host: "localhost",
    user: "root",
    database: "demo",
    password: "sangram#81",
  })
  .promise();

/* insert a new food item */
router.post("/insert", function (req, res, next) {
  let foodItemName = req.body.name;
  let foodItemDesc = req.body.description;
  let foodItemPrice = req.body.price;

  //insert
  connection
    .query("INSERT INTO foodItem(name,description,price) values(?,?,?)", [
      foodItemName,
      foodItemDesc,
      foodItemPrice,
    ])
    .then(function (results) {
      console.log("RESULT:", results);
      res.json({
        message: "food item saved successfully",
        error: "",
        data: results,
        success: true,
      });
    })
    .catch(function (err) {
      res.json({
        message: "unable to save food item",
        error: err.message.toString(),
        data: [],
        success: false,
      });
    });
});

/* get all food item */
router.get("/getAll", function (req, res, next) {
  //select
  connection
    .query("select * from foodItem where isDeleted=0")
    .then(function (results, fields) {
      //we dont want certain field in output also want to format date
      results = results[0].map((elem) => {
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
    })
    .catch(function (err) {
      res.json({
        message: "unable to retreive food items",
        error: err.message.toString(),
        data: [],
        success: false,
      });
    });
});

/* get all food item */
router.get("/getById", function (req, res, next) {
  let foodItemId = req.query.id;
  connection
    .query("select * from foodItem where isDeleted=0 and id=?", [foodItemId])
    .then(function (results) {
      //we dont want certain field in output also want to format date
      results = results[0].map((elem) => {
        delete elem.isDeleted;
        delete elem.deletedOn;
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
    })
    .catch(function (err) {
      res.json({
        message: "unable to retrieve a food item",
        error: err.message.toString(),
        data: [],
        success: false,
      });
    });
});

//update food item all columns
router.put("/update", function (req, res, next) {
  let foodItemId = req.body.id;
  let foodItemName = req.body.name;
  let foodItemDesc = req.body.description;
  let foodItemPrice = req.body.price;

  //insert
  connection
    .query("UPDATE foodItem set name=?,description=?,price=? where id=?", [
      foodItemName,
      foodItemDesc,
      foodItemPrice,
      foodItemId,
    ])
    .then(function (results) {
      res.json({
        message: results.affectedRows
          ? "food item updated successfully"
          : "food item not found",
        error: "",
        data: results,
        success: true,
      });
    })
    .catch(function (err) {
      res.json({
        message: "unable to update food item",
        error: err.message.toString(),
        data: [],
        success: false,
      });
    });
});

//update foot item price
router.patch("/update/price", function (req, res, next) {
  let foodItemId = req.body.id;
  let foodItemPrice = req.body.price;

  //insert
  connection
    .query("UPDATE foodItem set price=? where id=?", [
      foodItemPrice,
      foodItemId,
    ])
    .then(function (results) {
      res.json({
        message: results.affectedRows
          ? "food item price updated successfully"
          : "food item not found",
        error: "",
        data: results,
        success: true,
      });
    })
    .catch(function (err) {
      res.json({
        message: "unable to update food item price",
        error: err.message.toString(),
        data: [],
        success: false,
      });
    });
});

//delete food item
router.delete("/delete", function (req, res, next) {
  let foodItemId = req.body.id;

  //insert
  connection
    .query("Delete from foodItem where id=?", [foodItemId])
    .then(function (results) {
      res.json({
        message: results.affectedRows
          ? "food item deleted successfully"
          : "food item not found",
        error: "",
        data: results,
        success: true,
      });
    })
    .catch(function (err) {
      res.json({
        message: "unable to delete food item",
        error: err.message.toString(),
        data: [],
        success: false,
      });
    });
});

router.delete("/delete/soft", function (req, res, next) {
  let foodItemId = req.body.id;

  //insert
  connection
    .query(
      "Update foodItem set isDeleted=1,deletedOn=now() where isDeleted=0 and id=?",
      [foodItemId]
    )
    .then(function (results) {
      res.json({
        message: results.affectedRows
          ? "food item marked as deleted successfully"
          : "food item not found or already marked as deleted",
        error: "",
        data: results,
        success: true,
      });
    })
    .catch(function (err) {
      res.json({
        message: "unable to mark food item as deleted",
        error: err.message.toString(),
        data: [],
        success: false,
      });
    });
});

//search based on keyword
router.get("/search", function (req, res, next) {
  let keyword = "%" + req.query.keyword + "%";

  connection
    .query("SELECT * from foodItem where description like ?;", [keyword])
    .then(function (results) {
      res.json({
        message: results.length
          ? "food item searched successfully"
          : "food item not found",
        error: "",
        data: results,
        success: true,
      });
    })
    .catch(function (err) {
      res.json({
        message: "unable to search food item",
        error: err.message.toString(),
        data: [],
        success: false,
      });
    });
});

module.exports = router;
