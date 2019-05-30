var timetableExists = localStorage.getItem("timetableExists");
if (timetableExists === "true") {
  document.getElementById("creator").style.display = "none";
  var periodOneNodes = document.getElementById("periodOne").children;
  var periodTwoNodes = document.getElementById("periodTwo").children;
  var periodThreeNodes = document.getElementById("periodThree").children;
  var periodFourNodes = document.getElementById("periodFour").children;

  var periodOneCodes = localStorage.getItem("period1codesSaved").split(",");
  var periodTwoCodes = (localStorage.getItem("period2codesSaved")).split(",");
  var periodThreeCodes = (localStorage.getItem("period3codesSaved")).split(",");
  var periodFourCodes = (localStorage.getItem("period4codesSaved")).split(",");

  var subjectOneDetails = (localStorage.getItem("subject1detailsSaved")).split(",");
  var subjectTwoDetails = (localStorage.getItem("subject2detailsSaved")).split(",");
  var subjectThreeDetails = (localStorage.getItem("subject3detailsSaved")).split(",");
  var subjectFourDetails = (localStorage.getItem("subject4detailsSaved")).split(",");
  var subjectFiveDetails = (localStorage.getItem("subject5detailsSaved")).split(",");
  var subjectSixDetails = (localStorage.getItem("subject6detailsSaved")).split(",");

  for (var i = 0; i < 5; i++) {
    periodOneNodes[i + 1].classList.add(periodOneCodes[i]);
    periodTwoNodes[i + 1].classList.add(periodTwoCodes[i]);
    periodThreeNodes[i + 1].classList.add(periodThreeCodes[i]);
    periodFourNodes[i + 1].classList.add(periodFourCodes[i]);
  };

  var subjectOne = document.getElementsByClassName(subjectOneDetails[0]);
  if (subjectOneDetails[1] != "-") {
    for (var i = 0; i < subjectOne.length; i++) {
      subjectOne[i].title = subjectOneDetails[1] + " | " + subjectOneDetails[3];
      subjectOne[i].children[0].children[0].innerHTML += "<br><b>" + subjectOneDetails[1] + "</b>";
      if (localStorage["tnamesVisible"]) {
        subjectOne[i].children[0].children[0].innerHTML += "<br>" + subjectOneDetails[3];
      };
      subjectOne[i].children[0].href = subjectOneDetails[2];
      subjectOne[i].classList.add("nonactive", "sub1")
    }
  };

  var subjectTwo = document.getElementsByClassName(subjectTwoDetails[0]);
  if (subjectTwoDetails[1] != "-") {
    for (var i = 0; i < subjectTwo.length; i++) {
      subjectTwo[i].title = subjectTwoDetails[1] + " | " + subjectTwoDetails[3];
      subjectTwo[i].children[0].children[0].innerHTML += "<br><b>" + subjectTwoDetails[1] + "</b>";
      if (localStorage["tnamesVisible"]) {
        subjectTwo[i].children[0].children[0].innerHTML += "<br>" + subjectTwoDetails[3];
      };
      subjectTwo[i].children[0].href = subjectTwoDetails[2];
      subjectTwo[i].classList.add("nonactive", "sub2")
    }
  };

  var subjectThree = document.getElementsByClassName(subjectThreeDetails[0]);
  if (subjectThreeDetails[1] != "-") {
    for (var i = 0; i < subjectThree.length; i++) {
      subjectThree[i].title = subjectThreeDetails[1] + " | " + subjectThreeDetails[3];
      subjectThree[i].children[0].children[0].innerHTML += "<br><b>" + subjectThreeDetails[1] + "</b>";
      if (localStorage["tnamesVisible"]) {
        subjectThree[i].children[0].children[0].innerHTML += "<br>" + subjectThreeDetails[3];
      };
      subjectThree[i].children[0].href = subjectThreeDetails[2];
      subjectThree[i].classList.add("nonactive", "sub3")
    }
  };

  var subjectFour = document.getElementsByClassName(subjectFourDetails[0]);
  if (subjectFourDetails[1] != "-") {
    for (var i = 0; i < subjectFour.length; i++) {
      subjectFour[i].title = subjectFourDetails[1] + " | " + subjectFourDetails[3];
      subjectFour[i].children[0].children[0].innerHTML += "<br><b>" + subjectFourDetails[1] + "</b>";
      if (localStorage["tnamesVisible"]) {
        subjectFour[i].children[0].children[0].innerHTML += "<br>" + subjectFourDetails[3];
      };
      subjectFour[i].children[0].href = subjectFourDetails[2];
      subjectFour[i].classList.add("nonactive", "sub4")
    }
  };

  var subjectFive = document.getElementsByClassName(subjectFiveDetails[0]);
  if (subjectFiveDetails[1] != "-") {
    for (var i = 0; i < subjectFive.length; i++) {
      subjectFive[i].title = subjectFiveDetails[1] + " | " + subjectFiveDetails[3];
      subjectFive[i].children[0].children[0].innerHTML += "<br><b>" + subjectFiveDetails[1] + "</b>";
      if (localStorage["tnamesVisible"]) {
        subjectFive[i].children[0].children[0].innerHTML += "<br>" + subjectFiveDetails[3];
      };
      subjectFive[i].children[0].href = subjectFiveDetails[2];
      subjectFive[i].classList.add("nonactive", "sub5")
    }
  };

  var subjectSix = document.getElementsByClassName(subjectSixDetails[0]);
  if (subjectSixDetails[1] != "-") {
    for (var i = 0; i < subjectSix.length; i++) {
      subjectSix[i].title = subjectSixDetails[1] + " | " + subjectSixDetails[3];
      subjectSix[i].children[0].children[0].innerHTML += "<br><b>" + subjectSixDetails[1] + "</b>";
      if (localStorage["tnamesVisible"]) {
        subjectSix[i].children[0].children[0].innerHTML += "<br>" + subjectSixDetails[3];
      };
      subjectSix[i].children[0].href = subjectSixDetails[2];
      subjectSix[i].classList.add("nonactive", "sub6")
    }
  };

  var calDay = new Date().getDay();
  var calHour = new Date().getHours();
  var calTime;
  /*calDay = 3;
  calHour = 8;*/

  if (calHour == 7 || calHour == 8) {
    calTime = "periodOne"
  } else if (calHour == 9) {
    calTime = "periodTwo"
  } else if (calHour == 10 || calHour == 11) {
    calTime = "periodThree"
  } else if (calHour == 12 || calHour == 13) {
    calTime = "periodFour"
  };

  if (calDay == 0 || calDay == 6) {
    document.getElementById("weekend").style.visibility = "visible";
  } else {
    document.getElementById("weekend").style.display = "none";
    if (calHour > 6 && calHour < 14) {
      document.getElementById(calTime).children[calDay].children[0].children[0].id = "currentLesson";
    }
  }
} else if (timetableExists === "false") {
  localStorage.setItem("timetableExists", "false");
  document.getElementById("timetable").style.display = "none";
  function saveEntire() {
    localStorage.setItem("period1codesSaved", saveData("period1codes"));
    localStorage.setItem("period2codesSaved", saveData("period2codes"));
    localStorage.setItem("period3codesSaved", saveData("period3codes"));
    localStorage.setItem("period4codesSaved", saveData("period4codes"));
    localStorage.setItem("subject1detailsSaved", saveData("subject1details"));
    localStorage.setItem("subject2detailsSaved", saveData("subject2details"));
    localStorage.setItem("subject3detailsSaved", saveData("subject3details"));
    localStorage.setItem("subject4detailsSaved", saveData("subject4details"));
    localStorage.setItem("subject5detailsSaved", saveData("subject5details"));
    localStorage.setItem("subject6detailsSaved", saveData("subject6details"));
    localStorage.setItem("timetableExists", "true");
    location.reload();
  };

  function saveData(dataClass) {
    var dataArray = document.getElementsByClassName(dataClass)
    var dataTemp = [""]
    for (var i = 0; i < dataArray.length; i++) {
       if (dataArray[i].value) {
         dataTemp[i] = dataArray[i].value
       } else {
         dataTemp[i] = "-"
       }
    };
    if (dataClass.includes("subject") && dataTemp[2] === "-") {
      dataTemp[2] = "#"
    };
    return dataTemp
  };

  for (var i = 0; i < 5; i++) {
    document.getElementsByClassName("period1codes")[i].value = localStorage.getItem("period1codesSaved").split(",")[i];
    document.getElementsByClassName("period2codes")[i].value = localStorage.getItem("period2codesSaved").split(",")[i];
    document.getElementsByClassName("period3codes")[i].value = localStorage.getItem("period3codesSaved").split(",")[i];
    document.getElementsByClassName("period4codes")[i].value = localStorage.getItem("period4codesSaved").split(",")[i];
  };
  for (var i = 0; i < 4; i++) {
    document.getElementsByClassName("subject1details")[i].value = localStorage.getItem("subject1detailsSaved").split(",")[i];
    document.getElementsByClassName("subject2details")[i].value = localStorage.getItem("subject2detailsSaved").split(",")[i];
    document.getElementsByClassName("subject3details")[i].value = localStorage.getItem("subject3detailsSaved").split(",")[i];
    document.getElementsByClassName("subject4details")[i].value = localStorage.getItem("subject4detailsSaved").split(",")[i];
    document.getElementsByClassName("subject5details")[i].value = localStorage.getItem("subject5detailsSaved").split(",")[i];
    document.getElementsByClassName("subject6details")[i].value = localStorage.getItem("subject6detailsSaved").split(",")[i];
  };
  var completeArray = document.getElementsByClassName("cell");
  for (var i = 0; i < completeArray.length; i++) {
    if (completeArray[i].value === "-" || completeArray[i].value === "#") {
      completeArray[i].value = ""
    }
  }
} else {
  localStorage.setItem("timetableExists", "false");
  location.reload()
}
function editTable() {
  localStorage.setItem("timetableExists", "false");
  location.reload();
}

function importTable() {
  var dataImport = prompt("Enter Data:").split(";");
  if (dataImport != "") {
    var arrayP1 = document.getElementsByClassName("period1codes");
    for (var i = 0; i < arrayP1.length; i++) {
      arrayP1[i].value = dataImport[0].split(",")[i]
    }
    var arrayP2 = document.getElementsByClassName("period2codes");
    for (var i = 0; i < arrayP2.length; i++) {
      arrayP2[i].value = dataImport[1].split(",")[i]
    }
    var arrayP3 = document.getElementsByClassName("period3codes");
    for (var i = 0; i < arrayP3.length; i++) {
      arrayP3[i].value = dataImport[2].split(",")[i]
    }
    var arrayP4 = document.getElementsByClassName("period4codes");
    for (var i = 0; i < arrayP4.length; i++) {
      arrayP4[i].value = dataImport[3].split(",")[i]
    }
    var arrayS1 = document.getElementsByClassName("subject1details");
    for (var i = 0; i < arrayS1.length; i++) {
      arrayS1[i].value = dataImport[4].split(",")[i]
    }
    var arrayS2 = document.getElementsByClassName("subject2details");
    for (var i = 0; i < arrayS2.length; i++) {
      arrayS2[i].value = dataImport[5].split(",")[i]
    }
    var arrayS3 = document.getElementsByClassName("subject3details");
    for (var i = 0; i < arrayS3.length; i++) {
      arrayS3[i].value = dataImport[6].split(",")[i]
    }
    var arrayS4 = document.getElementsByClassName("subject4details");
    for (var i = 0; i < arrayS4.length; i++) {
      arrayS4[i].value = dataImport[7].split(",")[i]
    }
    var arrayS5 = document.getElementsByClassName("subject5details");
    for (var i = 0; i < arrayS5.length; i++) {
      arrayS5[i].value = dataImport[8].split(",")[i]
    }
    var arrayS6 = document.getElementsByClassName("subject6details");
    for (var i = 0; i < arrayS6.length; i++) {
      arrayS6[i].value = dataImport[9].split(",")[i]
    }
    var completeArray = document.getElementsByClassName("cell");
    for (var i = 0; i < completeArray.length; i++) {
      if (completeArray[i].value === "-" || completeArray[i].value === "#" || completeArray[i].value === "undefined") {
        completeArray[i].value = ""
      }
    }
  }
};

function exportTable() {
  var completeCodes = "";
  for (var i = 1; i < 5; i++) {
    completeCodes += localStorage.getItem("period" + [i] + "codesSaved") + ";"
  };
  for (var i = 1; i < 7; i++) {
    completeCodes += localStorage.getItem("subject" + [i] + "detailsSaved") + ";"
  };
  prompt("Export Data:\n(Save this in case your local storage is wiped)", completeCodes);
}

/*function showTnames() {
  localStorage.setItem("tnamesVisible", "true")
}

function hideTnames() {
  localStorage.setItem("tnamesVisible", "false")
}*/

/*function toggleTnames() {
  if (localStorage.getItem("tnamesVisible") === "true") {
    localStorage.setItem("tnamesVisible", "false")
  } else {
    localStorage.setItem("tnamesVisible", "true")
  }
}
if (localStorage["tnamesVisible"]) {
  tableCells = document.getElementsByTagName("td");
  for (var i = 0; i < tableCells.length; i++) {
    tableCells[i].classList.add("extended")
  }
}*/
function checkTnames() {
  if (document.getElementById("tnamesCheckbox").checked == true) {
    localStorage.setItem("tnamesVisible", "true");
  } else {
    localStorage.removeItem("tnamesVisible")
  }
}
//checkTnames()
if (localStorage["tnamesVisible"]) {
  document.getElementById("tnamesCheckbox").checked = true;
  tableCells = document.getElementsByTagName("td");
  for (var i = 0; i < tableCells.length; i++) {
    tableCells[i].classList.add("extended")
  };
}

if (localStorage["bgColour"]) {
  setColours(localStorage.getItem("bgColour"), localStorage.getItem("txColour"));
  document.getElementById("colourBg").value = localStorage.getItem("bgColour");
  document.getElementById("colourTx").value = localStorage.getItem("txColour");
}
if (localStorage["cmcChecked"]) {
  document.getElementById("cmcCheckbox").checked = true
}
function disableCmc() {
  document.getElementById("cmcCheckbox").checked = false;
  checkCmc()
}
function checkCmc() {
  if (document.getElementById("cmcCheckbox").checked == true) {
    localStorage.setItem("bgColour", document.getElementById("colourBg").value);
    localStorage.setItem("txColour", document.getElementById("colourTx").value);
    setColours(localStorage.getItem("bgColour"), localStorage.getItem("txColour"));
    localStorage.setItem("cmcChecked", "true");
  } else {
    localStorage.removeItem("bgColour");
    localStorage.removeItem("txColour");
    setColours("black", "white");
    localStorage.removeItem("cmcChecked");
  }
}
function setColours(bgColour, txColour) {
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
  /*for (var i = 0; i < document.getElementsByTagName("td").length; i++) {
    document.getElementsByTagName("td")[i].style.borderColor = txColour;
  }*/
}

/*function disableCnl() {
  if (document.getElementById("cnlCheckbox").checked == true) {
    localStorage.setItem("disableCnl", "true");
  } else {
    localStorage.removeItem("disableCnl")
  }
}
if (localStorage["disableCnl"]) {
  document.getElementById("cnlCheckbox").checked = true;
} else {
  document.getElementById("currentLesson").style.backgroundColor = "grey"
}*/
