require('dotenv').config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'sample.env'});



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});




let personSchema= new mongoose.Schema({
    name: {
    type: String,
    required: true, 
  },
  age: Number,
  favoriteFoods: [String],
});

let Person = mongoose.model('Person',personSchema);


const createAndSavePerson = (done) => {
    const personData = {
    name: "John Doe",
    age: 30,
    favoriteFoods: ["Pizza", "Burger"]
  };

  const johnDoe = new Person(personData);

  johnDoe.save((error, savedPerson) => {
    if (error) {
      return done(error); 
    } else {
      return done(null, savedPerson); 
    }
  });
};

const createManyPeople = (arrayOfPeople, done) => {

// Create multiple people at once
Person.create(arrayOfPeople, (error, createdPeople) => {
  if (error) {
    console.error(error);
    return done(error)
  } else {
    console.log('Created people:', createdPeople);
    return  done(null,createdPeople);
  }
});
};

const findPeopleByName = (personName, done) => {
 Person.find({name:personName},(err,findPeople)=>{
   if(err){
     return done(err);
   }else{
     return done(null,findPeople)
   }
 })
};

const findOneByFood = (food, done) => {
 Person.findOne({favoriteFoods:food}, (err,findfood) => {
    if(err){
      return done(err)
    }else{
      return done(null,findfood)
    }
   });
};

const findPersonById = (personId, done) => {
  Person.findById({_id:personId}, (err,findpersonId) => {
    if(err){
      return done(err)
    }else{
      return done(null,findpersonId)
    }
  })
};

const findEditThenSave = (personId, done) => {
  Person.findById(personId, (err, foundPerson) => {
    if (err) {
      return done(err);
    } else {
      foundPerson.favoriteFoods.push('hamburger');
      foundPerson.save((saveErr, updatedPerson) => {
        if (saveErr) {
          return done(saveErr);
        } else {
          return done(null, updatedPerson);
        }
      });
    }
  });
};



const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  
  Person.findOneAndUpdate({name: personName}, {age: 
    ageToSet}, {new: true}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({_id:personId},(err,removeId)=>{
        if(err) return console.log(err);
        done(null,removeId);
  }) 
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name:nameToRemove}, (err,removeName) => {
    if(err) return console.log(err);
    done(null, removeName);
  });
};


const queryChain = (done) => {
  const foodToSearch = "burrito";

  // Chain the query helpers to build the query
  const query = Person
    .find({ favoriteFoods: foodToSearch }) 
    .sort('name') 
    .limit(2) 
    .select('-age') 
    .exec(); 

  
  query.then((results) => {
    done(null, results);
  }).catch((error) => {
    done(error);
  });
};


/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

 exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;

