//const version = "34c";
//document.getElementById("version").innerHTML = "Version: " + version + " - Created by ML";

const detailsForm = document.getElementById("details-form"),
periodTimes = {
  0: "8:00-9:10",
  1: "9:10-10:30",
  2: "10:55-12:05",
  3: "12:50-2:00",
};

function saveDetails() {
  let object = new Object();
  for (var i = 1; i < formRowIncrement + 1; i++) {
    let inputs = document.getElementsByClassName("inputs-" + i);
    object[i] = new Object();
    object[i].code = inputs[0].value;
    object[i].name = inputs[1].value;
    object[i].link = inputs[2].value;
    object[i].teacher = inputs[3].value;
  };
  console.log(object);
  console.log(JSON.stringify(object));
};

var subject =
function setControl() {

};

function setSession(cell) {
  cell.innerHTML = "He";
};

function enableEditor() {

}



// SUPPORT FOR OLD VERSION
var subject1 = localStorage.getItem("SUBJECT1").replace(/,-/g, ",null").split(","), subject2 = localStorage.getItem("SUBJECT2").replace(/,-/g, ",null").split(","), subject3 = localStorage.getItem("SUBJECT3").replace(/,-/g, ",null").split(","), subject4 = localStorage.getItem("SUBJECT4").replace(/,-/g, ",null").split(","), subject5 = localStorage.getItem("SUBJECT5").replace(/,-/g, ",null").split(","), subject6 = localStorage.getItem("SUBJECT6").replace(/,-/g, ",null").split(","), periods = localStorage.getItem("PERIODS").replace(/-/g, "null").split(",");
var data = {
  subjects: {
    1: {
      code: subject1[0],
      name: subject1[1],
      link: subject1[2],
      teacher: subject1[3],
      periods: [],
    },
    2: {
      code: subject2[0],
      name: subject2[1],
      link: subject2[2],
      teacher: subject2[3],
      periods: [],
    },
    3: {
      code: subject3[0],
      name: subject3[1],
      link: subject3[2],
      teacher: subject3[3],
      periods: [],
    },
    4: {
      code: subject4[0],
      name: subject4[1],
      link: subject4[2],
      teacher: subject4[3],
      periods: [],
    },
    5: {
      code: subject5[0],
      name: subject5[1],
      link: subject5[2],
      teacher: subject5[3],
      periods: [],
    },
    6: {
      code: subject6[0],
      name: subject6[1],
      link: subject6[2],
      teacher: subject6[3],
      periods: [],
    },
  },
  options: new Object(),
};
for (var s = 1; s < 7; s++) {
  for (var p = 0; p < periods.length; p++) {
    if (periods[p] == data.subjects[s].code) {
      data.subjects[s].periods.push(p);
    };
  };
};
if (localStorage["USE-SCODES"]) {data.options["displayCodes"] = true};
if (localStorage["USE-TNAMES"]) {data.options["displayNames"] = true};
if (localStorage["USE-COLOURS"]) {
  data.options["customColours"] = [localStorage.getItem("COLOUR-BG"), localStorage.getItem("COLOUR-TX")];
};
localStorage.setItem("data", JSON.stringify(data));




const sessions = document.getElementsByClassName("sessions");
function layoutTable() {
  for (var s = 1; s <= 6; s++) {
    let subject = data.subjects[s];
    for (var p = 0; p < subject.periods.length; p++) {
      let cell = sessions[subject.periods[p]];
      cell.title = subject.name + " | " + subject.teacher;
      cell.classList.add("valid");
      let a = document.createElement("a");
      a.href = subject.link;
      a.classList.add("session-link");
      cell.appendChild(a);
      let div = document.createElement("div");
      div.innerHTML += "<b>" + subject.name + "</b>";
      if (data.options.hasOwnProperty("displayNames")) {div.innerHTML += "<br>" + subject.teacher};
      if (data.options.hasOwnProperty("displayCodes")) {div.innerHTML += "<br>" + subject.code};
      a.appendChild(div);
    };
  };
};
layoutTable()
