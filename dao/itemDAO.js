const path = require("path");
const Item = require(path.join(__dirname, "../models/items"));

module.exports.findByPantry =
  (pantryId, fn) =>{
    Item.find({pantry_id: pantryId}, (err, docs)=>{
      if (err) console.log(err);
      else {
        fn(docs);
      }
    })
  }

module.exports.insertOne =
  (_name, _quantity, _pantry_id, fn) => {
    let item = new Item({
      name: _name,
      quantity: _quantity,
      pantry_id: _pantry_id
    });

    item.save();

    fn(item);
  }
