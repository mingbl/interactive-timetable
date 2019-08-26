const sessions = document.getElementsByClassName("sessions"),
resizer = document.getElementById("cell-resizer"),
headings = document.getElementsByClassName("table-heading"),
colour1 = document.getElementById("colour-1"), colour2 = document.getElementById("colour-2"),
periodTimes = {0: "8:00-9:10", 1: "9:10-10:30", 2: "10:55-12:05", 3: "12:50-2:00"};

// Retrieve data
if (localStorage["data"]) { // Local Storage
  var data = JSON.parse(localStorage.getItem("data"));
  printData();
  fillInputs();
  setSize();
  setColours();
} else if (localStorage["SUBJECT1"] && localStorage.getItem("SUBJECT1").length > 0) { // Old Version
  var data = new Object();
  let subject1 = localStorage.getItem("SUBJECT1").replace(/,-/g, ",,").split(","), subject2 = localStorage.getItem("SUBJECT2").replace(/,-/g, ",,").split(","), subject3 = localStorage.getItem("SUBJECT3").replace(/,-/g, ",,").split(","), subject4 = localStorage.getItem("SUBJECT4").replace(/,-/g, ",,").split(","), subject5 = localStorage.getItem("SUBJECT5").replace(/,-/g, ",,").split(","), subject6 = localStorage.getItem("SUBJECT6").replace(/,-/g, ",,").split(","), periods = localStorage.getItem("PERIODS").replace(/-/g, "").split(",");
  data.subjects = {
      1: {
        code: subject1[0],
        name: subject1[1],
        link: subject1[2],
        teacher: subject1[3],
      },
      2: {
        code: subject2[0],
        name: subject2[1],
        link: subject2[2],
        teacher: subject2[3],
      },
      3: {
        code: subject3[0],
        name: subject3[1],
        link: subject3[2],
        teacher: subject3[3],
      },
      4: {
        code: subject4[0],
        name: subject4[1],
        link: subject4[2],
        teacher: subject4[3],
      },
      5: {
        code: subject5[0],
        name: subject5[1],
        link: subject5[2],
        teacher: subject5[3],
      },
      6: {
        code: subject6[0],
        name: subject6[1],
        link: subject6[2],
        teacher: subject6[3],
      },
    };
  data.options = new Object();
  data.periods = [];
  for (var c = 0; c < 20; c++) {
    for (var s = 1; s <= 6; s++) {
      if (periods[c] == data.subjects[s].code) {
        data.periods[c] = s;
        break;
      };
    };
  };
  if (localStorage["USE-SCODES"]) {data.options["displayCodes"] = true};
  if (localStorage["USE-TNAMES"]) {data.options["displayNames"] = true};
  if (localStorage["USE-COLOURS"]) {
    data.options["customColour1"] = localStorage.getItem("COLOUR-BG");
    data.options["customColour2"] = localStorage.getItem("COLOUR-TX");
  };
  localStorage.clear();
  localStorage.setItem("data", JSON.stringify(data));
  printData();
  fillInputs();
  setSize();
} else { // Create new
  var data = {
    subjects: new Object(),
    periods: [],
    options: new Object(),
  };
};
console.log(data);

function printData() {
  for (var c = 0; c < 20; c++) { // Print to timetable
    let cell = sessions[c];
    //cell.title = "";
    cell.innerHTML = "";
    let a = document.createElement("a");
    if (!isNaN(data.periods[c]) && data.periods[c] > 0) {
      let subject = data.subjects[data.periods[c]];
      a.href = subject.link;
      cell.classList.add("valid");
      cell.title = subject.name + " | " + subject.teacher;
      printCell(a, c, subject);
      cell.appendChild(a);
    } else {
      var period = getPeriod(c);
      let div = document.createElement("div");
      div.innerHTML = period;
      cell.appendChild(div);
    };
  };

  // Highlight the current session
  let date = new Date();
  let day = date.getDay();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let time = hour + minutes / 60;
  console.log(time);
  if (day != 0 && day != 6) {
    if (time <= 14) {
      if (time >= 12 + 40/60) {
        document.getElementById("period-4").children[day].id = "current";
      } else if (time >= 12 + 5/60) {
        document.getElementById("lunch").id = "current";
      } else if (time >= 10 + 45/60) {
        document.getElementById("period-3").children[day].id = "current";
      } else if (time >= 10 + 30/60) {
        document.getElementById("morning-tea").id = "current";
      } else if (time >= 9 + 0/60) {
        document.getElementById("period-2").children[day].id = "current";
      } else if (time >= 7 + 50/60) {
        document.getElementById("period-1").children[day].id = "current";
      };
    };
  };
  setColours();
  return "Data printed";
};

function runEditor(subject) {
  if (subject == 0) {
    saveDetails();
    console.log("Exited editing mode.");
    return;
  };
  for (var c = 0; c < 20; c++) {
    let cell = sessions[c];
    let currentCell = c;
    if (cell.classList.contains("valid")) {cell.classList.remove("valid")};
    cell.innerHTML = "";
    cell.classList.add("editing");
    if (!isNaN(data.periods[currentCell]) && data.periods[currentCell] > 0) { // Print existing periods
      printCell(cell, currentCell, data.subjects[data.periods[currentCell]])
    };
    cell.onclick = function () {
      if (data.periods[currentCell] != subject) { // Update cell
        data.periods[currentCell] = subject;
        printCell(cell, currentCell, data.subjects[subject]);
        console.log("Cell " + currentCell + " changed to " + subject);
      } else { // Empty cell
        data.periods[currentCell] = null;
        cell.innerHTML = "";
        console.log("Cell " + currentCell + " changed to null");
      };
    };
  };
  console.log("Editor enabled for: " + subject);
};

function saveDetails() {
  for (var i = 1; i <= 6; i++) {
    let inputs = document.getElementsByClassName("inputs-" + i);
    data.subjects[i] = new Object();
    data.subjects[i].code = inputs[0].value;
    data.subjects[i].name = inputs[1].value;
    data.subjects[i].link = inputs[2].value;
    data.subjects[i].teacher = inputs[3].value;
  };
  for (var c = 0; c < 20; c++) {
    let cell = sessions[c];
    if (cell.classList.contains("editing")) {cell.classList.remove("editing")};
    cell.onclick = undefined;
  };
  printData();
  console.log("Saved Details");
  localStorage.setItem("data", JSON.stringify(data));
  document.getElementsByClassName("sticker")[0].checked = true;
  alert("Your timetable has been saved. Be sure to backup to the URL and bookmark it in case it disappears!")
};

function fillInputs() {
  for (var s = 1; s <= 6; s++) {
    let subject = data.subjects[s];
    var inputs = document.getElementsByClassName("inputs-" + s);
    inputs[0].value = subject.code;
    inputs[1].value = subject.name;
    inputs[2].value = subject.link;
    inputs[3].value = subject.teacher;
  };
  if (data.options.hasOwnProperty("displayNames")) {document.getElementById("tnames").checked = true};
  if (data.options.hasOwnProperty("displayCodes")) {document.getElementById("scodes").checked = true};
  if (data.options.hasOwnProperty("cellSize")) {document.getElementById("cell-resizer").value = data.options.cellSize};
  if (data.options.hasOwnProperty("customColour1")) {document.getElementById("colour-1").value = data.options.customColour1};
  if (data.options.hasOwnProperty("customColour2")) {document.getElementById("colour-2").value = data.options.customColour2};
};

function printCell(parent, pos, subject) {
  parent.innerHTML = "";
  var period = getPeriod(pos);
  let div = document.createElement("div");
  div.innerHTML = period + "<br><b>" + subject.name + "</b>";
  if (data.options.hasOwnProperty("displayNames") && subject.teacher != "") {div.innerHTML += "<br>" + subject.teacher};
  if (data.options.hasOwnProperty("displayCodes") && subject.code != "") {div.innerHTML += "<br>" + subject.code};
  parent.appendChild(div);
};

function getPeriod(pos) {
  if (pos < 5) { // Print time
    var period = 0;
  } else if (pos < 10) {
    var period = 1;
  } else if (pos < 15) {
    var period = 2;
  } else if (pos < 20) {
    var period = 3;
  };
  return periodTimes[period];
};

function backupURL() {
  if (!data.subjects.hasOwnProperty("1")) {alert("Your timetable is empty. Have you clicked 'Save' yet?"); return};
  window.location = "#" + JSON.stringify(data);
  alert("Your data has been backed up to the URL. Bookmark this new page and click 'Import' if your timetable disappears.");
};

function importURL() {
  let imported = window.location.href.toString().replace(/%22/g, '"').replace(/%20/g, " ");
  let web = imported.split("#")[0].length;
  if (!imported.split("#")[1]) {alert("There's no timetable in your URL!"); return};
  imported = imported.substr(web + 1, imported.length);
  data = JSON.parse(imported.toString());
  localStorage.setItem("data", JSON.stringify(data));
  printData();
  alert("Your data has been imported.");
};

function check(option) {
  let box = document.getElementById(option);
  switch (option) {
    case "tnames":
      if (box.checked) {
        data.options.displayNames = true;
        localStorage.setItem("data", JSON.stringify(data));
        console.log(option + " marked true");
      } else {
        delete data.options.displayNames;
        localStorage.setItem("data", JSON.stringify(data));
        console.log(option + " marked false");
      };
      break;
    case "scodes":
      if (box.checked) {
        data.options.displayCodes = true;
        localStorage.setItem("data", JSON.stringify(data));
        console.log(option + " marked true");
      } else {
        delete data.options.displayCodes;
        localStorage.setItem("data", JSON.stringify(data));
        console.log(option + " marked false");
      };
      break;
    default:

  };
  printData();
};

// Cell Resizer
resizer.addEventListener("change", function () {
  data.options.cellSize = resizer.value;
  if (data.options.cellSize == 1) {
    delete data.options.cellSize;
  };
  if (localStorage["data"]) {
    localStorage.setItem("data", JSON.stringify(data));
  };
  setSize();
});
function setSize() {
  if (data.options.hasOwnProperty("cellSize")) {
    var size = data.options.cellSize;
  } else {
    var size = 1;
  };
  for (var h = 0; h < 5; h++) {
    headings[h].style.maxWidth = (size * 150) + "px";
  };
};

// Custom Colours
colour1.addEventListener("change", function () {
  data.options.customColour1 = colour1.value;
  if (localStorage["data"]) {
    localStorage.setItem("data", JSON.stringify(data));
  };
  setColours();
});
colour2.addEventListener("change", function () {
  data.options.customColour2 = colour2.value;
  if (localStorage["data"]) {
    localStorage.setItem("data", JSON.stringify(data));
  };
  setColours();
});
function setColours() {
  if (data.options.hasOwnProperty("customColour1")) {
    document.body.style.backgroundColor = data.options.customColour1;
    let inputs = document.querySelectorAll("input[type='text']");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].style.backgroundColor = data.options.customColour1;
    };
  };
  if (data.options.hasOwnProperty("customColour2")) {
    let textElements = document.querySelectorAll("h1,h2,p,th,td,a,input[type='text'],div");
    let borderElements = document.querySelectorAll("table,tr,td,th");
    for (var i = 0; i < textElements.length; i++) {
      textElements[i].style.color = data.options.customColour2;
    };
    for (var i = 0; i < borderElements.length; i++) {
      borderElements[i].style.borderColor = data.options.customColour2;
    };
  };
};
