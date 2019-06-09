// Support for older versions
{
  if (localStorage["timetableExists"]) {
    localStorage.setItem("TIMETABLE", "true");
    localStorage.removeItem("timetableExists")
  };
  if (localStorage["period1codesSaved"]) {
    localStorage.setItem("PERIODS", localStorage.getItem("period1codesSaved") + "," + localStorage.getItem("period2codesSaved") + "," + localStorage.getItem("period3codesSaved") + "," + localStorage.getItem("period4codesSaved"));
    localStorage.setItem("SUBJECT1", localStorage.getItem("subject1detailsSaved"));
    localStorage.setItem("SUBJECT2", localStorage.getItem("subject2detailsSaved"));
    localStorage.setItem("SUBJECT3", localStorage.getItem("subject3detailsSaved"));
    localStorage.setItem("SUBJECT4", localStorage.getItem("subject4detailsSaved"));
    localStorage.setItem("SUBJECT5", localStorage.getItem("subject5detailsSaved"));
    localStorage.setItem("SUBJECT6", localStorage.getItem("subject6detailsSaved"));
    let subjects = ["subject1detailsSaved", "subject2detailsSaved", "subject3detailsSaved", "subject4detailsSaved", "subject5detailsSaved", "subject6detailsSaved"];
    for (subject in subjects) {
      localStorage.removeItem(subject)
    }
  };
  if (localStorage["tnamesVisible"]) {
    localStorage.setItem("USE-TNAMES", "true");
    localStorage.removeItem("tnamesVisible")
  };
  if (localStorage["bgColour"]) {
    localStorage.setItem("COLOUR-BG", localStorage.getItem("bgColour"));
    localStorage.setItem("COLOUR-TX", localStorage.getItem("txColour"));
    localStorage.setItem("USE-COLOURS", "true");
    localStorage.removeItem("bgColour");
    localStorage.removeItem("txColour");
  };
};

// Initialise variables
var numPeriods = 4;
var numDays = 5;
var numSubjects = 6;
var numDetails = 4;

if (!localStorage["TIMETABLE"]) {

  // Hide timetable
  document.getElementById("timetable").style.display = "none";

  // Create lesson schedule inputs
  let inputPeriodsContainer = document.getElementById("periods");
  for (var period = 0; period < numPeriods; period++) {
    for (var day = 0; day < numDays; day++) {
      let input = document.createElement("input");
      input.type = "text";
      input.className = "input-periods";
      inputPeriodsContainer.appendChild(input);
    };
    inputPeriodsContainer.appendChild(document.createElement("br"));
  };

  // Create subject details inputs
  let inputSubjectsContainer = document.getElementById("subjects");
  for (var subject = 1; subject < numSubjects + 1; subject++) {
    for (var detail = 0; detail < numDetails; detail++) {
      let input = document.createElement("input");
      input.type = "text";
      input.className = "input-subject-" + subject;
      inputSubjectsContainer.appendChild(input);
    };
    inputSubjectsContainer.appendChild(document.createElement("br"));
  };

  // Save data to local storage
  function save() {

    // Ensure subject codes are present in the lesson schedule
    let periods = [""];
    for (var subject = 1; subject < numSubjects + 1; subject++) {
      periods[subject - 1] = document.getElementsByClassName("input-subject-" + subject)[0].value
    };

    let inputPeriods = document.getElementsByClassName("input-periods");
    for (var i = 0; i < inputPeriods.length; i++) {
      if (inputPeriods[i].value != "" && periods.indexOf(inputPeriods[i].value) == -1) {
        alert("The subject code '" + inputPeriods[i].value + "' (Cell " + (i + 1) + ") is not present within the subject details.");
        return
      }
    };

    localStorage.setItem("PERIODS", compile(document.getElementsByClassName("input-periods")));

    for (var subject = 1; subject < numSubjects + 1; subject++) {
      localStorage.setItem("SUBJECT" + subject, compile(document.getElementsByClassName("input-subject-" + subject)));
    };

    // Function for replacing empty cells with "-"
    function compile(input) {
      let output = [""];

      for (var i = 0; i < input.length; i++) {
        if (input[i].value) {
          output[i] = input[i].value
        } else {
          output[i] = "-"
        }
      };

      return output
    };

    localStorage.setItem("TIMETABLE", "true");
    location.reload()
  };

  // Function for importing data from local storage
  function importData() {
    let periods = localStorage.getItem("PERIODS").split(",")
    for (var period = 0; period < numPeriods * numDays; period++) {
      if (periods[period] != "-") {
        document.getElementsByClassName("input-periods")[period].value = periods[period]
      } else {
        document.getElementsByClassName("input-periods")[period].value = ""
      }
    };

    for (var subject = 1; subject < numSubjects + 1; subject++) {
      if (localStorage["SUBJECT" + subject]) {
        let details = localStorage.getItem("SUBJECT" + subject).split(",");
        for (var detail = 0; detail < numDetails; detail++) {
          if (details[detail] != "-" && details[detail] != "#") {
            document.getElementsByClassName("input-subject-" + subject)[detail].value = details[detail]
          } else {
            document.getElementsByClassName("input-subject-" + subject)[detail].value = ""
          }
        }
      }
    }
  };

  // Import data from local storage if available
  if (localStorage["PERIODS"]) {
    importData()
  };

  // Import data from external source and save to local storage
  function importExt(source) {

    if (source === "URL") {
      var dataImport = window.location.href.toString().split("#");
      if (dataImport[1]) {
        dataImport.shift();
        dataImport = dataImport.toString().replace(/%20/g, " ");
      } else {
        return
      }
    } else if (source === "TXT") {
      var dataImport = prompt("Enter Data:");
      if (dataImport == "" || dataImport == null) {
        return
      }
    };

    dataImport = dataImport.split(";");

    // Support for older versions
    if (dataImport.length == 11) {
      dataImport[3] = dataImport[0] + "," + dataImport[1] + "," + dataImport[2] + "," + dataImport[3];
      dataImport.shift(); dataImport.shift(); dataImport.shift();
      alert("Be sure to update your bookmark after editing.")
    };

    localStorage.setItem("PERIODS", dataImport[0]);

    for (var i = 1; i < numSubjects; i++) {
      localStorage.setItem("SUBJECT" + i, dataImport[i])
    };

    importData()
  };

  // Function for checking checkboxes
  function check(box, override) {
    if (document.getElementById(box.toLowerCase()).checked && override != "DISABLE") {
      localStorage.setItem("USE-" + box, "true");
      if (box === "COLOURS") {
        setColours(document.getElementById("colourBg").value, document.getElementById("colourTx").value, "FALSE")
      }
    } else {
      document.getElementById(box.toLowerCase()).checked = false;
      localStorage.removeItem("USE-" + box);
      if (box === "COLOURS") {
        setColours("black", "white", "true")
      }
    };
  };

  function wipe() {
    if (confirm("Are you sure you want to wipe your timetable?")) {
      localStorage.clear();
      location.reload()
    }
  }

} else {

  // Hide creator
  document.getElementById("creator").style.display = "none";

  for (var a = 1; a < numDays; a++) {
    for (var i = 1; i < numPeriods + 2; i++) {
      // Select HTML cell
      let cellContainer = document.getElementById("Period" + a);
      let cell = cellContainer.children[i];

      cell.classList.add("session");
    }
  };

  // Add subject class to relevant cells
  let sessions = document.getElementsByClassName("session");
  let codes = localStorage.getItem("PERIODS").split(",");
  for (var i = 0; i < sessions.length; i++) {
    if (codes[i] != "-") {
      sessions[i].classList.add(codes[i])
    }
  };

  // Add details to cells with subject class
  for (var i = 1; i < numSubjects + 1; i++) {
    let details = localStorage.getItem("SUBJECT" + i).split(",");
    let subject = document.getElementsByClassName(details[0]);
    for (var a = 0; a < subject.length; a++) {
      subject[a].title = details[1] + " | " + details[3];
      subject[a].children[0].children[0].innerHTML += "<br><b>" + details[1] + "</b>";
      if (localStorage["USE-TNAMES"]) {
        subject[a].children[0].children[0].innerHTML += "<br>" + details[3]
      };
      subject[a].children[0].href = details[2];
      subject[a].classList.add("valid")
    }
  };

  // Add id to current lesson
  let day = new Date().getDay();
  let hour = new Date().getHours();

  if (day != 0 && day != 6) {
    switch (hour) {
      case 7: case 8:
        document.getElementById("Period1").children[day].id = "active"
        break;
      case 9:
        document.getElementById("Period2").children[day].id = "active"
        break;
      case 10: case 11:
        document.getElementById("Period3").children[day].id = "active"
        break;
      case 12: case 13:
        document.getElementById("Period4").children[day].id = "active"
        break;
    }
  } else {
    document.getElementById("weekend").style.display = "block"
  };

  function edit() {
    localStorage.removeItem("TIMETABLE");
    location.reload();
  };

  function exportExt(type) {
    let compiled = localStorage.getItem("PERIODS");
    for (var subject = 1; subject < numSubjects + 1; subject++) {
      compiled += ";" + localStorage.getItem("SUBJECT" + subject)
    };
    if (type === "URL") {
      window.location = "#" + compiled;
      alert("Export successful. You can bookmark this URL and go to Edit Timetable > Import URL if your timetable disappears.")
    } else if (type === "TXT") {
      prompt("Export Data:\n(Save this to a txt file in case your local storage is wiped)", compiled)
    }
  }
}

if (localStorage["USE-TNAMES"]) {
  document.getElementById("tnames").checked = true;
  tableCells = document.getElementsByTagName("td");
  for (var i = 0; i < tableCells.length; i++) {
    tableCells[i].classList.add("extended")
  };
}

if (localStorage["USE-COLOURS"]) {
  document.getElementById("colours").checked = true;
  document.getElementById("colourBg").value = localStorage.getItem("COLOUR-BG");
  document.getElementById("colourTx").value = localStorage.getItem("COLOUR-TX");
  setColours(localStorage.getItem("COLOUR-BG"), localStorage.getItem("COLOUR-TX"))
}
function setColours(bgColour, txColour, wipe) {
  document.body.style.backgroundColor = bgColour;
  setTxColour1(document.querySelectorAll("h1,h2,p,a,td"));
  setTxColour2(document.querySelectorAll("table,tr,td"));
  function setTxColour1(array) {
    for (var i = 0; i < array.length; i++) {
      array[i].style.color = txColour;
    }
  }
  function setTxColour2(array) {
    for (var i = 0; i < array.length; i++) {
      array[i].style.borderColor = txColour;
    }
  }
  if (wipe === "FALSE") {
    localStorage.setItem("COLOUR-BG", bgColour);
    localStorage.setItem("COLOUR-TX", txColour);
  } else if (wipe === "TRUE") {
    localStorage.removeItem("COLOUR-BG");
    localStorage.removeItem("COLOUR-TX");
  }
}
