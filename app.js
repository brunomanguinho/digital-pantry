let User = require(__dirname + "/models/user");
const userDAO = require(__dirname + "/dao/userDAO")
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

const app = express();
let loggedUser = null;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: "thisisthefirsttimeauthenticantingbyusingsessions",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const _userName = req.body.username;
  const _password = req.body.password;

  userDAO.findUser(_userName, (foundUser)=>{
    if (foundUser === null){
      console.log("user not found...registering...");

      User.register({username: _userName}, _password, (err, user)=>{
        if (err){
          console.log(err);
          res.redirect("/");
        } else {
          passport.authenticate("local")(req, res, ()=>{
            loggedUser = user;
            res.redirect("/pantries")
          })
        }

      });
    } else {
      console.log("trying to log in...");
      const user = new User({
        username: _userName,
        password: _password
      });

      req.login(user, (err)=>{
        if (err){
          console.log(err);
        } else{
          loggedUser = user;
          console.log(loggedUser);
          passport.authenticate("local")(req, res, ()=>{
            res.redirect("/pantries");
          })
        }
      })
    }
  });
});

app.get("/pantries", (req, res)=>{
  if (req.isAuthenticated()){
    console.log(loggedUser);
    res.render("pantries", {user: loggedUser.username});
  }else {
    res.redirect("/");
  }
})

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
})
