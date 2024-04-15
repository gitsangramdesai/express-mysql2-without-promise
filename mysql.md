Here we will demonstrate how to connect mysql without promise to express.

creating mysql table:
   Assuming Mysql is already installed login to mysql through command prompt.

         mysql -uroot -pyourpassword
   
   Now for purpose of our article we will create a database & table.

        create database demo;
        use demo;

        --create table

        CREATE TABLE `foodItem` (
        `id` bigint(20) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) DEFAULT NULL,
        `description` varchar(255) DEFAULT NULL,
        `price` integer DEFAULT 0,
        PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

        ALTER TABLE foodItem add createdOn datetime DEFAULT now();

        ALTER TABLE foodItem add isDeleted bool DEFAULT false;

        ALTER TABLE foodItem add deletedOn datetime DEFAULT NULL;


   Now install for generating simple express.js app we will use express generator.

        npm install -g express-generator

    Lets create a express project

         express --view=ejs mysql-demo
         cd mysql-demo

    First thing we will do is install nodemon & update express to newer version
      
         npm install nodemon --save-dev
        
    Now open package.json and update it as following

        {
            "name": "mysql-demo",
            "version": "0.0.0",
            "private": true,
            "scripts": {
                "start": "nodemon ./bin/www"
            },
            "dependencies": {
                "cookie-parser": "~1.4.4",
                "debug": "~2.6.9",
                "dotenv": "^16.4.5",
                "ejs": "~2.6.1",
                "express": "~4.19.2",
                "http-errors": "~1.6.3",
                "morgan": "~1.9.1",
                "mysql2": "^3.9.4"
            },
            "devDependencies": {
                "nodeman": "^1.1.2"
            }
        }
        

    Here we we have changed scripts-->start from node ./bin/www to nodemon ./bin/www.
    Other thing we have updated is version of express.js to latest stable i.e. "express": "~4.19.2"

    in our project inside route folder add demo.js.

    To connect to mysql database server we are using mysql2 so we need to install its package

        npm install mysql2

    
    Barebone demo.js will look like below

    var express = require("express");
    var router = express.Router();
    var mysql2 = require("mysql2");

    //create connection
    // Create the connection to database
        const connection = mysql2.createConnection({
        host: "localhost",
        user: "root",
        database: "demo",
        password: "sangram#81",
    });

    /* get all food item */
    router.get("/getById", function (req, res, next) {
    let foodItemId = req.query.id;
    //select
    connection.query(
        "select * from foodItem where isDeleted=0 and id=?",
        [foodItemId],
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

    module.exports = router;

    Though their are multiple routes I am including one just for explanation of working of mysql2.
    Lets consider following code snippet.


    connection.query(
        "select * from foodItem where isDeleted=0 and id=?",
        [foodItemId],
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

    Here we want to run query 
        select * from foodItem where isDeleted=0 and id=2

    where this id 2 will come from our rest api call as get param.so weare keeping ? in its place 
    and its value is taken from array in order of occurances of ? in query which is second param 
    of connection.query & third param is callback.

    if we got error in callback we are sending error ,if no error but result array is empty then 
    sending unable to retreive item else success message with data i.e. an array containing record
    of mysql query result.

    Now we need to mount this router to be accessible so head over to app.js and add

    var demoRouter = require('./routes/demo');

    then we will add

    app.use('/demo', demoRouter);

    So our rest api will be accessible at /demo/getById,its get api expect id from query string.By Default it runs on 3000
    port we can change it.For that we need to install dotenv package.

        npm i dotenv

    Now go to bin/www  and add

    require('dotenv').config()

    Now to root of our project add file .env.In to this file add

    PORT=3001

    Now we can run our project as

        npm start

    As our table has no records lets add two records into it.

        INSERT INTO foodItem(name,description,price) values('sada dosa','made from rice floor',20);
        INSERT INTO foodItem(name,description,price) values('masal dosa','made from rice floor & potato',40);

    Go to postman app and call our api.

     you will select GET method then in url section add http://localhost:3001/demo/getById?id=1.

     IN Params add id and its value as 2 and hit sent you should get result as follows.Your result and my result may vary wrt footItem but JSON
     structure should remain same.

        {
            "message": "food item retrived successfully",
            "error": "",
            "data": [
                {
                    "id": 3,
                    "name": "samosa",
                    "description": "made up of potato",
                    "price": 14,
                    "isDeleted": 0,
                    "createdOn": "2024-04-15 08:26:52",
                    "deletedOn": null
                }
            ],
            "success": true
        } 

  My complete project is accessible at github at https://github.com/gitsangramdesai/express-mysql2-without-promise

  In complete project you will find all CRUD operationa & a search operation too.