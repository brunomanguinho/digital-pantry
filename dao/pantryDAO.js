const path = require("path");
const Pantry = require(path.join(__dirname, "../models/pantry"));

exports.insertDefaultPantries =
  (fn)=>{
    const pantry = new Pantry({
      name: "Pantry",
      description: "Things that go on your pantry..."
    });

    const fruits = new Pantry({
      name: "Fruits",
      description: "Things that go on your fruit bowl..."
    });

    const frozen = new Pantry({
      name: "Frozen",
      description: "Things that go on your freezes..."
    });

    const hygiene = new Pantry({
      name: "Hygiene",
      description: "Things that go on your bathroom..."
    });

    const items = [pantry, fruits, frozen, hygiene];

    Pantry.insertMany(items, (err, docs)=>{
      if (err){
        console.log(err);
      } else {
        console.log(docs);
        fn(docs);
      }
    });
  }
