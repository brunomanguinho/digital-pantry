let User = require(__dirname + "/models/user");
let Pantry = require(__dirname + "/models/pantry");
const userDAO = require(__dirname + "/dao/userDAO");
const pantryDAO = require(__dirname + "/dao/pantryDAO");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const _ = require("lodash");

const app = express();

let curPantry;

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

let gPantries = [];
let gPantriesItems = [];

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
      console.log("inserting default pantries...");
      userDAO.insertDefaultPantries(req.user, items=>{
          res.render("pantries", {user: req.user.username, pantries: items});
      });
    } else{
      res.render("pantries", {user: req.user.username, pantries: req.user.pantries});
      gPantries = req.user.pantries;
    }
  } else {
    res.redirect("/");
   }
});

app.get("/pantries/:list_name", (req, res)=>{
  let list;

  if (Object.keys(req.query).length !== 0){
    list = {
      name: req.query.pantryButton,
      description: req.query.description,
      id: req.query.listID
    }
  }else {
    list = {
      name: curPantry.name,
      description: curPantry.description,
      id: curPantry._id
    }
  }


  pantryDAO.findById(list.id, (pantry) => {
    if (pantry !== null){
      curPantry = pantry;
      res.render("items", {pantry: list, items: pantry.items})
    }else {
      console.log("could not find a pantry with id: " + list.id);
    }
  })

});

app.post("/pantries/:list_name", (req, res)=>{
  const item = {
    name: req.body.itemName,
    amount: req.body.itemAmount
  }

  pantryDAO.insertItem(curPantry, item);

  res.redirect("/pantries/" + req.params.list_name);
});

app.post("/itemDelete", (req, res) => {
  pantryDAO.deleteItemById(req.body.pantryID, req.body.itemID);

  res.redirect("/pantries/" + req.body.listName)
});

app.post("/itemEdit", (req, res)=>{
  console.log(req.body);
  pantryDAO.editItemById(req.body.pantryID, req.body.itemID, req.body.itemAmount);

  res.redirect("pantries/" + req.body.listName);
})

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
})
