const path = require("path");
const User = require(path.join(__dirname, "../models/user"));
const pantryDAO = require("./pantryDAO");

exports.insertDefaultPantries =
  function (user, fn){
    pantryDAO.insertDefaultPantries(items=>{
      user.pantries = items;
      user.save();

      fn(items);
    });
  }

exports.findUser =
 function (userName, fn){
  User.findOne({username: userName}, (err, foundUser) => {
    if (err){
      console.log(err);
    }
    fn(foundUser);
  });
}

// exports.registerUser =
//   function (_userName, _password, fn){
//     bcrypt.hash(_password, saltRounds, (err, hash)=>{
//       if (err){
//         console.log(err);
//       } else {
//         const user = new User({
//           username: _userName,
//           password: hash
//         });
//
//         user.save();
//
//         fn(user);
//       }
//     })
//   }
//
// exports.loginSuccess =
// function (user, password, fn){
//   bcrypt.compare(password, user.password, (err, result)=>{
//     if (err){
//       console.log(err)
//     }
//
//     fn(result);
//   })
// }
