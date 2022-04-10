let body = document.querySelector("body");
body.spellcheck = false;

let columnTags = document.querySelector(".column-tags");
let rowNumbers = document.querySelector(".row-numbers");

let formulaSelectCell = document.querySelector("#select-cell");

let formulaInput = document.querySelector("#complete-formula");

let oldCell;

let grid = document.querySelector(".grid");

let menuBarPtags = document.querySelectorAll(".menu-bar p");

let fileOptions = menuBarPtags[0];

let dataObj = {};

fileOptions.addEventListener("click", function (e) {
  if (e.currentTarget.classList == 0) {
    e.currentTarget.innerHTML = `File
    <span>
      <span>Clear</span>
      <span>Open</span>
      <span>Save</span>
    </span>`;

    let allFileOptions = e.currentTarget.querySelectorAll("span > span");

    //Clear
    allFileOptions[0].addEventListener("click", function () {
      let allCells = document.querySelectorAll(".cell");
      for (let i = 0; i < allCells.length; i++) {
        allCells[i].innerText = "";
        let cellAdd = allCells[i].getAttribute("data-address");
        dataObj[cellAdd] = {
          value: "",
          formula: "",
          upstream: [],
          downstream: [],
          fontSize: 10,
          fontFamily: "Arial",
          fontWeight: "normal",
          color: "black",
          backgroundColor: "white",
          underline: "none",
          italics: "normal",
          textAlign: "left",
        };
      }
    });

    //Open
    allFileOptions[1].addEventListener("click", function () {
      //1 - Frtch dataObj from localstorage
      //2 - Replace current dataObj with current Obj
      dataObj = JSON.parse(localStorage.getItem("sheet"));

      //3 - Populate UI with this data
      for (let j = 1; j <= 100; j++) {
        for (let i = 0; i < 26; i++) {
          let address = String.fromCharCode(i + 65) + j;
          let cellObj = dataObj[address];
          let cellOnUi = document.querySelector(`[data-address = ${address}]`);
          cellOnUi.innerText = cellObj.value;
          cellOnUi.style.backgroundColor = cellObj.backgroundColor;
          //same work can be done for CSS styling
        }
      }
    });

    //Save
    allFileOptions[2].addEventListener("click", function () {
      localStorage.setItem("sheet", JSON.stringify(dataObj));
    });
  } else {
    e.currentTarget.innerHTML = `File`;
  }
});

for (let i = 0; i < menuBarPtags.length; i++) {
  menuBarPtags[i].addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("menu-bar-option-selected")) {
      e.currentTarget.classList.remove("menu-bar-option-selected");
    } else {
      for (let j = 0; j < menuBarPtags.length; j++) {
        if (menuBarPtags[j].classList.contains("menu-bar-option-selected")) {
          menuBarPtags[j].classList.remove("menu-bar-option-selected");
        }
      }
      e.currentTarget.classList.add("menu-bar-option-selected");
    }
  });
}

for (let i = 0; i < 26; i++) {
  let div = document.createElement("div");
  div.classList.add("column-tag-cell");
  div.innerText = String.fromCharCode(65 + i);
  columnTags.append(div);
}

for (let i = 1; i <= 100; i++) {
  let div = document.createElement("div");
  div.classList.add("row-number-cell");
  div.innerText = i;
  rowNumbers.append(div);
}

for (let j = 1; j <= 100; j++) {
  let row = document.createElement("div");
  row.classList.add("row");

  for (let i = 0; i < 26; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    let address = String.fromCharCode(i + 65) + j;
    cell.setAttribute("data-address", address);

    dataObj[address] = {
      value: "",
      formula: "",
      upstream: [],
      downstream: [],
      fontSize: 10,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "black",
      backgroundColor: "white",
      underline: "none",
      italics: "normal",
      textAlign: "left",
    };

    cell.addEventListener("click", function (e) {
      //check karo kya koi old cell hain pehle se selected
      if (oldCell) {
        //agar haan toh use deselect karke class remove karo
        oldCell.classList.remove("grid-selected-cell");
      }
      //jis cell ko click kaar use select karo class add karke
      e.currentTarget.classList.add("grid-selected-cell");

      let cellAddress = e.currentTarget.getAttribute("data-address");

      formulaSelectCell.value = cellAddress;
      // ab jo naya cell select hua hain use save kardo oldCell wale variable mein taki next time click ho kisi naye cell par toh ise deselect kar paaye
      oldCell = e.currentTarget;
    });

    cell.addEventListener("input", function (e) {
      console.log(e.currentTarget.innerText);
      let address = e.currentTarget.getAttribute("data-address");
      dataObj[address].value = Number(e.currentTarget.innerText);
      console.log(dataObj[address]);
      dataObj[address].formula = "";

      //upstream clear karni hain
      let currCellUpstream = dataObj[address].upstream;

      for (let i = 0; i < currCellUpstream.length; i++) {
        removeFromUpstream(address, currCellUpstream[i]);
      }
      dataObj[address].upstream = [];
      //downstream ke cells ko update karna hain
      let currCellDownstream = dataObj[address].downstream;

      for (let i = 0; i < currCellDownstream.length; i++) {
        updateDownstreamElements(currCellDownstream[i]);
      }
      console.log(dataObj);
    });

    cell.contentEditable = true;
    row.append(cell);
  }
  grid.append(row);
}

formulaInput.addEventListener("change", function (e) {
  let formula = e.currentTarget.value; //"2 * A1"

  let selectedCellAddress = oldCell.getAttribute("data-address");

  dataObj[selectedCellAddress].formula = formula;

  let formulaArr = formula.split(" "); //["2", "*", "A1"]

  let elementsArray = [];

  for (let i = 0; i < formulaArr.length; i++) {
    if (
      formulaArr[i] != "+" &&
      formulaArr[i] != "-" &&
      formulaArr[i] != "*" &&
      formulaArr[i] != "/" &&
      isNaN(Number(formulaArr[i]))
    ) {
      elementsArray.push(formulaArr[i]);
    }
  }

  //Before setting new upstream
  //clear old upstream
  let oldUpstream = dataObj[selectedCellAddress].upstream;

  //Old formula : B1 = 2 * A1
  //oldUpstream = [A1]
  for (let k = 0; k < oldUpstream.length; k++) {
    removeFromUpstream(selectedCellAddress, oldUpstream[k]);
  }

  dataObj[selectedCellAddress].upstream = elementsArray;

  //C1 = A1 + B1
  //A1 + B1 => [A1,B1] = elementsArray
  //selectedCellAddress = C1
  for (let j = 0; j < elementsArray.length; j++) {
    addToDownstream(selectedCellAddress, elementsArray[j]);
  }

  let valObj = {};

  //C1 = A1 + B1
  //A1 + B1 => [A1(20),B1(40)] = elementsArray
  for (let i = 0; i < elementsArray.length; i++) {
    //Jis par depend karega mere cell ka formula = elementsArray[i];
    let formulaDependency = elementsArray[i];
    valObj[formulaDependency] = dataObj[formulaDependency].value; //valObj = {A1:20,B1:30}
  }

  //valObj = {A1:20,B1:30}
  //formulaArr = [A1,+,B1]
  //After the loop below formulaArr = [20,+,30]
  for (let j = 0; j < formulaArr.length; j++) {
    if (valObj[formulaArr[j]] != undefined) {
      formulaArr[j] = valObj[formulaArr[j]];
    }
  }

  console.log(valObj);
  console.log(formulaArr);
  formula = formulaArr.join(" ");
  console.log(formula);
  let newValue = eval(formula);

  dataObj[selectedCellAddress].value = newValue;

  let selectedCellDownstream = dataObj[selectedCellAddress].downstream;

  for (let i = 0; i < selectedCellDownstream.length; i++) {
    updateDownstreamElements(selectedCellDownstream[i]);
  }

  oldCell.innerText = newValue;
  formulaInput.value = "";
});

function addToDownstream(toBeAdded, inWhichWeAreAdding) {
  //dataObj[inWhichWeAreAdding].downstream.push(toBeAdded);

  //get downstream of the cell in which we have to add
  let reqDownstream = dataObj[inWhichWeAreAdding].downstream;

  reqDownstream.push(toBeAdded);
}

//C1 = 2 * A1
//dependent = C1
//OnwhichItIsDepending = A1

function removeFromUpstream(dependent, OnwhichItIsDepending) {
  let newDownstream = [];
  let oldDownstream = dataObj[OnwhichItIsDepending].downstream; //[C1,Z2]
  for (let i = 0; i < oldDownstream.length; i++) {
    if (oldDownstream[i] != dependent) newDownstream.push(oldDownstream[i]);
  }
  dataObj[OnwhichItIsDepending].downstream = newDownstream;
}

//C1(elementAddress) = A1 + B1
function updateDownstreamElements(elementAddress) {
  //1-jis element ko update kar rahe hain unki upstream elements ki current value leayo
  //unki upstream ke elements ka address use krke dataObj se unki value lao
  //unhe as key value pair store kardo valObj naam ke object mein
  let valObj = {};

  let currCellUpstream = dataObj[elementAddress].upstream; //[A1(value=20),B1(value=30)]

  for (let i = 0; i < currCellUpstream.length; i++) {
    let upstreamCellAddress = currCellUpstream[i]; //1.A1
    let upstreamCellValue = dataObj[upstreamCellAddress].value; //1.20

    valObj[upstreamCellAddress] = upstreamCellValue;

    //valObj = {A1:20,B1:30}
  }

  //2-jis element ko update kar rahe hain uska formula leao
  let currFormula = dataObj[elementAddress].formula; //Formula = "A1 + B1"
  //formula ko space ke basis pr split maro
  //"A1 + B1".split(" ") => ["A1","+","B1"]
  let formulaArr = currFormula.split(" ");
  //valObj["a1"] = 20
  //valObj["+"] = undefined
  //valObj["b1"] = 30
  // Replace A1 and B1 in formulaArr with their values from valObj
  //"A1 + B1".split(" ") => ["20","+","30"].join(" ") => "20 + 30" => eval => 50

  //split marne ke baad jo array mili uspr loop mara and formula mein jo variable hain(cells) unko unki values se replace kardo using valObj
  for (let j = 0; j < formulaArr.length; j++) {
    if (valObj[formulaArr[j]]) {
      formulaArr[j] = valObj[formulaArr[j]];
    }
  }

  //3-Create krlo wapis formula from the array by joining it
  currFormula = formulaArr.join(" ");

  //4-Evaluate the new value using eval function
  let newValue = eval(currFormula);

  //update the cell(jispr function call hua) in dataObj
  dataObj[elementAddress].value = newValue;

  //5-UI pr update krdo new value
  let cellOnUI = document.querySelector(`[data-address = ${elementAddress}]`);
  cellOnUI.innerText = newValue;

  //6-Downstream leke aao jis element ko update kra just abhi kyunki uspr bhi kuch element depend kar sakte hain
  //unko bhi update krna padega
  let currCellDownstream = dataObj[elementAddress].downstream;

  //Check kro ki downstream mein elements hain kya agr han toh un sab pr yehi function call krdo jise wo bhi update hojaye with new value
  if (currCellDownstream.length > 0) {
    for (let k = 0; k < currCellDownstream.length; k++) {
      updateDownstreamElements(currCellDownstream[k]);
    }
  }
}
