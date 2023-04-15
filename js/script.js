renderButtons();
renderFloors();

let elevator = document.querySelector('.elevator');
let elevatorWrap = document.querySelector('.elev-wrap');
let elevatorImg = document.querySelector('#elevator-img');
let leftDoorImg = document.querySelector('#left-door-img');
let rightDoorImg = document.querySelector('#right-door-img');
let floor = document.getElementById('floor_1');
let floorHeight = getComputedStyle(floor).height;
let floorHeightNumber = parseInt(floorHeight);
let floorWidth = floorHeightNumber / 1.52;
let buttonFromPanel = document.querySelector('.button-block');
let btnCallElevator = document.querySelectorAll('.btn-call-elevator');
let block1 = document.querySelector('.block1');
let arrow = document.querySelector('.arrow');
let floorsNumber = document.querySelector('.number').childNodes[0];
let floorsButton = document.querySelector('.renderingFloors');

let currentFloor = 0;
let interval;
let floorCallStack = [];

changeElevHeight();

function changeElevHeight() {
  elevatorImg.style.height = floorHeight;
}
// ----------------------------------------------------------------

function openTheDoor(floor) {
  rightDoorImg.style.marginLeft = floorWidth + 'px';
  console.log('openTheDoor');
  arrow.style.backgroundImage = 'url("./img/inactive.png")';
  clearInterval(interval);
}

function closeTheDoor() {
  console.log('closeTheDoor');
  rightDoorImg.style.marginLeft = '0';
  return true;
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------------------------------------------
function moveUpMoveDown(floorNum) {
  elevatorWrap.style.marginBottom = floorHeightNumber*(floorNum-1) - 1 + 'px';
  currentFloor = floorNum;
  return floorNum;
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
  console.log(currentFloor);
}
// -----------------------------------------------------------

async function moveElevator(floor) {
  console.log('moveElevator');
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
    await timeout(2000);
    moveUpMoveDown(floor);

    await timeout(2000);
    openTheDoor(floor);
    floorsNumber.innerText = floor;
    
    await timeout(2000);
    closeTheDoor();    
}

// -----------------------------------------------------------

block1.addEventListener('click', function (e) {
  const dataFloorValue = e.target.dataset.floor;
  console.log(dataFloorValue);
  floorCallStack.push(+dataFloorValue);
  console.log(floorCallStack);
  if (dataFloorValue) { // && якшо немає руху ліфта - то не виконувати runElevator
    runElevator();
  }
});

async function runElevator() {
  if (!floorCallStack.length) {
    void(0);
  } 
  let nextFloor = floorCallStack.shift() // - взяти перший ел з масиву
  await moveElevator(nextFloor); // - передати його ф-ції await moveElevator
  runElevator() // - наступний виклик ф-ції не може розпочатись, поки не закінчиться виконання ф-ції moveElevator - знову виконати runElevator
}



function renderFloors () {
  console.log('renderFloors');
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
  console.log('renderButtons');
  let buttonsTemplate = ``;
  for (let i = 1; i <= configFloors.floorsCount; i++){
  buttonsTemplate +=  `<button class = 'panBut btn-call-elevator' data-floor='${i}'>${i}</button>`
  };
  document.querySelector('.button-block').innerHTML = buttonsTemplate;
}

// --------------------- voice API -------------------------
// function voiceScript() {
//   let voiceScript = document.createElement('script');
// voiceScript.setAttribute('src',"https://code.responsivevoice.org/responsivevoice.js?key=" + apiConfig.key);
// document.head.appendChild(voiceScript);
//  } 

// responsiveVoice.speak("Обережно Назік", "Ukrainian Female");




