const sessions = document.getElementsByClassName("sessions"),
resizer = document.getElementById("cell-resizer"),
headings = document.getElementsByClassName("day-heading"),
periodTimes = {0: "8:00-9:10", 1: "9:10-10:20", 2: "10:20-10:45", 3: "10:45-12:05", 4: "12:05-12:50", 5: "12:50-2:00"},
maxSubjects = 8,
//toolBox = document.getElementById("tools"),
settings = document.getElementById("settings-box"),
dateDisplay = document.getElementById("date"),
standard = {
  details: [
    "name",
    "link",
    "highlight",
    "teacher",
    "code",
  ],
  highlights: [
    "#DF68A8",
    "#DF4152",
    "#E99B5B",
    "#F4E963",
    "#50A05C",
    "#4F96BA",
    "#4D5A99",
    "#7E3B8B",
  ],
  colours: {
    body_bg: "#1A1A1A",
    default_text: "#FFFFFF",
    highlighted_text: "#000000",
    table_border: "#4750B8",
    /*hover_colour: "#D3D3D3",
    active_colour: "#808080",*/
    heading_bg: "#808080",
    notes_text: "#FFFFFF",
  },
};

// Retrieve or initialise data
if (localStorage["data"]) { // Local Storage
  var data = JSON.parse(localStorage.getItem("data"));
  if (!data.subjects[7]) {
    data.subjects[7] = new Object();
    data.subjects[7].code = "";
    data.subjects[7].name = "";
    data.subjects[7].link = "";
    data.subjects[7].teacher = "";
    data.subjects[7].highlight = standard.highlights[6];
  };
  if (!data.subjects[8]) {
    data.subjects[8] = new Object();
    data.subjects[8].code = "";
    data.subjects[8].name = "";
    data.subjects[8].link = "";
    data.subjects[8].teacher = "";
    data.subjects[8].highlight = standard.highlights[7];
  };
  if (data.periods.length != 30) {
    data.periods.splice(10, 0, null, null, null, null, null);
    data.periods.splice(20, 0, null, null, null, null, null);
  };
  if (!data.options.hasOwnProperty("colours")) {
    data.options.colours = {};
  };
  if (data.options.hasOwnProperty("customColour1")) {data.options.colours["body_bg"] = data.options["customColour1"]; delete data.options["customColour1"]};
  if (data.options.hasOwnProperty("customColour2")) {data.options.colours["default_text"] = data.options["customColour2"]; delete data.options["customColour2"]};
  if (data.options.hasOwnProperty("customColour3")) {data.options.colours["highlighted_text"] = data.options["customColour3"]; delete data.options["customColour3"]};
  localStorage.setItem("data", JSON.stringify(data));
} else { // Create new
  var data = {
    subjects: {},
    periods: [],
    options: {
      colours: {},
    },
  };
};
if (localStorage["notes"]) {
  var notes = JSON.parse(localStorage.getItem("notes"));
} else {
  var notes = new Object();
};

console.log({data: data, notes: notes});

// Generate subject details table
function createDetailsTable() {
  let table = document.getElementById("details-table");
  let types = {
    name: "text",
    link: "text",
    controller: "radio",
    highlight: "color",
    teacher: "text",
    code: "text",
  };
  for (let i = 2; i <= maxSubjects; i++) {
    let row = document.createElement("tr");
    row.classList.add("subject-rows");
    table.appendChild(row);

    for (const key in types) {
      if (types.hasOwnProperty(key)) {
        const detail = key;
        const type = types[key];
        
        let cell = document.createElement("td");
        row.appendChild(cell);

        let input = document.createElement("input");
        input.type = type;
        input.classList.add(detail + "s");
        cell.appendChild(input);

        if (key === "highlight") {
          input.value = standard.highlights[i - 1];
        } else
        if (key === "controller") {
          input.name = "controllers";
          let c = i;
          input.title = "Place Subject " + c + " on the timetable";
          input.addEventListener("click", function () {runEditor(c)});
          cell.classList.add("controller-containers");
        };
      };
    };
  };
};

// Start
createDetailsTable();
if (localStorage["data"]) {
  printData();
  fillInputs();
  setSize();
};
setColours();

function printData() {
  for (var c = 0; c < 30; c++) { // Print to timetable
    let cell = sessions[c];

    cell.innerHTML = "";
    let a = document.createElement("a");
    cell.style.removeProperty("background-color");
    if (!isNaN(data.periods[c]) && data.periods[c] > 0) {
      let subject = data.subjects[data.periods[c]];
      a.href = subject.link;
      cell.classList.add("valid");

      let title = [];
      if (subject.name != "") {title.push(subject.name)};
      if (subject.teacher != "") {title.push(subject.teacher)};
      cell.title = title.join(" | ");

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
        document.getElementById("period-4").children[0].classList.add("current-headings");
      } else if (time >= 12 + 5/60) {
        document.getElementById("breaks-2").children[day].id = "current";
        document.getElementById("breaks-2").children[0].classList.add("current-headings");
      } else if (time >= 10 + 40/60) {
        document.getElementById("period-3").children[day].id = "current";
        document.getElementById("period-3").children[0].classList.add("current-headings");
      } else if (time >= 10 + 20/60) {
        document.getElementById("breaks-1").children[day].id = "current";
        document.getElementById("breaks-1").children[0].classList.add("current-headings");
      } else if (time >= 9 + 0/60) {
        document.getElementById("period-2").children[day].id = "current";
        document.getElementById("period-2").children[0].classList.add("current-headings");
      } else if (time >= 7 + 50/60) {
        document.getElementById("period-1").children[day].id = "current";
        document.getElementById("period-1").children[0].classList.add("current-headings");
      };
    };
    document.getElementsByClassName("table-heading")[day-1].classList.add("current-headings");
  };
  setColours();
  return "Data printed";
};

document.getElementsByClassName("controllers")[0].checked = true;
function runEditor(subject) {
  if (subject == 0) {
    saveDetails();
    console.log("Exited editing mode.");
    return;
  };
  if (!data.subjects.hasOwnProperty("1")) {
    alert("Click Save first!");
    document.getElementsByClassName("controllers")[0].checked = true;
    return;
  };
  settings.style.display = "none";
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
    data.subjects[i] = {};
    for (const key in standard.details) {
      if (standard.details.hasOwnProperty(key)) {
        const detail = standard.details[key];
        data.subjects[i][detail] = document.getElementsByClassName(detail + "s")[i - 1].value;
      };
    };
  };

  for (var c = 0; c < 30; c++) {
    let cell = sessions[c];
    if (cell.classList.contains("editing")) {cell.classList.remove("editing")};
    cell.onclick = undefined;
  };
  
  printData();
  console.log("Saved Details");
  localStorage.setItem("data", JSON.stringify(data));
  document.getElementsByClassName("controllers")[0].checked = true;
  backupURL();
  //alert("Your timetable has been saved. Be sure to backup to the URL and bookmark it in case it disappears!");
  settings.style.display = "flex";
};

function fillInputs() {
  for (var s = 1; s <= maxSubjects; s++) {
    let subject = data.subjects[s];
    /*var inputs = document.getElementsByClassName("inputs-" + s);
    inputs[0].value = subject.code;
    inputs[1].value = subject.name;
    inputs[3].value = subject.link;
    inputs[2].value = subject.teacher;
    inputs[4].value = subject.highlight;*/
    for (const key in standard.details) {
      if (standard.details.hasOwnProperty(key)) {
        const detail = standard.details[key];
        document.getElementsByClassName(detail + "s")[s - 1].value = data.subjects[s][detail];
      };
    };
  };
  if (data.options.hasOwnProperty("displayNames")) {document.getElementById("tnames").checked = true};
  if (data.options.hasOwnProperty("displayCodes")) {document.getElementById("scodes").checked = true};
  if (data.options.hasOwnProperty("highlightClasses")) {document.getElementById("hilite").checked = true};
  if (data.options.hasOwnProperty("displayNotes")) {document.getElementById("dnotes").checked = true};
  if (data.options.hasOwnProperty("cellSize")) {document.getElementById("cell-resizer").value = data.options.cellSize};

  if (data.options.colours.hasOwnProperty("body_bg")) {document.getElementById("body_bg").value = data.options.colours.body_bg};
  if (data.options.colours.hasOwnProperty("default_text")) {document.getElementById("default_text").value = data.options.colours.default_text};
  if (data.options.colours.hasOwnProperty("highlighted_text")) {document.getElementById("highlighted_text").value = data.options.colours.highlighted_text};
};

function printCell(parent, pos, subject, editMode) {
  parent.innerHTML = "";
  let timeRange = getPeriod(pos);
  let div = document.createElement("div");
  let content = [];
  content.push(timeRange);
  if (subject.name != "") {content.push("<b>" + subject.name + "</b>")};
  if (data.options.hasOwnProperty("displayNames") && subject.teacher != "") {content.push(subject.teacher)};
  if (data.options.hasOwnProperty("displayCodes") && subject.code != "") {content.push(subject.code)};
  div.innerHTML = content.join("<br>");
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
  //alert("Your data has been backed up to the URL. Bookmark this new page and click 'Import' if your timetable disappears.");
};

function importURL() {
  let imported = window.location.href.toString().replace(/%22/g, '"').replace(/%20/g, " ");
  let web = imported.split("#")[0].length;
  if (!imported.split("#")[1]) {alert("There's no timetable in your URL!"); return};
  imported = imported.substr(web + 1, imported.length);
  data = JSON.parse(imported.toString());
  localStorage.setItem("data", JSON.stringify(data));
  //alert("Your data has been imported.");
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
for (const key in standard.colours) {
  const input = document.getElementById(key);
  
  if (data.options.colours.hasOwnProperty(key)) {
    input.value = data.options.colours[key];
  } else {
    input.value = standard.colours[key];
  };

  input.addEventListener("change", function () {
    data.options.colours[key] = input.value;

    // Update local storage
    if (localStorage["data"]) {
      localStorage.setItem("data", JSON.stringify(data));
    };
    
    setColours();
  });
};

function setColours() {
  const custom = data.options.colours;

  function customColour(colour) {
    return custom.hasOwnProperty(colour) ? custom[colour] : standard.colours[colour];
  };

  document.body.style.backgroundColor = customColour("body_bg");

  {
    let elements = document.querySelectorAll("h1,h2,h3,p,th,td,a,input[type='text'],div");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.color = customColour("default_text");
    };
  };

  {
    let elements = document.querySelectorAll("table,tr,td,th");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.borderColor = customColour("table_border");
    };
  };

  if (custom.hasOwnProperty("highlighted_text") && data.options.hasOwnProperty("highlightClasses")) {
    let highlighted_text = custom["highlighted_text"];
    let elements = document.querySelectorAll("td.valid > a > div");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.color = highlighted_text;
    };
    if (document.getElementById("current")) {
      document.getElementById("current").style.textDecorationColor = highlighted_text;
    };
  };

  {
    let elements = document.querySelectorAll("td#current,.current-headings");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = customColour("heading_bg");
    };
  };

  {
    let elements = document.querySelectorAll("textarea.notes");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.color = customColour("notes_text");
    };
  };


  /*let hover_colour = customColour("hover_colour");
  let hoverElements = document.querySelectorAll("td.valid,td.valid#current");
  for (var i = 0; i < hoverElements.length; i++) {
    hoverElements[i].onmouseover = function() {
      this.style.backgroundColor = hover_colour;
    };
    hoverElements[i].onmouseoff = function(this.style.backgroundColor) {

    }
  };*/
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

function reset() {
  let confirmation = confirm("Reset your local storage?");
  if (confirmation) {
    localStorage.clear();
    window.location.reload();
  };
};

function resetColours() {
  if (!localStorage["data"]) {alert("You don't have any colours saved!"); return};
  let confirmation = confirm("Reset your colours?");
  if (!confirmation) {return};
  for (let i = 0; i < standard.highlights.length; i++) {
    const colour = standard.highlights[i];
    data.subjects[i + 1].highlight = colour;
  };
  delete data.options.colours;
  data.options.colours = JSON.parse(JSON.stringify(standard.colours));
  localStorage.setItem("data", JSON.stringify(data));
  window.location.reload();
};