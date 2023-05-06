const express = require('express');
const app = express();
const ejs = require("ejs");
const path = require('path');
const config = require("./config.js");
const bodyParser = require("body-parser");
const fs = require('fs');
const navbar = require("./navbar.js")(app);
const navbar_admin = require("./navbar_admin.js")(app);
const croxydb = require("croxydb");
var cookieParser = require("cookie-parser");
/////////////////////////////////////////
let admins = [] || "fastuptime@gmail.com";
let adminList = croxydb.fetch("admins");
if (adminList) {
  adminList.forEach((admin) => {
    admins.push(admin.email);
  });
}
/////////////////////////////////////////
let checkAuthAdmin = (req, res, next) => {
  if (req.cookies.userMail && req.cookies.userPassword) {
    hesap.findOne({
      userMail: req.cookies.userMail,
      password: req.cookies.userPassword
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        if (data.userMailVerified == true) {
          if (admins.includes(data.userMail)) {
            next();
          } else res.redirect("/?message=Bu sayfaya erişim yetkiniz yok.&error=true");
        } else {
          res.redirect("/?message=Email adresinizi doğrulayın.&error=true");
        }
      } else {
        res.redirect("/login?message=Eposta adresi veya şifre yanlış.&error=true");
      }
    }
    );
  } else {
    res.redirect("/login");
  }
};
/////////////////////////////////////////
const hesap = require('./www/mongoDB/models/hesap.js');
const confirmCode = require('./www/mongoDB/models/confirmCode.js');
const balanceLoad = require('./www/mongoDB/models/bakiye_yukle.js');
let siparis = require('./www/mongoDB/models/siparis_default.js');
/////////////////////////////////////////
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
/////////////////////////////////////////
let checkAuth = (req, res, next) => {
  if (req.cookies.userMail && req.cookies.userPassword) {
    hesap.findOne({
      userMail: req.cookies.userMail,
      password: req.cookies.userPassword
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        if (data.userMailVerified == true) {
          next();
        } else {
          res.redirect("/?error=true&message=Email adresinizi doğrulayın.");
        }
      } else {
        res.redirect("/login?error=true&message=Eposta adresi veya şifre yanlış.");
      }
    }
    );
  } else {
    res.redirect("/login");
  }
};

let checkBan = (req, res, next) => {
  if (req.cookies.userMail && req.cookies.userPassword) {
    hesap.findOne({
      userMail: req.cookies.userMail,
      password: req.cookies.userPassword
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        if (data.userBan.status == true) {
          res.redirect("/ban?message=Hesabınız engellenmiştir.");
        } else {
          next();
        }
      } else {
        res.redirect("/login?message=Eposta adresi veya şifre yanlış.");
      }
    }
    );
  } else {
    res.redirect("/login");
  }
};


//////////////////////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
/////////////////////////////////////////
require('./servisler_guncelle.js').call();
/////////////////////////////////////////
app.set('view engine', 'ejs');
app.set('views', './www');
app.use("/material", express.static(path.join(__dirname, "www/material")));
app.use("/anasayfa", express.static(path.join(__dirname, "www/index-pages/index")));
app.use("/dashboard-material", express.static(path.join(__dirname, "www/dashboard")));
app.use("/dash_assets", express.static(path.join(__dirname, "www/dashboard/")));
app.use('/robots.txt', function (req, res, next) {
    res.type('text/plain')
    res.send("User-agent: *\nAllow: /"); 
});
app.get('/robots.txt', function (req, res, next) {
    res.type('text/plain')
    res.send("User-agent: *\nAllow: /"); 
});
/////////////////////////////////////////
app.use(function (req, res, next) {
  let black_list_url = [
    "/dashboard",
    "/",
    "/login",
    "/register",
    "/register-verify",
    "/new_order",
    "/my_orders",
    "/terms",
  ];
  if(!config.maintenance) return next();
  if(!black_list_url.includes(req.url)) return next();
  if(!req.url == "/maintenance") return next();
  if(req.cookies.userMail) {
    if(admins.includes(req.cookies.userMail)) return next();
    res.redirect("/maintenance");
  }
  res.redirect("/maintenance");
});
/////////////Post Routes Load/////////////
require("./www/routes/register.js")(app, hesap);
require("./www/routes/login.js")(app, hesap);
require("./www/routes/register-verify.js")(app, hesap);
require("./www/routes/index.js")(app, hesap);
require("./www/routes/dashboard.js")(app, checkAuth, checkBan, hesap, siparis, navbar);
require("./www/routes/yeni_siparis.js")(app, checkAuth, checkBan, checkAuthAdmin, hesap, siparis, navbar, navbar_admin);
require("./www/routes/balance_load.js")(app, checkAuth, hesap, balanceLoad, navbar);
require("./www/routes/admin_panel.js")(app, checkAuth, checkAuthAdmin, hesap, navbar_admin);
require("./www/routes/api_agi.js")(app, hesap, siparis);

require("./www/routes/404-ve-diger.js")(app, checkAuth, checkBan, hesap, confirmCode, navbar);
/////////////////////////////////////////
app.use('/robots.txt', function (req, res, next) {
        res.type('text/plain')
        res.send("User-agent: *\nAllow: /"); 
  });
/////////////////////////////////////////
app.listen(80, () => {
    console.log('Sunucu açıldı port: 80');
});
//////////////////////////////////////