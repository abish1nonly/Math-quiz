const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
const startForm = document.getElementById('start-form');
const startButton = document.getElementById('start-quiz');
const radioInputs = document.querySelectorAll('input');
const radioContainers = document.querySelectorAll('.radio-container');
const bestScores = document.querySelectorAll('.best-score-value');
const countdown = document.querySelector('.countdown');
const itemContainer = document.querySelector('.item-container');
const finalTimeEl = document.querySelector('final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

let firstNumber = 0;
let SecondNumber = 0;
let equationObject = {};
const wrongFormat = [];

let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTimeDisplay = 0;
let finalTime= '0.0s';

let valueY = 0;

function checkTime(){
    console.log(timePlayed);
    if(playerGuessArray.length == questionAmount){
        console.log('playerguess array:', playerGuessArray);
        clearInterval(timer);
        equationsArray.forEach((equation, index) => {
            if(equation.evaluated === playerGuessArray[index]){
                //
            }else{
                penaltyTime += 0.5;
            }
        });
        finalTime = timePlayed + penaltyTime;
        console.log('time', timePlayed, 'penalty: ', penaltyTime, 'final: ', finalTime);
    }
}

function addTime(){
    timePlayed += 0.1;
    checkTime();
}

function startTimer(){
    timePlayed = 0;
    penaltyTime = 0;
    finalTime = 0;
    timer = setInterval(addTime, 100);
    gamePage.removeEventListener('click', startTimer);
}

function select(guessedTrue){
    valueY += 80;
    itemContainer.scroll(0, valueY);
    return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

function showGamePage(){
    gamePage.hidden = false;
    countdownPage.hidden = true;
}

function getRandomInt(max){
    return Math.floor(Math.random()*Math.floor(max));
}

function createEquations(){
    const correctEquations = getRandomInt(questionAmount);
    console.log('correct equation: ', correctEquations);
    const wrongEquations = questionAmount - correctEquations;
    console.log('wrong equation: ', wrongEquations);
    for(let i = 0; i< correctEquations; i++){
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
        equationObject = {value: equation, evaluated: 'true'};
        equationsArray.push(equationObject);
    }
    for (let i = 0; i < wrongEquations; i++){
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
        wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
        wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
        const formatChoice = getRandomInt(3);
        const equation = wrongFormat[formatChoice];
        equationObject = {value: equation, evaluated: 'false'};
        equationsArray.push(equationObject);
    }
    shuffle(equationsArray);
}

function equationsToDOM(){
    equationsArray.forEach((equation) => {
        const item = document.createElement('div');
        item.classList.add('item');
        const equationText = document.createElement('h1');
        equationText.textContent = equation.value;
        item.appendChild(equationText);
        itemContainer.appendChild(item);
    })
}

function countdownStart(){
    countdown.textContent = '3';
    setTimeout(() =>{
        countdown.textContent = '2';
    }, 1000);
    setTimeout(() =>{
        countdown.textContent = '1';
    }, 2000);
    setTimeout(() =>{
        countdown.textContent = 'GO!';
    }, 3000);
}

function showCountdown(){
    countdownPage.hidden = false;
    splashPage.hidden = true;
    countdownStart();
    populateGamePage();
    setTimeout(showGamePage, 4000);
}

function getRadioValue(){
    let radioValue;
    radioInputs.forEach((radioInput) => {
        if(radioInput.checked){
            radioValue = radioInput.value;
        }
    });
    return radioValue;
}

function selectQuestionAmount(e){
    e.preventDefault();
    questionAmount = getRadioValue();
    console.log('Question amount: ', questionAmount);
    if(questionAmount > 0){
        showCountdown();
    }
}

function populateGamePage(){
    itemContainer.textContent = '';
    const topSpacer = document.createElement('div');
    topSpacer.classList.add('height-240');
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    itemContainer.append(topSpacer, selectedItem);

    createEquations();
    equationsToDOM();

    const bottomSpacer = document.createElement('div');
    bottomSpacer.classList.add('height-500');
    itemContainer.appendChild(bottomSpacer);
}

startForm.addEventListener('click', () => {
    radioContainers.forEach((radioEl) => {
        radioEl.classList.remove('selected-label');
        if(radioEl.children[1].checked){
            radioEl.classList.add('selected-label');
        }
    });
});

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);