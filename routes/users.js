var express = require('express');
var router = express.Router();
var {url,mongoClient}=require("../config");
var bcryptjs=require("bcryptjs");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register",async function(req,res,next){
  try
  {
    var client=await mongoClient.connect(url);
    var db=client.db("user-login");
    //generate salt
    let salt=await bcryptjs.genSalt(10);
    //hash password
    let hash=await bcryptjs.hash(req.body.password,salt);
    //store in db
    req.body.password=hash;
    await db.collection("user").insertOne(req.body);
    res.json({
      message:"User Registered!"
    })
  }
  catch(error)
  {
    res.json({
      message:"Something went wrong: "+error
    })
  }
});

router.post("/login",async function(req,res,next){
  try
  {
    var client=await mongoClient.connect(url);
    var db=client.db("user-login");
    //find the user with email
    var user=await db.collection("user").findOne({email:req.body.email});
    if(user)
    {
      //comapare the password
      var result=await bcryptjs.compare(req.body.password,user.password);
      if(result)
      {
        res.json({
          message:"ACCESS GRANTED :)"
        });
      }
      else
      {
        res.json({
          message:"ACCESS DENIED :( (incorrect username/password)"
        });
      }
    }
    else
    {
      res.json({
        message:"No such user exists, kindly register yourself!!!!"
      });
    }

    res.json({
      message:"Access Granted!"
    })
  }
  catch(error)
  {
    res.json({
      message:"Something went wrong: "+error
    })
  }
});

module.exports = router;
