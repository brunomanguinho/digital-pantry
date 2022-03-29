var User = require(__dirname + "/models/user");
const userDAO = require(__dirname + "/dao/userDAO")
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var isUserLoggedIn = false;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  userDAO.findUser(userName, (foundUser)=>{
    if (foundUser === null){
      console.log("user not found...registering...");

      userDAO.registerUser(userName, password, (user)=>{
        if (user !== null){
          isUserLoggedIn = true;
          res.render("pantries", {user: user.login})
        }
      });
    } else {
      userDAO.loginSuccess(foundUser, password, (success)=>{
        if (success){
          //res.render("pantries", {user: foundUser.login});
          User = foundUser;
          isUserLoggedIn = true;
          res.redirect("/pantries");
        } else {console.log("Invalid password");}
      })
    }
  });
});

app.get("/pantries", (req, res)=>{
  if (!isUserLoggedIn){
    res.redirect("/")
  }else res.render("pantries", {user: User.login});
})

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
})
