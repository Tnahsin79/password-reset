var express = require('express');
var router = express.Router();
var { mongoClient } = require("../config");
var bcryptjs = require("bcryptjs");
var nodemailer = require("nodemailer");
require('dotenv').config();

console.log(process.env.URL);
//console.log(process.env.PWD);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", async function (req, res) {
  try {
    var client = await mongoClient.connect(process.env.URL);
    var db = client.db("user-login");
    var user = await db.collection("user").findOne({ email: req.body.email });
    if (!user) {
      //generate salt
      let salt = await bcryptjs.genSalt(10);
      //hash password
      let hash = await bcryptjs.hash(req.body.password, salt);
      //store in db
      req.body.password = hash;
      user = await db.collection("user").insertOne(req.body);
      console.log("user registered");
      res.json({
        message: "User Registered!"
      });
      //var link=`https://password-reset.netlify.app/reset.html/${user.ObjectId()}`;
      //req.body=req.body.json();
      var data = `
      <p>you have registration requst</p>
      <h3>Validating link</h3>
      <p>link<p>
      `;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        //port: 465,
        //secure: true, // true for 465, false for other ports
        auth: {
          user: "webdevtesting79@gmail.com", // generated ethereal user
          pass: process.env.PWD // generated ethereal password
        }
      });

      let mailOptions = {
        from: "webdevtesting79@gmail.com", // sender address
        to: "webdevtesting79@gmail.com", // list of receivers
        subject: "testing...", // Subject line
        text: "Hello world?", // plain text body
        html: data // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error: " + error);
        }
        else {
          console.log("Message sent: %s", info.messageId);
          console.log("email sent: %s", info.response);
          //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      });
    }
    else {
      alert("Email aleady registrered!");
    }

  }
  catch (error) {
    console.log("ERROR: " + error);
    res.json({
      message: "Something went wrong: " + error
    })
  }
});

router.post("/login", async function (req, res) {
  try {
    var client = await mongoClient.connect(process.env.URL);
    var db = client.db("user-login");
    //find the user with email
    var user = await db.collection("user").findOne({ email: req.body.email });
    if (user) {
      //comapare the password
      var result = await bcryptjs.compare(req.body.password, user.password);
      if (result) {
        //alert("ACCESS GRANTED :)");
        res.json({
          message: "ACCESS GRANTED :)"
        });
      }
      else {
        //alert("ACCESS DENIED :( (incorrect username/password");
        res.json({
          message: "ACCESS DENIED :( (incorrect username/password)"
        });
      }
    }
    else {
      //alert("No such user exists, kindly register yourself!!!!");
      res.json({
        message: "No such user exists, kindly register yourself!!!!"
      });
    }
  }
  catch (error) {
    res.json({
      message: "Something went wrong: " + error
    })
  }
});

router.post("/validate", async function (req, res) {
  try {
    var client = await mongoClient.connect(process.env.URL);
    var db = client.db("user-login");
    var user = await db.collection("user").findOne({ email: req.body.email });
    if (!user) {
      const data = `<a href="https://password-reset.netlify.app/reset.html">Click here to validate</a>`;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        //port: 465,
        //secure: true, // true for 465, false for other ports
        auth: {
          user: "webdevtesting79@gmail.com", // generated ethereal user
          pass: process.env.PWD // generated ethereal password
        }
      });

      let mailOptions = {
        from: "webdevtesting79@gmail.com", // sender address
        to: "webdevtesting79@gmail.com", // list of receivers
        subject: "testing...", // Subject line
        text: "Hello world?", // plain text body
        html: data // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error: " + error);
        }
        else {
          console.log("Message sent: %s", info.messageId);
          console.log("email sent: %s", info.response);
          //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      });
    }
    else {
      alert("Email aleady registrered!");
    }

  }
  catch (error) {
    console.log("ERROR: " + error);
    res.json({
      message: "Something went wrong: " + error
    })
  }
});

/*router.post("/reset", async function (req, res) {
  try {
    var client = await mongoClient.connect(process.env.URL);
    var db = client.db("user-login");
    //find the user with email
    var user = await db.collection("user").findOne({ email: req.body.email });
    if (user) {
      //comapare the password
      var result = await bcryptjs.compare(req.body.password, user.password);
      if (result) {
        //alert("ACCESS GRANTED :)");
        res.json({
          message: "ACCESS GRANTED :)"
        });
      }
      else {
        //alert("ACCESS DENIED :( (incorrect username/password");
        res.json({
          message: "ACCESS DENIED :( (incorrect username/password)"
        });
      }
    }
    else {
      //alert("No such user exists, kindly register yourself!!!!");
      res.json({
        message: "No such user exists, kindly register yourself!!!!"
      });
    }
  }
  catch (error) {
    res.json({
      message: "Something went wrong: " + error
    })
  }
});*/

module.exports = router;