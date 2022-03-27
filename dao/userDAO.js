const bcrypt = require("bcrypt");
const path = require("path");

const model = require(path.join(__dirname, "../models/user"));

let User = model.User;

exports.findUser =
 function (userName, password, fn){
  User.findOne({login: userName}, (err, foundUser) => {
    if (err){
      console.log(err);
    }
    // }else{
    //   if (foundUser){
    //     bcrypt.compare(password, foundUser.password, (err, result)=>{
    //       if (result === true){
    //         res.render("pantries", {user: userName});
    //       }
    //     });
    //   }
    // }
    fn(foundUser);
  });
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
