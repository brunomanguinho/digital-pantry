const bcrypt = require("bcrypt");
const path = require("path");
const model = require(path.join(__dirname, "../models/user"));
const saltRounds = 10;

let User = model.User;

exports.findUser =
 function (userName, fn){
  User.findOne({login: userName}, (err, foundUser) => {
    if (err){
      console.log(err);
    }
    fn(foundUser);
  });
}

exports.registerUser =
  function (_userName, _password, fn){
    bcrypt.hash(_password, saltRounds, (err, hash)=>{
      if (err){
        console.log(err);
      } else {
        const user = new User({
          login: _userName,
          password: hash
        });

        user.save();

        fn(user);
      }
    })
  }

exports.loginSuccess =
function (user, password, fn){
  bcrypt.compare(password, user.password, (err, result)=>{
    if (err){
      console.log(err)
    }

    fn(result);
  })
}
