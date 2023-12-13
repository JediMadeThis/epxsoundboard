// CHECK PASSCODE/LOCK
let redirectedFromPasscode = sessionStorage.getItem('redirectedFromPasscode');

// If not redirected from passcode.html, redirect to passcode.html
if (!redirectedFromPasscode) {
  window.location.href = './passcode/index.html';
}

let isLoaded = false;
document.addEventListener('DOMContentLoaded', () => {
  isLoaded = true;
});

let loadInterval = setInterval(() => {
  if (isLoaded && redirectedFromPasscode) {
    clearInterval(loadInterval);
    document.body.hidden = false;
  }
});

sessionStorage.removeItem('redirectedFromPasscode');

const lockBtn = document.getElementById('lock');

let lockPresses = 0;
let lockRefresh;

// Developer options
const devOptions = document.getElementById('devOptions');
const devSpeedDrop = document.getElementById('devSpeedDrop');
const devPreservePitch = document.getElementById('devPreservePitch');

let developerPresses = 0;
let developerRefresh;
let isDeveloper = false;

document.getElementById('version').addEventListener('click', () => {
  if (isDeveloper) return;

  if (developerPresses < 1) {
    developerRefresh = setTimeout(() => {
      developerPresses = 0;
      clearTimeout(developerRefresh);
    }, 5000);
  }

  if (developerPresses < 10) {
    developerPresses++;
    console.log(`Pressed developer mode (${developerPresses})`);
  }

  if (developerPresses >= 10) {
    isDeveloper = true;
    clearTimeout(developerRefresh);
    alert("You're now a developer!");

    enableDev();
  }
});

function enableDev() {
  devOptions.hidden = false;
}

devSpeedDrop.addEventListener('change', (event) => {
  setPlaybackSpeed(event.target.value);
});

devPreservePitch.addEventListener('change', (event) => {
  Object.values(audios).forEach((audio) => {
    audio.preservesPitch = event.target.checked;
  });
});

// Audio objects
let audioNames = {};
let audios = {};
let audiosIdS = {};
let audiosIdA = {};

document.querySelectorAll('audio').forEach((audio, i) => {
  audios[`s${i + 1}`] = document.getElementById(audio.id);

  audiosIdS[`s${i + 1}`] = audio.id;
  audiosIdA[`a${i + 1}`] = `s${i + 1}`;
});

document.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', check);
  btn.addEventListener('click', checkHoverEnter);
  btn.addEventListener('mouseover', checkHoverEnter);
  btn.addEventListener('mouseleave', checkHoverLeave);

  if (btn.id.startsWith('s')) {
    audioNames[btn.getAttribute('id')] = btn.textContent;
  }
});

let overInterval;
let leaveInterval;

function checkHoverEnter(event) {
  clearInterval(overInterval);

  const btn = event.target;
  const btnId = btn.getAttribute('id');

  if (btnId === 'stopAudio' || btnId === 'lock') return;
  if (audios[btnId].paused) return;

  overInterval = setInterval(() => {
    if (audios[btnId].paused) return;
    const time = getTime(btnId);

    btn.textContent = `${audioNames[btnId]} (${formatSeconds(
      time.currentTime
    )}/${formatSeconds(time.duration)})`;
  }, 2);
}

// Checks when cursor leaves button
function checkHoverLeave(event) {
  const btn = event.target;
  const btnId = btn.getAttribute('id');

  if (btnId === 'stopAudio' || btnId === 'lock') return;

  clearInterval(overInterval);

  btn.textContent = audioNames[btnId];
}

// Get current & duration time of audio element
function getTime(btnId) {
  let currentTime = audios[btnId].currentTime;
  let duration = audios[btnId].duration;

  return { currentTime, duration };
}

// Detect button click
function check(event) {
  const btnId = event.target.getAttribute('id');

  if (btnId === 'stopAudio') {
    return stopAllSounds();
  } else if (btnId === 'lock') {
    clearTimeout(lockRefresh);
    lockRefresh = setTimeout(() => {
      lockPresses = 0;
      lockBtn.textContent = 'Lock';

      clearTimeout(lockRefresh);
    }, 3000);

    if (lockPresses < 5) {
      lockPresses++;
      lockBtn.textContent = `Lock (${5 - lockPresses})`;
    }

    if (lockPresses >= 5) {
      clearTimeout(lockRefresh);

      lockPresses = 0;
      lockBtn.textContent = 'Lock';

      sessionStorage.removeItem('redirectedFromPasscode');
      stopAllSounds();

      window.location.href = './passcode/index.html';
    }
  } else {
    playSound(audios[btnId]);
  }
}

// Audio playingg button animation
let opacity = 0;
let increment = 1;
let max = 99;

setInterval(() => {
  Object.values(audiosIdS).forEach((audioId) => {
    const audio = document.getElementById(audioId);
    const btn = document.getElementById(audiosIdA[audioId]);

    if (audio.paused) {
      btn.textContent = audioNames[btn.getAttribute('id')];

      if (btn.classList.contains('sfx')) {
        btn.style.backgroundColor = '#000099';
      }

      if (btn.classList.contains('song')) {
        btn.style.backgroundColor = '#007700';
      }
    }

    if (!audio.paused) {
      if (btn.classList.contains('sfx')) {
        btn.style.backgroundColor = `#000099${
          opacity < 10 ? '0' : ''
        }${opacity}`;
      }

      if (btn.classList.contains('song')) {
        btn.style.backgroundColor = `#007700${
          opacity < 10 ? '0' : ''
        }${opacity}`;
      }
    }
  });
});

function bounceNumber() {
  if (opacity <= max && opacity + increment > max) {
    increment = -1;
  } else if (opacity >= 0 && opacity + increment < 0) {
    increment = 1;
  }

  opacity += increment;
}

setInterval(bounceNumber, 10);

// Default Animation
const allElements = document.body.querySelectorAll(':not(div, audio, link)');
const ANIMATION_DELAY = 0.1;

allElements.forEach((element, i) => {
  let delay = i * ANIMATION_DELAY;
  element.style.animationDelay = `${delay}s`;
});

// Other functions
function playSound(audio) {
  audio.volume = 1;

  if (typeof audio === 'string') {
    document.getElementById(audio).play();
    return;
  } else {
    audio.play();
  }
}

function stopAllSounds() {
  Object.values(audios).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    console.log(`${audio} stopped`);
  });
}

function setPlaybackSpeed(speed) {
  Object.values(audios).forEach((audio) => {
    audio.playbackRate = speed;
  });
}

function formatSeconds(s) {
  return new Date(s * 1000).toISOString().slice(14, 19);
}
