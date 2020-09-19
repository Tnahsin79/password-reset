var express = require('express');
var router = express.Router();
var { url, mongoClient } = require("../config");
var bcryptjs = require("bcryptjs");
var nodemailer = require("nodemailer");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", async function (req, res) {
  try {
    var client = await mongoClient.connect(url);
    var db = client.db("user-login");
    var user = await db.collection("user").findOne({ email: req.body.email });
    if (!user) 
    {
      //generate salt
      let salt = await bcryptjs.genSalt(10);
      //hash password
      let hash = await bcryptjs.hash(req.body.password, salt);
      //store in db
      req.body.password = hash;
      await db.collection("user").insertOne(req.body);
      console.log("user registered");
      res.json({
        message: "User Registered!"
      });
      const data = `
      <p>you have registration requst</p>
      <h3>Login details</h3>
      <ul>
      <li>First Name: ${req.body.first_name}</li>
      <li>Last Name: ${req.body.last_name}</li>
      <li>Email: ${req.body.email}</li>
      <ul>
      `;
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "tnahsin79@gmail.com", // generated ethereal user
          pass: "lumenhistoire", // generated ethereal password
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Nishant" tnahsin79@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: "testing...", // Subject line
        text: "Hello world?", // plain text body
        html: data // html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    else
    {
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
    var client = await mongoClient.connect(url);
    var db = client.db("user-login");
    //find the user with email
    var user = await db.collection("user").findOne({ email: req.body.email });
    if (user) {
      //comapare the password
      var result = await bcryptjs.compare(req.body.password, user.password);
      if (result) {
        res.json({
          message: "ACCESS GRANTED :)"
        });
      }
      else {
        res.json({
          message: "ACCESS DENIED :( (incorrect username/password)"
        });
      }
    }
    else {
      res.json({
        message: "No such user exists, kindly register yourself!!!!"
      });
    }

    res.json({
      message: "Access Granted!"
    })
  }
  catch (error) {
    res.json({
      message: "Something went wrong: " + error
    })
  }
});

module.exports = router;
