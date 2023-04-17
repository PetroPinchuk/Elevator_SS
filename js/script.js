renderButtons();
renderFloors();
let elevatorWrap = document.querySelector('.elev-wrap');
let elevatorImg = document.querySelector('#elevator-img');
let rightDoorImg = document.querySelector('#right-door-img');
let floor = document.getElementById('floor_1');
let floorHeight = getComputedStyle(floor).height;
let floorHeightNumber = parseInt(floorHeight);
let floorWidth = floorHeightNumber / 1.52;
let block1 = document.querySelector('.block1');
let arrow = document.querySelector('.arrow');
let floorsNumber = document.querySelector('.number').childNodes[0];
const liftSound = document.getElementById("lift-sound");
const doorSound = document.getElementById("door-sound");
const mechanicalclamp = document.getElementById("mechanicalclamp");

mechanicalclamp.volume = 0.4; 
let currentFloor = 1;
let isMoving = false;
let interval;
let floorCallStack = [];

changeElevHeight();
openTheDoor();

// ----------------------------------------------------------------
async function voiceControl(floor) {
  clearInterval(interval);
  floorsNumber.innerText = floor;
  floor === 1 
  ? responsiveVoice.speak(`Выхид с будынку`, "Russian Male")
  : responsiveVoice.speak(`Floor ${floor}`, "UK English Male");
}

function openTheDoor() {
  doorSound.play();
  rightDoorImg.style.marginLeft = floorWidth + 'px';
  arrow.style.backgroundImage = 'url("./img/inactive.png")';
}

function closeTheDoor() {
  doorSound.play();
  rightDoorImg.style.marginLeft = '0';
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------------------------------------------
function moveUpMoveDown(floorNum) {
  elevatorWrap.style.marginBottom = floorHeightNumber*(floorNum-1) - 1 + 'px';
  currentFloor = floorNum;
}
// -----------------------------------------------------------
function activeDownArrow() {
  arrow.style.backgroundImage = 'url("./img/active_down.png")';
}
function activeUpArrow() {
  arrow.style.backgroundImage = 'url("./img/active_up.png")';
}
function activeBlackArrow() {
  arrow.style.backgroundImage = 'url("./img/inactive.png")';
}
function arrowAnimation(arrow) {
  arrow();
  setTimeout(activeBlackArrow, 250);
}
// -----------------------------------------------------------

async function moveElevator(floor) {
    isMoving = true;
    await timeout(1000);
    closeTheDoor();
    if (currentFloor > floor) {
      interval = setInterval(function () {
        arrowAnimation(activeDownArrow);
      }, 1000);
    } else if (currentFloor < floor) {
      interval = setInterval(function () {
        arrowAnimation(activeUpArrow);
      }, 1000);
    }
    await timeout(5000);
    moveUpMoveDown(floor);
    mechanicalclamp.play();
    await timeout(4000);
    await voiceControl(floor);
    await timeout(2000);
    responsiveVoice.speak(`Обэрэжно, двэрі відкриваются`, "Russian Male");
    activDisactivBtns(floor, 'remove');
    await timeout(2000);
    openTheDoor(floor);
    await timeout(5000);
     
    isMoving = false;    
}

// -----------------------------------------------------------

block1.addEventListener('click', function (e) {
  const dataFloorValue = e.target.dataset.floor;
  floorCallStack.push(+dataFloorValue);
  floorCallStack.sort((a, b) => b - a);
  console.log(floorCallStack);
  
  activDisactivBtns(dataFloorValue, 'add');
  if (dataFloorValue && !isMoving) { //якшо немає руху ліфта - то не виконувати runElevator
    runElevator();
  }
});

async function runElevator() {
  if (!floorCallStack.length) {
    moveElevator(1);
    return;
  } 
  let nextFloor = floorCallStack.shift();
  await moveElevator(nextFloor);
  runElevator();
}

function activDisactivBtns(floorNum, action) {
  const buttons = document.querySelectorAll(`[data-floor="${floorNum}"]`);
  buttons.forEach((button) => {
    if (action === 'remove') {
      button.style.borderColor = "black";
    }
    if (action === 'add') {
      button.style.borderColor = "red";
  }});
}

function renderFloors () {
  let floorsTemplate = ``;
  for (let i = configFloors.floorsCount; i >= 1 ; i--){
  floorsTemplate +=  `<div id='floor_${i}' class="floor btn-call-elevator">
                          <span>${i}</span>
                          <img class = 'button${i}' data-floor='${i}' src="img/floorButton.png">
                      </div>`
  };
  document.querySelector('.renderingFloors').innerHTML = floorsTemplate;
}

function renderButtons () {
  let buttonsTemplate = ``;
  for (let i = 1; i <= configFloors.floorsCount; i++){
  buttonsTemplate +=  `<button class = 'panBut btn-call-elevator' data-floor='${i}'>${i}</button>`
  };
  document.querySelector('.button-block').innerHTML = buttonsTemplate;
}

function changeElevHeight() {
  elevatorImg.style.height = floorHeight;
}

window.addEventListener('load', (event) => {
  console.log('The page has fully loaded');
  openTheDoor();
});