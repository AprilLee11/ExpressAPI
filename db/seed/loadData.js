var fs = require("fs");
var mongoose = require("mongoose");
var Patient = require("./models/Patient");
var Drug = require("./models/Drug");

var mongoDB = "mongodb://localhost/mehn_drug";
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
mongoose.set("debug", true);
mongoose.set("useFindAndModify", false);

(async function insertData(tasker) {
  var contents = fs.readFileSync("drug-event-0001-of-0033.json", "utf8");
  var obj = JSON.parse(contents);

  for (item of obj.results) {
    var drugs = item.patient.drug;

    var drugArray = [];

    for (drug of drugs) {
      var drugNameFind;
      try {
        drugNameFind = await Drug.findOne({ name: drug.medicinalproduct });
        if (drugNameFind == null) {
          var name = drug.medicinalproduct;
          var activesubstance;
          if ("activesubstance" in drug == true) {
            activesubstance = drug.activesubstance.activesubstancename;
          }
          var indication;
          if ("drugindication" in drug == true) {
            indication = drug.drugindication;
          }
          var drugInfo = {
            name: name,
            indications: indication,
            activesubstances: activesubstance
          };
          var newDrug = new Drug(drugInfo);
          try {
            var drugSave = await newDrug.save();
            drugArray.push(drugSave._id);
          } catch (err) {
            console.log("ERROR", err.message);
          }
        } else {
          drugArray.push(drugNameFind._id);
          if (drug.drugindication) {
            var indicationFind = await Drug.find({
              _id: drugNameFind._id,
              indications: { $all: [drug.drugindication] }
            }).countDocuments();

            if (indicationFind === 0) {
              var drugIndicationUpdate = await Drug.findByIdAndUpdate(
                drugNameFind._id,
                {
                  $push: { indications: drug.drugindication }
                }
              );
            }
          }

          if (drug.activesubstance.activesubstancename) {
            var activesubstanceFind = await Drug.find({
              _id: drugNameFind._id,
              activesubstances: {
                $all: [drug.activesubstance.activesubstancename]
              }
            }).countDocuments();

            if (activesubstanceFind === 0) {
              var drugActivesubstanceUpdate = await Drug.findByIdAndUpdate(
                drugNameFind._id,
                {
                  $push: {
                    activesubstances: drug.activesubstance.activesubstancename
                  }
                }
              );
            }
          }
        }
      } catch (err) {
        console.log("ERROR", err.message);
      }
    }

    var reactionArray = [];
    for (let reaction of item.patient.reaction) {
      reactionArray.push(reaction.reactionmeddrapt);
    }

    var patientInfo = {
      age: item.patient.patientonsetage,
      gender: item.patient.patientsex,
      reactions: reactionArray,
      drugs: drugArray,
      receivedate: item.receivedate
    };
    var newPatient = new Patient(patientInfo);
    try {
      var patientSave = await newPatient.save();
    } catch (err) {
      console.log("ERROR", err.message);
    }
  }
  try {
    mongoose.connection.close();
  } catch (err) {
    console.log("ERROR", err.message);
  }
})();
