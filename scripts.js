const sessions = document.getElementsByClassName("sessions"),
resizer = document.getElementById("cell-resizer"),
headings = document.getElementsByClassName("table-heading"),
colour1 = document.getElementById("colour-1"), colour2 = document.getElementById("colour-2"), colour3 = document.getElementById("colour-3"),
periodTimes = {0: "8:00-9:10", 1: "9:10-10:20", 2: "10:20-10:45", 3: "10:45-12:05", 4: "12:05-12:50", 5: "12:50-2:00"},
maxSubjects = 8,
toolBox = document.getElementById("tools"),
dateDisplay = document.getElementById("date");

// Retrieve data
if (localStorage["notes"]) {
  var notes = JSON.parse(localStorage.getItem("notes"));
} else {
  var notes = new Object();
};
if (localStorage["data"]) { // Local Storage
  var data = JSON.parse(localStorage.getItem("data"));
  if (!data.subjects[7]) {
    data.subjects[7] = new Object();
    data.subjects[7].code = "";
    data.subjects[7].name = "";
    data.subjects[7].link = "";
    data.subjects[7].teacher = "";
    data.subjects[7].highlight = "#808080";
  };
  if (!data.subjects[8]) {
    data.subjects[8] = new Object();
    data.subjects[8].code = "";
    data.subjects[8].name = "";
    data.subjects[8].link = "";
    data.subjects[8].teacher = "";
    data.subjects[8].highlight = "#808080";
  };
  if (data.periods.length != 30) {
    data.periods.splice(10, 0, null, null, null, null, null);
    data.periods.splice(20, 0, null, null, null, null, null);
  };
  console.log(data.periods);
  printData();
  fillInputs();
  setSize();
  setColours();
} else { // Create new
  var data = {
    subjects: new Object(),
    periods: [],
    options: new Object(),
  };
};
console.log(data);

function printData() {
  for (var c = 0; c < 30; c++) { // Print to timetable
    let cell = sessions[c];
    //cell.title = "";
    cell.innerHTML = "";
    let a = document.createElement("a");
    cell.style.removeProperty("background-color");
    if (!isNaN(data.periods[c]) && data.periods[c] > 0) {
      let subject = data.subjects[data.periods[c]];
      a.href = subject.link;
      cell.classList.add("valid");
      cell.title = subject.name;
      if (subject.teacher.length > 0) {cell.title += " | " + subject.teacher};
      cell.appendChild(a);
      printCell(a, c, subject, false);
      if (data.options.hasOwnProperty("highlightClasses")) {cell.style.backgroundColor = subject.highlight};
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
        document.getElementById("period-4").children[0].classList.add("currentHeadings");
      } else if (time >= 12 + 5/60) {
        document.getElementById("breaks-2").children[day].id = "current";
        document.getElementById("breaks-2").children[0].classList.add("currentHeadings");
      } else if (time >= 10 + 40/60) {
        document.getElementById("period-3").children[day].id = "current";
        document.getElementById("period-3").children[0].classList.add("currentHeadings");
      } else if (time >= 10 + 20/60) {
        document.getElementById("breaks-1").children[day].id = "current";
        document.getElementById("breaks-1").children[0].classList.add("currentHeadings");
      } else if (time >= 9 + 0/60) {
        document.getElementById("period-2").children[day].id = "current";
        document.getElementById("period-2").children[0].classList.add("currentHeadings");
      } else if (time >= 7 + 50/60) {
        document.getElementById("period-1").children[day].id = "current";
        document.getElementById("period-1").children[0].classList.add("currentHeadings");
      };
    };
    document.getElementsByClassName("table-heading")[day-1].classList.add("currentHeadings");
  };
  setColours();
  return "Data printed";
};

document.getElementsByClassName("sticker")[0].checked = true;
function runEditor(subject) {
  if (subject == 0) {
    saveDetails();
    console.log("Exited editing mode.");
    return;
  };
  if (!data.subjects.hasOwnProperty("1")) {
    alert("Click Save first!");
    document.getElementsByClassName("sticker")[0].checked = true;
    return;
  };
  toolBox.style.display = "none";
  for (var c = 0; c < 30; c++) {
    let cell = sessions[c];
    let currentCell = c;
    if (cell.classList.contains("valid")) {cell.classList.remove("valid")};
    cell.innerHTML = "";
    cell.classList.add("editing");
    if (!isNaN(data.periods[currentCell]) && data.periods[currentCell] > 0) { // Print existing periods
      printCell(cell, currentCell, data.subjects[data.periods[currentCell]], true)
    };
    cell.onclick = function () {
      if (document.activeElement.classList.contains("notes")) { // If clicked on notes textarea
        return;
      };
      if (data.periods[currentCell] != subject) { // Update cell
        data.periods[currentCell] = subject;
        printCell(cell, currentCell, data.subjects[subject], true);
        console.log("Cell " + currentCell + " changed to " + subject);
        if (data.options.hasOwnProperty("highlightClasses")) {cell.style.backgroundColor = data.subjects[subject].highlight};
      } else { // Empty cell
        data.periods[currentCell] = null;
        cell.innerHTML = "";
        console.log("Cell " + currentCell + " changed to null");
        cell.style.removeProperty("background-color");
      };
    };
  };
  console.log("Editor enabled for: " + subject);
};

function saveDetails() {
  for (var i = 1; i <= maxSubjects; i++) {
    let inputs = document.getElementsByClassName("inputs-" + i);
    data.subjects[i] = new Object();
    data.subjects[i].code = inputs[0].value;
    data.subjects[i].name = inputs[1].value;
    data.subjects[i].link = inputs[3].value;
    data.subjects[i].teacher = inputs[2].value;
    //data.subjects[i].highlight = inputs[4].value;
    if (inputs[4].value != null) {
      data.subjects[i].highlight = inputs[4].value;
    } else {
      data.subjects[i].highlight = "#808080";
    }
  };
  for (var c = 0; c < 30; c++) {
    let cell = sessions[c];
    if (cell.classList.contains("editing")) {cell.classList.remove("editing")};
    cell.onclick = undefined;
  };
  printData();
  console.log("Saved Details");
  localStorage.setItem("data", JSON.stringify(data));
  document.getElementsByClassName("sticker")[0].checked = true;
  alert("Your timetable has been saved. Be sure to backup to the URL and bookmark it in case it disappears!");
  toolBox.style.display = "initial";
};

function fillInputs() {
  for (var s = 1; s <= maxSubjects; s++) {
    let subject = data.subjects[s];
    var inputs = document.getElementsByClassName("inputs-" + s);
    inputs[0].value = subject.code;
    inputs[1].value = subject.name;
    inputs[3].value = subject.link;
    inputs[2].value = subject.teacher;
    inputs[4].value = subject.highlight;
  };
  if (data.options.hasOwnProperty("displayNames")) {document.getElementById("tnames").checked = true};
  if (data.options.hasOwnProperty("displayCodes")) {document.getElementById("scodes").checked = true};
  if (data.options.hasOwnProperty("highlightClasses")) {document.getElementById("hilite").checked = true};
  if (data.options.hasOwnProperty("displayNotes")) {document.getElementById("dnotes").checked = true};
  if (data.options.hasOwnProperty("cellSize")) {document.getElementById("cell-resizer").value = data.options.cellSize};
  if (data.options.hasOwnProperty("customColour1")) {document.getElementById("colour-1").value = data.options.customColour1};
  if (data.options.hasOwnProperty("customColour2")) {document.getElementById("colour-2").value = data.options.customColour2};
  if (data.options.hasOwnProperty("customColour3")) {document.getElementById("colour-3").value = data.options.customColour3};
};

function printCell(parent, pos, subject, editMode) {
  parent.innerHTML = "";
  var period = getPeriod(pos);
  let div = document.createElement("div");
  div.innerHTML = period + "<br><b>" + subject.name + "</b>";
  if (data.options.hasOwnProperty("displayNames") && subject.teacher != "") {div.innerHTML += "<br>" + subject.teacher};
  if (data.options.hasOwnProperty("displayCodes") && subject.code != "") {div.innerHTML += "<br>" + subject.code};
  parent.appendChild(div);

  if (data.options.hasOwnProperty("displayNotes")) {
    let note = document.createElement("textarea");
    note.classList.add("notes");
    if (notes.hasOwnProperty(pos)) {
      note.value = notes[pos];
    };
    if (editMode) {
      note.readOnly = false;
      note.onkeyup = function () {
        notes[pos] = note.value;
        localStorage.setItem("notes", JSON.stringify(notes));
        //console.log(notes);
      };
      parent.appendChild(note);
    } else {
      note.readOnly = true;
      parent.parentNode.appendChild(note);
    };
  };
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
  } else if (pos < 25) {
    var period = 4;
  } else if (pos < 30) {
    var period = 5;
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
  window.location.reload();
};

function check(option) {
  let box = document.getElementById(option);
  if (!data.subjects.hasOwnProperty("1")) {
    alert("Click Save first!");
    box.checked = false;
    return;
  };
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
    case "hilite":
      if (box.checked) {
        data.options.highlightClasses = true;
        localStorage.setItem("data", JSON.stringify(data));
        console.log(option + " marked true");
      } else {
        delete data.options.highlightClasses;
        localStorage.setItem("data", JSON.stringify(data));
        console.log(option + " marked false");
      };
      break;
    case "dnotes":
      if (box.checked) {
        data.options.displayNotes = true;
        localStorage.setItem("data", JSON.stringify(data));
        console.log(option + " marked true");
      } else {
        delete data.options.displayNotes;
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

// Highlight Classes / Colour Coding


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
colour3.addEventListener("change", function () {
  data.options.customColour3 = colour3.value;
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
  if (data.options.hasOwnProperty("customColour2") && data.options.hasOwnProperty("highlightClasses")) {
    let textElements = document.querySelectorAll("td.valid > a > div");
    for (var i = 0; i < textElements.length; i++) {
      textElements[i].style.color = data.options.customColour3;
    };
  };
};

function displayDate() {
  function minTwoDigits(n) { // https://stackoverflow.com/a/8513064
    return (n < 10 ? '0' : '') + n;
  };

  let date = new Date();
  let day = date.getDate();
  let month = minTwoDigits(date.getMonth() + 1);
  let year = date.getFullYear();
  let hour = date.getHours();
  let minutes = minTwoDigits(date.getMinutes());
  let seconds = minTwoDigits(date.getSeconds());

  let cycle = "AM";

  if (hour > 11) {
    cycle = "PM";
  };
  if (hour > 12) {
    hour -= 12;
  };
  if (hour == 0) {
    hour = 12;
  };

  dateDisplay.innerHTML = hour + ":" + minutes + ":" + seconds + " " + cycle + " | " + day + "/" + month + "/" + year;
};
displayDate();
setInterval(displayDate, 1000);

var easterEggActive = false, easterEggSpeed = 3;
document.getElementById("easter-egg").addEventListener("click", function () {
  if (easterEggActive) {
    easterEggSpeed = easterEggSpeed * 2 / 3;
    for (const session in sessions) {
      if (sessions.hasOwnProperty(session)) {
        const cell = sessions[session];
        cell.style.animationDuration = easterEggSpeed + "s";
      };
    };
  } else {
    easterEggActive = true;
    for (const session in sessions) {
      if (sessions.hasOwnProperty(session)) {
        const cell = sessions[session];
        cell.classList.add("easter-egg");
      };
    };
  };
});