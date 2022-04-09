const path = require("path");
const Pantry = require(path.join(__dirname, "../models/pantry"));

exports.findById =
  (id, fn)=>{
    Pantry.findById(id, (err, pantry) => {
      if (err){
        console.log(err);
      } else fn(pantry);
    })
  }

exports.insertItem =
  (pantry, item)=>{
    pantry.items.push(item);
    pantry.save();
  }

exports.insertDefaultPantries =
  (fn)=>{
    const pantry = new Pantry({
      name: "Pantry",
      description: "Things that go on your pantry...",
      image: "images/pantry.png",
      items: []
    });

    const fruits = new Pantry({
      name: "Fruits",
      description: "Things that go on your fruit bowl...",
      image: "images/fruits.png",
      items: []
    });

    const frozen = new Pantry({
      name: "Frozen",
      description: "Things that go on your freezer...",
      image: "images/frozen.png",
      items: []
    });

    const hygiene = new Pantry({
      name: "Hygiene",
      description: "Things that go on your bathroom...",
      image: "images/bathroom.jpg",
      items: []
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
