// DO NOT TOUCH
const VERSION = 0.21;

const versionE = document.getElementById('version');
versionE.textContent = `Version: ${VERSION}`;

const devOptions = document.getElementById('devOptions');
const devSpeedDrop = document.getElementById('devSpeedDrop');
const devPreservePitch = document.getElementById('devPreservePitch');
const devEvalInput = document.getElementById('devEvalInput');
const devEvalOutput = document.getElementById('devEvalOutput');
const devEvalRun = document.getElementById('devEvalRun');

let developerPresses = 0;
let developerRefresh;
let isDeveloper = false;

versionE.addEventListener('click', () => {
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

devEvalInput.addEventListener('keypress', (event) => {
  const val = devEvalInput.value;

  if (event.key === 'Enter') {
    devEvalInput.value = '';
    eval(val);
  }
});

devEvalRun.addEventListener('click', () => {
  const val = devEvalInput.value;

  devEvalInput.value = '';
  eval(val);
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
  } else if (btnId === 'versionBtn') {
  } else {
    playSound(audios[btnId]);
  }
}

function playSound(audio) {
  if (typeof audio === 'string') {
    return document.getElementById(audio).play();
  } else {
    audio.play();
  }
}

function stopAllSounds() {
  Object.values(audios).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function setPlaybackSpeed(speed) {
  Object.values(audios).forEach((audio) => {
    audio.playbackRate = speed;
  });
}

// TODO: fade track on stop
