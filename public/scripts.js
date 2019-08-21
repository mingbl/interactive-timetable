//const version = "34c";
//document.getElementById("version").innerHTML = "Version: " + version + " - Created by ML";

const detailsForm = document.getElementById("details-form");
var formRowIncrement = 1;
function addSubject() {
  formRowIncrement++;

  let tr = document.createElement("tr");
  tr.id = "subject-" + formRowIncrement;
  detailsForm.appendChild(tr);

  let tdNumber = document.createElement("td");
  tdNumber.innerHTML = "#" + formRowIncrement;
  tdNumber.style.fontWeight = "bold";
  tr.appendChild(tdNumber);

  let tdCode = document.createElement("td");
  let inputCode = document.createElement("input");
  inputCode.classList.add("inputs-" + formRowIncrement);
  tr.appendChild(tdCode).appendChild(inputCode);

  let tdName = document.createElement("td");
  let inputName = document.createElement("input");
  inputName.classList.add("inputs-" + formRowIncrement);
  tr.appendChild(tdName).appendChild(inputName);

  let tdLink = document.createElement("td");
  let inputLink = document.createElement("input");
  inputLink.classList.add("inputs-" + formRowIncrement);
  tr.appendChild(tdLink).appendChild(inputLink);

  let tdTeacher = document.createElement("td");
  let inputTeacher = document.createElement("input");
  inputTeacher.classList.add("inputs-" + formRowIncrement);
  tr.appendChild(tdTeacher).appendChild(inputTeacher);
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
