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

// Clear the flag in sessionStorage (optional)
sessionStorage.removeItem('redirectedFromPasscode');

const lockBtn = document.getElementById('lock');

let lockPresses = 0;
let lockRefresh;

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

let audios = {};

document.querySelectorAll('audio').forEach((audio, i) => {
  audios[`s${i + 1}`] = document.getElementById(audio.id);
});

console.log(audios);

document.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', check);
});

function check(event) {
  const btnId = event.target.id;

  if (btnId === 'stopAudio') {
    return stopAllSounds();
  } else if (btnId === 'lock') {
    lockRefresh = setTimeout(() => {
      lockPresses = 0;
      clearTimeout(lockRefresh);
    }, 3000);

    if (lockPresses < 5) {
      lockPresses++;
    }

    if (lockPresses >= 5) {
      clearTimeout(lockRefresh);

      lockPresses = 0;
      sessionStorage.removeItem('redirectedFromPasscode');
      stopAllSounds();

      window.location.href = './passcode/index.html';
    }
  } else {
    playSound(audios[btnId]);
  }
}

// Animation
const allElements = document.body.querySelectorAll(':not(div, audio, link)');
const ANIMATION_DELAY = 0.1;

allElements.forEach((element, i) => {
  let delay = i * ANIMATION_DELAY;
  element.style.animationDelay = `${delay}s`;
});

function playSound(audio) {
  audio.volume = 1;

  if (typeof audio === 'string') {
    document.getElementById(audio).play();
    return;
  } else {
    audio.play();
  }
}

let fade;

function stopAllSounds() {
  Object.values(audios).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    console.log(`${audio} stopped`);
  });
}

function fadeAudio(audio) {
  if (audio.volume > 0) {
    audio.volume -= Math.min(audio.volume, 0.2);
    fade = setTimeout(fadeAudio, 200);
  } else {
    audio.pause();
    audio.currentTime = 0;
    console.log(`${audio} stopped`);
  }
}

function setPlaybackSpeed(speed) {
  Object.values(audios).forEach((audio) => {
    audio.playbackRate = speed;
  });
}
