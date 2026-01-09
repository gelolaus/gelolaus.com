/* =========================================
   Contains the core utilties, audio, and drag & drop functionality.
   ========================================= */

/* --- AUDIO SETTINGS --- */
const clickSound = new Audio('assets/sounds/click.mp3');
clickSound.volume = 0.4;

const keySound = new Audio('assets/sounds/keypress.wav'); 
keySound.volume = 0.2; 

function playClick() {
    const sound = clickSound.cloneNode();
    sound.volume = 0.4;
    sound.play().catch(e => {});
}

function playKey() {
    const sound = keySound.cloneNode();
    sound.volume = 0.2;
    sound.play().catch(e => {});
}

document.addEventListener('keydown', function(e) {
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
        return;
    }
    playKey();
});

/* --- CLOCK --- */
function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}
setInterval(updateClock, 1000);
updateClock();

/* --- Z-INDEX MANAGEMENT --- */
let highestZ = 10;

function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;
}

/* --- INTERACT.JS CONFIG (Drag & Drop) --- */
if (typeof interact !== 'undefined') {
    interact('.draggable')
      .draggable({
        allowFrom: '.window-header', 
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        autoScroll: true,
        listeners: { 
          move: function(event) {
            if (window.innerWidth < 768) return; 
            dragMoveListener(event);
          }
        }
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: false },
        listeners: {
          move: function (event) {
            if (window.innerWidth < 768) return; 

            let { x, y } = event.target.dataset;
            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`
            });

            Object.assign(event.target.dataset, { x, y });
          }
        }
      });
}

function dragMoveListener (event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// Add event listener for Z-Index
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.draggable').forEach(win => {
        win.addEventListener('mousedown', () => bringToFront(win));
    });
});