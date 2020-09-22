var nodemailer = require("nodemailer");
require('dotenv').config();
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

      let mailOptions={
        from: "webdevtesting79@gmail.com", // sender address
        to: req.body.email, // list of receivers
        subject: "testing...", // Subject line
        text: "Hello world?" // plain text body
      };
    
      // send mail with defined transport object
      transporter.sendMail(mailOptions,(error,info)=>{
        if(error)
        {
          console.log("error: "+error);
        }
        else
        {
          console.log("Message sent: %s", info.messageId);
          console.log("email sent: %s", info.response);
          //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      });