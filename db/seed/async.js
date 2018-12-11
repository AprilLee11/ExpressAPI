var Tasks = (function() {
  return {
    calAge(birthYear) {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`Calculate age...${2018 - birthYear}`);
          resolve(2018 - birthYear);
        }, 2000);
      });
    },

    calRet(age) {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`Calculate retirement...${70 - age}`);
          resolve(70 - age);
        }, 2000);
      });
    },

    bringWine(name) {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`Give Wine to...${name}`);
          resolve(true);
        }, 5000);
      });
    },

    bringBeer(name) {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`Give Beer to...${name}`);
          resolve(true);
        }, 5000);
      });
    }
  };
})();

(async function task(tasker) {
  var persons = [
    { name: "A", gender: "F", birthYear: 1955 },
    { name: "B", gender: "M", birthYear: 1970 },
    { name: "C", gender: "F", birthYear: 1990 }
  ];
  var newPersons = [{ name: "D" }, { name: "E" }];

  for (let person of persons) {
    person.age = await tasker.calAge(person.birthYear);
    person.retirement = await tasker.calRet(person.age);
    if (person.age > 20) {
      if (person.retirement < 10) {
        person.hasWine = await tasker.bringWine(person.name);
      } else {
        person.hasBeer = await tasker.bringBeer(person.name);
      }
    }
    newPersons.push(person);
  }

  for (let person of newPersons) {
    console.log(person);
  }
})(Tasks);
