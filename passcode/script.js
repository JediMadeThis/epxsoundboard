// DO NOT TOUCH
const PASSCODE = 420420;

const pass = document.getElementById('pass');
const redir = document.getElementById('redir');

pass.addEventListener('input', (event) => {
  const e = event.target;
  if (e.value.length > e.maxLength) {
    e.value = e.value.slice(0, e.maxLength);
  }

  e.value = e.value.replace(/\D/g, '');
});

pass.addEventListener('input', async (event) => {
  const e = event.target;

  await wait(100);

  if (e.value.length >= 6) {
    if (pass.value === String(PASSCODE)) {
      e.value = '';
      e.disabled = true;

      sessionStorage.setItem('redirectedFromPasscode', 'true');
      location.href = '../index.html';
    } else {
      alert('Incorrect password.');
      e.value = '';
    }
  }
});

// Animation
const allElements = document.body.querySelectorAll(':not(div, audio, link)');
const ANIMATION_DELAY = 0.1;

allElements.forEach((element, i) => {
  let delay = (i + 1) * ANIMATION_DELAY;
  element.style.animationDelay = `${delay}s`;
});

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
