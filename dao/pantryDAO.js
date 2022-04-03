const path = require("path");
const Pantry = require(path.join(__dirname, "../models/pantry"));

exports.insertDefaultPantries =
  (fn)=>{
    const pantry = new Pantry({
      name: "Pantry",
      description: "Things that go on your pantry...",
      image: "images/pantry.png"
    });

    const fruits = new Pantry({
      name: "Fruits",
      description: "Things that go on your fruit bowl...",
      image: "images/fruits.png"
    });

    const frozen = new Pantry({
      name: "Frozen",
      description: "Things that go on your freezes...",
      image: "images/frozen.png"
    });

    const hygiene = new Pantry({
      name: "Hygiene",
      description: "Things that go on your bathroom...",
      image: "images/bathroom.jpg"
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
