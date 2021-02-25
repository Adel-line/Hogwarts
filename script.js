"use strict";

//student array
const allStudents = [];
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
  image: "",
  house: "",
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
    allStudents.unshift(student);
  });
  displayList();
}

function displayList() {
  console.log("Display list");
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudents);
  console.table(allStudents);
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
  // clone.querySelector("[data-field=middle]").textContent = student.middleName;
  clone.querySelector("[data-field=last]").textContent = student.lastName;
  // clone.querySelector("[data-field=nick]").textContent = student.nickName;
  // clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=House]").textContent = student.house;
  // clone.querySelector("[data-field=img]").src = `images/${student.image}`;

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

// MODAL

function showModal(student) {
  console.log("Show Modal");
  //
  console.log(student);
  //
  // document.querySelector(".modalContent").classList.remove("modalhide");
  const modal = document.querySelector("#modal");
  //
  modal.querySelector(".modalStudentName").textContent =
    student.firstName + " " + student.middleName + " " + student.lastName;
  modal.querySelector(".modalHouse").textContent = student.house;
  modal.querySelector(".modalGender").textContent = "Gender: " + student.gender;
  modal.querySelector(".modalImage").src = `images/${student.image}`;
  modal.querySelector(".modalEmblem").src = `emblems/hogwarts.png`;
  modal.querySelector(".modalPrefect").textContent =
    "Prefect: " + "is/not prefect";
  modal.querySelector(".modalColor").classList.add(student.house);
  modal.querySelector(".modalExpelled").textContent =
    "Expelled: " + "is/not expelled";
  // modal.querySelector(".modalMember").textContent =
  //   "Member of Inquisitorial Squad: " + "is/not member";
  // modal.querySelector(".modalBloodType").textContent =
  //   "Blood Status: " + "blood type";
  // closeModal();
  modal.querySelector(".expell").addEventListener("click", expellStudent);
  modal.querySelector(".prefect").addEventListener("click", makePrefect);
  //
  modal.classList.remove("hide");
  document.querySelector(".close").addEventListener("click", closeModal);
  //
  function closeModal() {
    document.querySelector(".modalContent").classList.add("hide");
    document.querySelector(".modalCotent").classList.remove(student.house);
  }
}

// display filtered results
function displayListwithFilter(filtered) {
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  filtered.forEach(displayStudents);
}
//filter buttons

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
  if (student.house === "bloodType") {
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

//ALL STUDENTS BUTTON
function allButton() {
  //
  console.log("All students");
  //
  const allStudentsBut = allStudents.filter(isAllStudents);
  allStudentsFiltered = allStudentsBut;
  displayListwithFilter(allStudentsBut);
}

function isAllStudents(student) {
  if (student.house === "all") {
    return true;
  } else {
    return false;
  }
}

// SORTING FUNCTIONs

function sortFirstName() {
  allStudents.sort(compareName);
  console.log(allStudentsFiltered);
  displayListwithFilter(allStudents);
}

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

//Expelling Students

function expelledButton() {
  // const onlyExpelled = allStudents.filter(isExpelled);
  console.log("expelled Button");
  const onlyExpelled = allStudentsExpelled;
  allStudentsFiltered = onlyExpelled;
  displayListFiltered(onlyExpelled);
}

function isExpelled(student) {
  if (student.expelled === "Expelled") {
    return true;
  } else {
    return false;
  }
}

function allButton() {
  const onlyAll = allStudents.filter(isAll);
  displayList(loadJSON);
  displayList(onlyAll);
}

function isAll(student) {
  if (student.all === "all") {
    return true;
  } else {
    return false;
  }
}

//
function makePrefect() {
  console.log("Make student Prect");
}

//
function expellStudent() {
  console.log("Expell this student");
  //
  // modal.querySelector(".expell").removeEventListener("click", expellStudent);
  // student.expelled = true;
  // allStudents = allStudentsFiltered.filter(expelled);
  // allStudentsFiltered = allStudentsFiltered.filter(expelled);
  // expelledStudents.unshift(student);
  // console.log("this is the expeld students");
  // console.log(allStudentsExpeld);
  // displayListFiltered(allStudentsFiltered);
}
