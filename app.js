let User = require(__dirname + "/models/user");
const userDAO = require(__dirname + "/dao/userDAO");
const itemDAO = require(__dirname + "/dao/itemDAO");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const _ = require("lodash");

const app = express();

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
  console.log(req.user)
  if (req.isAuthenticated()){
    res.redirect("/pantries");
  }else res.render("index");
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
          passport.authenticate("local")(req, res, () => {
            res.redirect("/pantries");
          })
        }
      })
    }
  });
});

app.get("/pantries", (req, res)=>{
  if (req.isAuthenticated()){
    if (req.user.pantries.length === 0){
      userDAO.insertDefaultPantries(req.user, items=>{
          res.render("pantries", {user: req.user.username, pantries: items});
      });
    } else{
      res.render("pantries", {user: req.user.username, pantries: req.user.pantries});
    }
  } else {
    res.redirect("/");
   }
});

app.get("/pantries/:list_name", (req, res)=>{
  console.log(req.query);
  const list = {
    name: req.query.pantryButton,
    description: req.query.description,
    id: req.query.listID
  }

  itemDAO.findByPantry(list.id, (docs =>{
      console.log(docs);
      res.render("items", {pantry: list, items: docs});
  }));

});

app.post("/pantries/:list_name", (req, res)=>{
  pantryID = req.body.pantryId;
  name = req.body.itemName;
  quantity = req.body.itemQuantity;

  itemDAO.insertOne(name, quantity, pantryID, item=>{

  });

  res.redirect("/pantries/" + req.params.list_name);
})

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
})
