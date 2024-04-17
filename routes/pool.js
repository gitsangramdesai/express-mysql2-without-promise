var express = require("express");
var router = express.Router();
var mysql2 = require("mysql2");

//create pool
const pool = mysql2.createPool({
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

/* insert a new food item */
router.post("/insert", function (req, res, next) {
  let foodItemName = req.body.name;
  let foodItemDesc = req.body.description;
  let foodItemPrice = req.body.price;


  //insert
  pool.query(
    "INSERT INTO foodItem(name,description,price) values(?,?,?)",
    [foodItemName, foodItemDesc, foodItemPrice],
    function (err, results) {
      if (err) {
        res.json({
          message: "unable to save food item",
          error: err.message.toString(),
          data: [],
          success: false,
        });
      } else {
        res.json({
          message: "food item saved successfully",
          error: "",
          data: results,
          success: true,
        });
      }
    }
  );
});

/* get all food item */
router.get("/getAll", function (req, res, next) {
  //select
  pool.query(
    "select * from foodItem where isDeleted=0",
    function (err, results, fields) {
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

      if (err) {
        res.json({
          message: "unable to retreive food items",
          error: err.message.toString(),
          data: [],
          success: false,
        });
      } else {
        res.json({
          message: "all food items retrived successfully",
          error: "",
          data: results,
          success: true,
        });
      }
    }
  );
});

/* get all food item */
router.get("/getById", function (req, res, next) {
  let foodItemId = req.query.id;
  //select
  pool.query("select * from foodItem where isDeleted=0 and id=?",[foodItemId],
    function (err, results) {
      results = results.map((elem) => {
        elem.createdOn = new Date(elem.createdOn)
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");

        return elem;
      });

      if (err) {
        res.json({
          message: "unable to retrieve a food item",
          error: err.message.toString(),
          data: [],
          success: false,
        });
      } else {
        //their are chances that the id doesn't fetch any record
        res.json({
          message: results.length
            ? "food item retrived successfully"
            : "no food item found",
          error: "",
          data: results,
          success: true,
        });
      }
    }
  );
});

//update food item all columns
router.put("/update", function (req, res, next) {
  let foodItemId = req.body.id;
  let foodItemName = req.body.name;
  let foodItemDesc = req.body.description;
  let foodItemPrice = req.body.price;

  //insert
  pool.query(
    "UPDATE foodItem set name=?,description=?,price=? where id=?",
    [foodItemName, foodItemDesc, foodItemPrice, foodItemId],
    function (err, results) {
      if (err) {
        res.json({
          message: "unable to update food item",
          error: err.message.toString(),
          data: [],
          success: false,
        });
      } else {
        res.json({
          message: results.affectedRows
            ? "food item updated successfully"
            : "food item not found",
          error: "",
          data: results,
          success: true,
        });
      }
    }
  );
});

//update foot item price
router.patch("/update/price", function (req, res, next) {
  let foodItemId = req.body.id;
  let foodItemPrice = req.body.price;

  //insert
  pool.query("UPDATE foodItem set price=? where id=?",[foodItemPrice, foodItemId],
    function (err, results) {
      if (err) {
        res.json({
          message: "unable to update food item price",
          error: err.message.toString(),
          data: [],
          success: false,
        });
      } else {
        res.json({
          message: results.affectedRows
            ? "food item price updated successfully"
            : "food item not found",
          error: "",
          data: results,
          success: true,
        });
      }
    }
  );
});

//delete food item
router.delete("/delete", function (req, res, next) {
  let foodItemId = req.body.id;

  //insert
  pool.query(
    "Delete from foodItem where id=?",
    [foodItemId],
    function (err, results) {
      if (err) {
        res.json({
          message: "unable to delete food item",
          error: err.message.toString(),
          data: [],
          success: false,
        });
      } else {
        res.json({
          message: results.affectedRows
            ? "food item deleted successfully"
            : "food item not found",
          error: "",
          data: results,
          success: true,
        });
      }
    }
  );
});

//mark as deleted not actually deleting
router.delete("/delete/soft", function (req, res, next) {
  let foodItemId = req.body.id;

  //insert
  pool.query(
    "Update foodItem set isDeleted=1,deletedOn=now() where isDeleted=0 and id=?",
    [foodItemId],
    function (err, results) {
      if (err) {
        res.json({
          message: "unable to mark food item as deleted",
          error: err.message.toString(),
          data: [],
          success: false,
        });
      } else {
        res.json({
          message: results.affectedRows
            ? "food item marked as deleted successfully"
            : "food item not found or already marked as deleted",
          error: "",
          data: results,
          success: true,
        });
      }
    }
  );
});

//search based on keyword
router.get("/search", function (req, res, next) {
  let keyword = "%" + req.query.keyword + "%";

  //insert
  pool.query(
    "SELECT * from foodItem where description like ?;",
    [keyword],
    function (err, results) {
      if (err) {
        res.json({
          message: "unable to search food item",
          error: err.message.toString(),
          data: [],
          success: false,
        });
      } else {
        res.json({
          message: results.length
            ? "food item searched successfully"
            : "food item not found",
          error: "",
          data: results,
          success: true,
        });
      }
    }
  );
});

module.exports = router;
