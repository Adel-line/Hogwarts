"use strict";

//student array
let allStudents = [];
//search bar
const searchBar = document.querySelector("#searchBAR");
//filtered studetns
let allStudentsFiltered = [];
//expelled students
let expelledStudents = [];

// creat prototype
const Students = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  bloodType: "",
  image: "",
  house: "",
  expelled: false,
  prefect: "",
};

init();

function init() {
  console.log("Init");
  //
  loadJSON();
  // filter buttons
  document
    .querySelector("[data-filter=Slytherin]")
    .addEventListener("click", slytherinButton);
  document
    .querySelector("[data-filter=Ravenclaw]")
    .addEventListener("click", ravenclawButton);
  document
    .querySelector("[data-filter=Hufflepuff]")
    .addEventListener("click", hufflepuffButton);
  document
    .querySelector("[data-filter=Gryffindor]")
    .addEventListener("click", gryffindorButton);
  document
    .querySelector("[data-filter=bloodType]")
    .addEventListener("click", bloodTypeButton);
  document
    .querySelector("[data-filter=prefect]")
    .addEventListener("click", prefectButton);
  document
    .querySelector("[data-filter=expelled]")
    .addEventListener("click", expelledButton);
  document
    .querySelector("[data-filter=all]")
    .addEventListener("click", allButton);
  //sort buttons
  document
    .querySelector("[data-filter=name]")
    .addEventListener("click", sortFirstName);
  document
    .querySelector("[data-filter=house]")
    .addEventListener("click", sortHouseName);
}

function loadJSON() {
  //
  console.log("Is Json Here");
  //
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((r) => r.json())
    .then((data) => {
      prepareObject(data);
    });
}

// prepare objects for listing
function prepareObject(data) {
  //
  console.log("Prepare Objects");
  //
  data.forEach((jsonObject) => {
    // new object created with cleaned data
    const student = Object.create(Students);

    // prefect student
    student.prefect = false;

    // remove blanks
    const space = jsonObject.fullname.trim();
    // split name
    const firstSpace = space.indexOf(" ");
    const secondSpace = space.lastIndexOf(" ");

    // first name
    if (firstSpace == -1) {
      student.firstName = space;
    } else {
      student.firstName = space.substring(0, firstSpace);
    }
    // get first name (with UPPERCASE, important for Sorting)
    student.firstName =
      student.firstName.substring(0, 1).toUpperCase() +
      student.firstName.substring(1).toLowerCase();

    // lastName
    if (secondSpace == -1) {
      student.lastName = "";
    } else {
      student.lastName = space.substring(secondSpace + 1);
    }

    const hyphen = student.lastName.indexOf("-");

    if (hyphen == -1) {
      student.lastName =
        student.lastName.substring(0, 1).toUpperCase() +
        student.lastName.substring(1).toLowerCase();
    } else {
      student.lastName =
        student.lastName.substring(0, 1).toUpperCase() +
        student.lastName.substring(1, hyphen + 1).toLowerCase() +
        student.lastName.substring(hyphen + 1, hyphen + 2).toUpperCase() +
        student.lastName.substring(hyphen + 2).toLowerCase();
    }

    // middleName
    student.middleName = space.substring(firstSpace, secondSpace).trim();

    if (student.middleName.substring(0, 1) == `"`) {
      student.nickName = student.middleName;
      student.middleName = "";
      student.nickName = student.nickName.split('"').join("");
      student.nickName =
        student.nickName.substring(0, 1).toUpperCase() +
        student.nickName.substring(1).toLowerCase();
    } else {
      student.nickName = "";
      student.middleName =
        student.middleName.substring(0, 1).toUpperCase() +
        student.middleName.substring(1).toLowerCase();
    }

    // gender
    student.gender = jsonObject.gender.trim();
    student.gender =
      student.gender.substring(0, 1).toUpperCase() +
      student.gender.substring(1).toLowerCase();

    // house
    student.house = jsonObject.house.trim();
    student.house =
      student.house.substring(0, 1).toUpperCase() +
      student.house.substring(1).toLowerCase();

    if (hyphen == -1) {
      student.image =
        student.lastName.toLowerCase() +
        "_" +
        student.firstName.substring(0, 1).toLowerCase() +
        ".png";
    } else {
      student.image =
        student.lastName.substring(hyphen + 1).toLowerCase() +
        `_${student.firstName.substring(0, 1).toLowerCase()}` +
        `.png`;
    }

    // image
    if (student.lastName == false) {
      student.image = "hogwarts/png";
    } else if (student.lastName === "Patil") {
      student.image =
        student.lastName.toLowerCase() +
        "_" +
        student.firstName.toLowerCase() +
        ".png";
    } else if (hyphen == -1) {
      student.image =
        student.lastName.toLowerCase() +
        "_" +
        student.firstName.substring(0, 1).toLowerCase() +
        ".png";
    } else {
      student.image =
        student.lastName.substring(hyphen + 1).toLowerCase() +
        `_${student.firstName.substring(0, 1).toLowerCase()}` +
        `.png`;
    }

    //set students to neutral
    student.expelled = false;
    student.prefect = false;
    student.inquisitor = false;

    //set students for blood type
    fetch("https://petlatkea.dk/2021/hogwarts/families.json")
      .then((r) => r.json())
      .then((data) => {
        student.bloodType = checkBloodType(data);
        //
        console.log(data);
      });

    function checkBloodType(data) {
      //
      console.log("Show blood type");
      //
      if (data.pure.includes(student.lastName) == true) {
        return "pure";
      } else if (data.half.includes(student.lastName) == true) {
        return "half";
      } else {
        return "muggle";
      }
    }

    allStudents.unshift(student);
  });
  displayList();
}

// display list
function displayList() {
  console.log("Display list");
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  //
  countingHOUSE();
  document.querySelector("#numberSTUDall").textContent = allStudents.length;
  // build a new list
  allStudents.forEach(displayStudents);
  console.table(allStudents);
}

// countin for each house
function countingHOUSE() {
  const slyStudent = allStudents.filter((student) => {
    if (student.house === "Slytherin") {
      return true;
    } else {
      return false;
    }
  });
  const ravStudent = allStudents.filter((student) => {
    if (student.house === "Ravenclaw") {
      return true;
    } else {
      return false;
    }
  });
  const hufStudent = allStudents.filter((student) => {
    if (student.house === "Hufflepuff") {
      return true;
    } else {
      return false;
    }
  });
  const gryStudent = allStudents.filter((student) => {
    if (student.house === "Gryffindor") {
      return true;
    } else {
      return false;
    }
  });
  document.querySelector("#slyt").textContent = slyStudent.length;
  document.querySelector("#gryf").textContent = gryStudent.length;
  document.querySelector("#huff").textContent = hufStudent.length;
  document.querySelector("#rave").textContent = ravStudent.length;
}

//DISPLAY STUDENT

function displayStudents(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);
  //open modal
  clone
    .querySelector("[data-field=first]")
    .addEventListener("click", clickStudent);
  // set clone data
  clone.querySelector("[data-field=first]").textContent = student.firstName;
  clone.querySelector("[data-field=last]").textContent = student.lastName;
  clone.querySelector("[data-field=House]").textContent = student.house;
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
  //
  // TRIGGER MODAL
  function clickStudent() {
    console.log("clickStudent");
    showModal(student);
  }
}

// SEARCH FOR STUDENT
searchBar.addEventListener("keyup", (e) => {
  //
  console.log("Show search result");
  const searchString = e.target.value;
  const filteredStudents = allStudents.filter((student) => {
    return (
      student.firstName.includes(searchString) ||
      student.house.includes(searchString)
    );
  });
  displayListwithFilter(filteredStudents);
});

// Show MODAL + Prefect + Blood + Expell (not working);

function showModal(student) {
  console.log("Show Modal");
  console.log(student);
  const modal = document.querySelector(".modal");
  modal.classList.remove("hide");
  //
  modal.querySelector(".modalContent").classList.remove("Slytherin");
  modal.querySelector(".modalContent").classList.remove("Gryffindor");
  modal.querySelector(".modalContent").classList.remove("Hufflepuff");
  modal.querySelector(".modalContent").classList.remove("Ravenclaw");

  //
  modal.querySelector(".modalImage").src = `images/${student.image}`;
  modal.querySelector(".modalStudentName").textContent =
    student.firstName + " " + student.middleName + " " + student.lastName;
  modal.querySelector(".modalGender").textContent = "Gender: " + student.gender;
  modal.querySelector(".modalHouse").textContent = student.house;
  //
  modal.querySelector(".modalContent").classList.add(student.house);
  modal.querySelector(".modalBlood").textContent =
    "Blood Status: " + student.bloodType;
  modal.querySelector(".modalPrefect").textContent = "Prefect: " + "yes/no";
  // condition for display
  if (student.prefect) {
    modal.querySelector(".modalPrefect").textContent = "Prefect: " + "Yes";
  } else {
    modal.querySelector(".modalPrefect").textContent = "Prefect: " + "No";
  }
  //
  modal.querySelector(".modalExpelled").textContent = "Expelled: " + "yes/no";
  // condition for display
  if (student.expelled) {
    modal.querySelector(".modalExpelled").textContent = "Expelled: " + "Yes";
  } else {
    modal.querySelector(".modalExpelled").textContent = "Expelled: " + "No";
  }
  //
  modal.querySelector(".modalMember").textContent =
    "Inquisitorial Squad: " + "is/not member";
  //display conditions
  if (student.member) {
    modal.querySelector(".modalMmember").textContent =
      "Inquisitorial Squad: " + "Is a member";
  } else {
    modal.querySelector(".modalMember").textContent =
      "Inquisitorial Squad: " + "Is not a member";
  }

  //
  //CREATING PREFECTS
  if (student.prefect == true) {
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  }
  document
    .querySelector("#prefect")
    .addEventListener("click", makeStudentPrefect);
  //
  console.log("Make Prefect");

  function makeStudentPrefect() {
    //
    console.log("Make students prefects");
    document
      .querySelector("#prefect")
      .removeEventListener("click", makeStudentPrefect);

    if (student.house === "Slytherin") {
      prefectS(student);
    } else if (student.house === "Ravenclaw") {
      prefectR(student);
    } else if (student.house === "Gryffindor") {
      prefectG(student);
    } else if (student.house === "Hufflepuff") {
      prefectH(student);
    }
  }
  // EXPELL STUDENTS
  //   modal.querySelector("#expell").addEventListener("click", expellStudent);
  //   function expellStudent () {
  //     //
  //     console.log ("Expell this student");
  //     modal.querySelector("#expell").removeEventListener("click", expellStudent);
  //     student.expelled = true ;
  //     allStudents = allStudents.filter(expeling) ;
  //     allStudentsFiltered = allStudentsFiltered.filter(expeling);
  //     expelledStudents.unshift(student);
  //     console.log("this is the expeld students");
  //     console.log(expelledStudents);
  //     displayListwithFilter(allStudentsFiltered);
  //     student.prefect = false ;
  //  }
  //
  document.querySelector(".close").addEventListener("click", closeModal);
  //
  function closeModal() {
    console.log("Closing Modal");
    document.querySelector(".modal").classList.add("hide");
    document.querySelector(".modalContent").classList.remove(student.house);
    //  document.querySelector("#expell").removeEventListener("click", expelledButton);
  }
}

// DISPLAY FILTERED RESULTS
function displayListwithFilter(filtered) {
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  filtered.forEach(displayStudents);
}
//FILTER BUTTONS
//slytherin
function slytherinButton() {
  //
  console.log("All Slytherin students");
  //
  const onlySlytherin = allStudents.filter(isSlytherin);
  allStudentsFiltered = onlySlytherin;
  displayListwithFilter(onlySlytherin);
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

//ravenclaw
function ravenclawButton() {
  //
  console.log("All RavenClaw students");
  //
  const onlyRavenclaw = allStudents.filter(isRavenclaw);
  allStudentsFiltered = onlyRavenclaw;
  displayListwithFilter(onlyRavenclaw);
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

//hufflepuff
function hufflepuffButton() {
  //
  console.log("All Hufflepuff students");
  //
  const onlyHufflepuff = allStudents.filter(isHufflepuff);
  allStudentsFiltered = onlyHufflepuff;
  displayListwithFilter(onlyHufflepuff);
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

//gryffindor
function gryffindorButton() {
  //
  console.log("All Gryffindor students");
  //
  const onlyGryffindor = allStudents.filter(isGryffindor);
  allStudentsFiltered = onlyGryffindor;
  displayListwithFilter(onlyGryffindor);
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

//blood type
function bloodTypeButton() {
  //
  console.log("All bloodtype students");
  //
  const onlyBloodType = allStudents.filter(isBloodType);
  allStudentsFiltered = onlyBloodType;
  displayListwithFilter(onlyBloodType);
}

function isBloodType(student) {
  if (student.blood === "bloodType") {
    return true;
  } else {
    return false;
  }
}

//prefect
function prefectButton() {
  //
  console.log("All prefect students");
  //
  const onlyprefects = allStudents.filter(isPrefect);
  allStudentsFiltered = onlyprefects;
  displayListwithFilter(onlyprefects);
}

function isPrefect(student) {
  if (student.house === "prefect") {
    return true;
  } else {
    return false;
  }
}
// expelling -- NOT WORKING -- EXPELLING ALL STUDENTS AT ONCE
function expeling(student) {
  console.log("Expell this student");
  if (student.expelled == true) {
    return false;
  } else {
    return true;
  }
}

function expelledButton() {
  const onlyExpelled = allStudents.filter(isExpelled);
  allStudentsFiltered = onlyExpelled;
  displayListwithFilter(onlyExpelled);
}

function isExpelled() {
  if (student.expelled === true) {
    return true;
  } else {
    return false;
  }
}

function expelledButton() {
  console.log("expelled Button");
  const onlyExpelled = allStudents.filter(isExpelled);
  allStudentsFiltered = onlyExpelled;
  displayListwithFilter(onlyExpelled);
}

function isExpelled(student) {
  if (student.expelled === "Expelled") {
    return true;
  } else {
    return false;
  }
}

//ALL STUDENTS BUTTON
function allButton() {
  //
  console.log("All students");
  //
  const onlyAll = allStudents.filter(isAllstudents);
  displayList(loadJSON);
  displayList(onlyAll);
}

function isAllstudents(student) {
  if (student.all === "all") {
    return true;
  } else {
    return false;
  }
}

// SORTING FUNCTIONs

//first name
function sortFirstName() {
  allStudents.sort(compareName);
  console.log(allStudentsFiltered);
  displayListwithFilter(allStudents);
}
//house
function sortHouseName() {
  allStudents.sort(compareHouse);
  console.log(allStudentsFiltered);
  displayListwithFilter(allStudents);
}

function compareName(a, b) {
  if (a.firstName < b.firstName) {
    return 0;
  } else {
    return 1;
  }
}

function compareHouse(a, b) {
  if (a.house < b.house) {
    return 0;
  } else {
    return 1;
  }
}

function displayListwithFilter(filtered) {
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  filtered.forEach(displayStudents);
}

//MAKING PREFECTS FOR FUNCTIONS

// PREFECTS SLYTHERIN
function prefectS(student) {
  const prefS = allStudents.filter((student) => {
    if (student.prefect && student.house === "Slytherin") {
      return true;
    } else {
      return false;
    }
  });
  const modal = document.querySelector(".modal");
  console.log("Prefects from Slyth");
  console.log(prefS);

  let checkPrefect = checkHouse(prefS);
  console.log(checkPrefect);

  if (student.prefect == true) {
    console.log(student);
    student.prefect = false;
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  } else if (checkPrefect == true) {
    student.prefect = true;
    console.log(student);
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  } else if (checkPrefect == true) {
    alert("You do not have the permission");
  }
}

// PREFECTS Ravenclaw
function prefectR(student) {
  const prefR = allStudents.filter((student) => {
    if (student.prefect && student.house === "Ravenclaw") {
      return true;
    } else {
      return false;
    }
  });

  const modal = document.querySelector(".modal");
  console.log("Prefects from Ravenclaw");
  console.log(prefR);

  let checkPrefect = checkHouse(prefR);
  console.log(checkPrefect);

  if (student.prefect == true) {
    console.log(student);
    student.prefect = false;
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  } else if (checkPrefect == true) {
    student.prefect = true;
    console.log(student);
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  } else if (checkPrefect == true) {
    alert("You do not have the permission");
  }
}

// PREFECTS HUfflepuff
function prefectH(student) {
  const prefectH = allStudents.filter((student) => {
    if (student.prefect && student.house === "Hufflepuff") {
      return true;
    } else {
      return false;
    }
  });
  const modal = document.querySelector(".modal");
  console.log("Prefects from Hufflepuff");
  console.log(prefectH);

  let checkPrefect = checkHouse(prefectH);
  console.log(checkPrefect);

  if (student.prefect == true) {
    console.log(student);
    student.prefect = false;
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  } else if (checkPrefect == true) {
    student.prefect = true;
    console.log(student);
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  } else if (checkPrefect == true) {
    alert("You do not have the permission");
  }
}

// PREFECTS GRYFFINDOR
function prefectG(student) {
  const prefG = allStudents.filter((student) => {
    if (student.prefect && student.house === "Gryffindor") {
      return true;
    } else {
      return false;
    }
  });
  const modal = document.querySelector(".modal");
  console.log("Prefects from Slyth");
  console.log(prefG);

  let checkPrefect = checkHouse(prefG);
  console.log(checkPrefect);

  if (student.prefect == true) {
    console.log(student);
    student.prefect = false;
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  } else if (checkPrefect == true) {
    student.prefect = true;
    console.log(student);
    modal.querySelector(".modalPrefect").textContent =
      "Prefect: " + student.prefect;
  } else if (checkPrefect == true) {
    alert("You do not have the permission");
  }
}

// CHECK HOUSE

function checkHouse(list) {
  console.log("Check the house");
  console.log(list.length);
  //
  if (list.length == 0) {
    return true;
  } else if (list.length == 1) {
    return true;
  } else if (list.length == 2) {
    return false;
  } else {
    return false;
  }
}
