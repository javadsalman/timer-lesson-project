const timerEl = document.querySelector('.timer')
const clockEl = document.querySelector('.clock')
const hoursEl = document.querySelector('.hours')
const minutesEl = document.querySelector('.minutes')
const secondsEl = document.querySelector('.seconds')
const startEl = document.querySelector('.start')
const pauseEl = document.querySelector('.pause')
const resetEl = document.querySelector('.reset')
const decEl = document.querySelector('.dec')
const incEl = document.querySelector('.inc')

// state
let selectedDuration = 7;
let duration = 7;
let status = 'start'; // start, pause
let selectedTimeType = null // hours, minutes, seconds, null
let beforeFinish = false;
let finished = false;

const notfAudio = new Audio('./alarm.mp3')

// power on timer
timerEl.ondblclick = (e) => {
    setTimeout(() => {
        timerEl.classList.remove('timer-off')
    }, 3000);
}


function changeTime() {
    const seconds = Math.floor(duration % 60**1 / 60**0);
    const minutes = Math.floor(duration % 60**2 / 60**1);
    const hours = Math.floor(duration % 60**3 / 60**2);
    secondsEl.textContent = seconds.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
}

function beforeFinishHandler () {
    beforeFinish = true;
    clockEl.classList.add('clock-before-finish');
    notfAudio.play()
}
function removeBeforeFinishHaandler() {
    beforeFinish = false;
    clockEl.classList.remove('clock-before-finish');
    notfAudio.pause();
    notfAudio.currentTime = 0;
}

function finishHandler() {
    finished = true;
    clockEl.classList.add('clock-finished');
    removeBeforeFinishHaandler()
}

function removeFinishHandler() {
    finished = false;
    clockEl.classList.remove('clock-finished');
}

function startHandler() {
    status = 'start';
    removeBeforeFinishHaandler();
    removeFinishHandler();
    removeAllSelection();
}
startEl.onclick = startHandler;

function pauseHandler() {
    status = 'pause';
    removeBeforeFinishHaandler()
}
pauseEl.onclick = pauseHandler;

function resetHandler() {
    duration = selectedDuration;
    changeTime();
    status = 'pause';
    
    removeBeforeFinishHaandler();
    removeFinishHandler();
}
resetEl.onclick = resetHandler;

const timeElList = document.querySelectorAll('.time');
function selectTimeHandler (e) {
    if (status !== 'pause') return;
    timeElList.forEach(el => this !== el && el.classList.remove('selected'));
    const timeType = this.getAttribute('time-type');
    if (selectedTimeType === timeType) {
        this.classList.remove('selected');
        selectedTimeType = null;
    } else {
        this.classList.add('selected');
        selectedTimeType = timeType;
    }
}
timeElList.forEach(el => el.onclick = selectTimeHandler)

function removeAllSelection() {
    timeElList.forEach(el => el.classList.remove('selected'));
    selectedTimeType = null;

}


function decreaseHandler() {
    if (status !== 'pause' || !selectedTimeType) return;
    let newDuration = duration;
    switch(selectedTimeType) {
        case 'hours':
            newDuration -= 60**2;
            break;
        case 'minutes':
            newDuration -= 60**1;
            break;
        case 'seconds':
            newDuration -= 60**0;
            break;
        default:
    }
    newDuration = Math.ceil(newDuration)
    
    if (newDuration > 0) {
        duration = newDuration;
        selectedDuration = newDuration;
        changeTime();
    }
}
decEl.onclick = decreaseHandler;

function increaseHandler() {
    if (status !== 'pause' || !selectedTimeType) return;
    let newDuration = duration;
    switch(selectedTimeType) {
        case 'hours':
            newDuration += 60**2;
            break;
        case 'minutes':
            newDuration += 60**1;
            break;
        case 'seconds':
            newDuration += 60**0;
            break;
        default:
    }
    if (newDuration < 43200) {
        duration = newDuration;
        selectedDuration = newDuration;
        changeTime();
    }
}
incEl.onclick = increaseHandler;



const interval = setInterval(() => {
    if (status === 'start' && duration !== 0) {
        duration--;
        changeTime();
    }
    if (status == 'start' && duration < 5 && !beforeFinish && !finished) {
        beforeFinishHandler();
    }
    if (duration < 1 && !finished) {
        finishHandler();
    }
}, 1000);

// clearInterval(interval)

