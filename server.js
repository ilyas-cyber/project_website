const express = require('express');
const app = express();
const path = require('path');
const router = new express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const encoder = bodyParser.urlencoded();
const mysql = require("mysql");
const speakeasy = require('speakeasy');
const https = require('https');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();

// const { EMAIL, PASSWORD } = require('./env.js')

//parse incoming requests with JSON payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// router.post('/user/sign', signup);
// router.post('/getbill', getbill);

app.use("/assets",express.static("assets"));

app.use('/images/Feautred-Section/', express.static(path.join(__dirname, '/images/Feautred-Section/')));

app.use('/images/form-image/', express.static(path.join(__dirname, '/images/form-image/')));

app.use('/images/mainLogo/', express.static(path.join(__dirname, '/images/mainLogo/')));

app.use('/images/PVpacks/', express.static(path.join(__dirname, '/images/PVpacks/')));

app.use('/images/solarPack/', express.static(path.join(__dirname, '/images/solarPack/')));

app.use('/images/Logo/', express.static(path.join(__dirname, '/images/Logo/')));

app.use('/images/Solar Panel/', express.static(path.join(__dirname, '/images/Solar Panel/')));

// serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// serve the index.html file
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'map.html'));
});
  

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
    // console.log(secret)

});

//Routing users login page
app.get("/login",function(req, res){
    res.sendFile(__dirname + "/login.html");
})

app.get("/submit-form",function(req, res){
  res.sendFile(__dirname + "/contact.html");
})

//Routing admin login Page
app.get("/admin-login",function(req, res){
  res.sendFile(__dirname + "/admin-login.html");
})

//Admin routing
app.get("/admin",function(req, res){
  res.sendFile(__dirname + "/admin.html");
})

//Site-Owner Routing
app.get("/owner",function(req, res){
  res.sendFile(__dirname + "/site-owner.html");
})

//Site-Owner login
app.get("/owner-login",function(req, res){
  res.sendFile(__dirname + "/owner-login.html");
})

// serve pvCalc.html file
// app.get("/pv",function(req, res){
//   res.sendFile(__dirname + "/pvCalc.html");
// })

app.get("/pvcalc",function(req, res){
  res.sendFile(__dirname + "/pvCalc.html");
})

//Routing to partner companies 
app.get("/partner-company",function(req, res){
  res.sendFile(__dirname + "/partner-company.html");
})

//Routing to partner companies login
app.get("/partner-login",function(req, res){
  res.sendFile(__dirname + "/partner-login.html");
})


//Check weather the user Exist in database (Authentication)
app.post("/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from users where email = ? and password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/verify");
        } else {
            res.redirect("/login");
        }
        res.end();
    })
})

app.post("/verify", encoder, function(req, res) {
  const token = req.body.token;
  var email = req.body.username;
  // const email = 1733793;

  connection.query("SELECT secret_key FROM users WHERE email = ?", [email], function(error, results, fields) {
    if (results.length > 0) {
      const secret = results[0].secret_key;
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2
      });
      
      if (verified) {
        res.redirect("/");
      } else {
        res.send('OTP token is invalid');
      }
    } else {
      res.redirect("/login");
    }
    res.end();
  });
});


app.get("/verify",function(req, res){
  res.sendFile(__dirname + "/login.html");
});

//Check weather the Admin Exist in database (Authentication) or Not and verify
app.post("/admin-login",encoder, function(req,res){
  const token = req.body.token;
  var email = req.body.username;
  // const email = 1733793;

  connection.query("SELECT secret_key FROM users WHERE email = ?", [email], function(error, results, fields) {
    if (results.length > 0) {
      const secret = results[0].secret_key;
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2
      });
      
      if (verified) {
        res.redirect("/admin");
      } else {
        res.send('OTP token is invalid');
      }
    } else {
      res.redirect("/admin-login");
    }
    res.end();
  });
})

// when login is success
app.get("/admin",function(req,res){
    res.sendFile(__dirname + "/admin.html")
})

//Check weather the site-Owner Exist in the database (Authentication) or Not
app.post("/owner-login",encoder, function(req,res){
  const token = req.body.token;
  var email = req.body.username;
  // const email = 1733793;

  connection.query("SELECT secret_key FROM users WHERE email = ?", [email], function(error, results, fields) {
    if (results.length > 0) {
      const secret = results[0].secret_key;
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2
      });
      
      if (verified) {
        res.redirect("/owner");
      } else {
        res.send('OTP token is invalid');
      }
    } else {
      res.redirect("/owner-login");
    }
    res.end();
  });
})

// when login is success
app.get("/owner",function(req,res){
    res.sendFile(__dirname + "/site-owner.html")
})

//Check weather the Partner-company Exist in the database (Authentication) or Not
app.post("/partner-login",encoder, function(req,res){
  const token = req.body.token;
  var email = req.body.username;
  // const email = 1733793;

  connection.query("SELECT secret_key FROM users WHERE email = ?", [email], function(error, results, fields) {
    if (results.length > 0) {
      const secret = results[0].secret_key;
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2
      });
      
      if (verified) {
        res.redirect("/partner-company");
      } else {
        res.send('OTP token is invalid');
      }
    } else {
      res.redirect("/partner-login");
    }
    res.end();
  });
})

//Signup user and save the data to the database
app.post('/signup', (req, res) => {
  const user  = req.body.user;
  const email  = req.body.email;
  const password  = req.body.password;
  const secret = speakeasy.generateSecret({ name: `${user}` });
  const secret_key = secret.base32;

  connection.query('INSERT INTO users (user, email, password, secret_key) VALUES (?, ?, ?, ?)', [user, email, password, secret_key], (error, result, fields) => {
    if (error) {
      console.error(error);
      res.redirect("An error Occurred!!");
    } else {
      
      res.redirect("/");
    }
  });
});

app.get("/signup",function(req,res){
  res.sendFile(__dirname + "/signup.html")
})


// Generate a new secret key for OTP and display the QR code
app.get('/generate', (req, res) => {
  const email = 'newtest9@gmail.com';
  connection.query("SELECT secret_key FROM users WHERE email = ?", [email], function(error, results, fields) {
    if (results.length > 0) {
       const secret = results[0].secret_key;
       console.log(typeof secret.otpauth_url, secret.otpauth_url);
qrcode.toDataURL(secret.otpauth_url, (err, data) => {
  // rest of the code
  if (err) {
    console.error(err);
    res.status(500).send('Error generating QR code');
  } else {
    console.log(data)
    res.send(`<img src="${data}">`);
  }
});
}else{
console.log(secret);
}
});

});


 

// let details = {
//   from:"milyas259868@gmail.com",
//   to:"ik259868@gmail.com",
//   subject: "Testing our node mailer Emailer",
//   text:"Sending our first Email"
// }

// mailTransporter.sendMail(details, (err)=>{
//   if(err){
//     console.log("It has an Error", err)
//   }
//   else{
//     console.log("Email has been sent Successfully");
//   }
// });

app.post("/submit-form",function(req,res){
  const { name, phone, address, email, offer, date} = req.body;
  
  connection.query('INSERT INTO client_data (name, phone, address, email, offer, date) VALUES (?, ?, ?, ?, ?, ?)', [name, phone, address, email, offer, date], (error, result) => {
    if (error) {
      console.error(error);
      res.redirect("An error Occurred!!");
    } else {
      let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
      
        }
      })

      let details = {
        from:"milyas259868@gmail.com",
        to: email,
        subject: "Thank you for Connectting With Us ",
        text:"Dear " + name + ",\n\nThank you for submitting the form on " + date + ". We appreciate your interest in our services.\n\nBest regards,\n Otovo Solar Panel "
      }

      mailTransporter.sendMail(details, (err)=>{
        if(err){
          console.log("It has an Error", err)
          res.redirect("An error Occurred!!");
        }
        else{
          console.log("Email has been sent Successfully");
          res.sendFile(__dirname + "/Thanks.html")
        }
      });
    }
  });
});


// Owner a create user
app.post('/users', (req, res) => {
  const user = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const sql = `INSERT INTO users (user, email, password) VALUES (?, ?, ?)`;
  connection.query(sql, [user, email, password], (err, result) => {
    if (err) {
      console.error(err);
      res.redirect("An error Occurred!!");
    } else {
      res.send("New Admin Has been Successfully Added");
    }
    
  });
});

//Delete Admin User 
app.post('/delete_admin', (req, res) => {
  const user = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  
  const sql = 'DELETE FROM users WHERE user = ? AND email = ? AND password = ?';
  connection.query(sql, [user, email, password], (err, result) => {
  if (err) {
  console.error(err);
  res.redirect("An error Occurred!!");
  } else {
  res.send("User data has been deleted successfully");
  }
  });
  });


// serve static files in the public folder
app.use(express.static(path.join(__dirname, 'public')));


// serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.use(router);


app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
