let colorSpans = document.querySelectorAll(".colors span");
let fontColorBtn = colorSpans[0];
let backgroundColorBtn = colorSpans[1];

let alignmentSpans = document.querySelectorAll(".alignment span");
let leftAlignBtn = alignmentSpans[0];
let centerAlignBtn = alignmentSpans[1];
let rightAlignBtn = alignmentSpans[2];

leftAlignBtn.addEventListener("click", function () {
  oldCell.style.textAlign = "left";
  let address = oldCell.getAttribute("data-address");
  dataObj[address].textAlign = "left";
});

centerAlignBtn.addEventListener("click", function () {
  oldCell.style.textAlign = "center";
  let address = oldCell.getAttribute("data-address");
  dataObj[address].textAlign = "center";
});

rightAlignBtn.addEventListener("click", function () {
  oldCell.style.textAlign = "right";
  let address = oldCell.getAttribute("data-address");
  dataObj[address].textAlign = "right";
});

fontColorBtn.addEventListener("click", function () {
  //oldCell wale ka font color change kardo
  let colorPicker = document.createElement("input");
  colorPicker.type = "color";

  colorPicker.addEventListener("change", function (e) {
    console.log(e.currentTarget.value);
    oldCell.style.color = e.currentTarget.value;
    let address = oldCell.getAttribute("data-address");
    dataObj[address].fontColor = e.currentTarget.value;
  });

  colorPicker.click();
});

backgroundColorBtn.addEventListener("click", function () {
  //oldCell wale ka background color change kardo
  let colorPicker = document.createElement("input");
  colorPicker.type = "color";

  colorPicker.addEventListener("change", function (e) {
    console.log(e.currentTarget.value);
    oldCell.style.backgroundColor = e.currentTarget.value;
    let address = oldCell.getAttribute("data-address");
    dataObj[address].backgroundColor = e.currentTarget.value;
    console.log(dataObj[address]);
  });

  colorPicker.click();
});


