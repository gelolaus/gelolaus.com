// =========================================
// SOUND EFFECTS
// =========================================

// Load the click sound effect
const clickSound = new Audio('assets/sounds/click.mp3');
clickSound.volume = 0.4;

// Load the keyboard typing sound
const keySound = new Audio('assets/sounds/keypress.wav');
keySound.volume = 0.2;

// Play a click sound (we clone it so multiple clicks can play at once)
function playClick() {
    const sound = clickSound.cloneNode();
    sound.volume = 0.4;
    sound.play().catch(e => {}); // catch() prevents errors if sound fails
}

// Play a keyboard sound
function playKey() {
    const sound = keySound.cloneNode();
    sound.volume = 0.2;
    sound.play().catch(e => {});
}

// Play keyboard sound whenever user types (except for special keys)
document.addEventListener('keydown', function(e) {
    // Don't play sound for modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
        return;
    }
    playKey();
});

// =========================================
// CLOCK
// =========================================

// Update the time displayed in the taskbar
function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock(); // Set it immediately so we don't wait 1 second

// =========================================
// WINDOW LAYERING
// =========================================

// Keep track of which window is on top
let highestZ = 10;

// Bring a window to the front when clicked
function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;
}

// =========================================
// DRAG AND RESIZE SETUP
// =========================================

// Check if the interact.js library loaded properly
if (typeof interact !== 'undefined') {
    // Make windows draggable
    interact('.draggable')
      .draggable({
        // Only allow dragging from the window header bar
        allowFrom: '.window-header',
        inertia: true, // Smooth motion
        modifiers: [
          // Keep windows inside the screen
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        autoScroll: true,
        listeners: {
          move: function(event) {
            // Disable dragging on mobile (use fullscreen instead)
            if (window.innerWidth < 768) return;
            dragMoveListener(event);
          }
        }
      })
      // Make windows resizable
      .resizable({
        // Allow resizing from left, right, and bottom edges
        edges: { left: true, right: true, bottom: true, top: false },
        listeners: {
          move: function (event) {
            // Disable resizing on mobile
            if (window.innerWidth < 768) return; 

            // Get current position
            let { x, y } = event.target.dataset;
            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            // Update the window size and position
            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`
            });

            // Save the new position
            Object.assign(event.target.dataset, { x, y });
          }
        }
      });
}

// Handle the dragging movement
function dragMoveListener (event) {
  var target = event.target;
  // Calculate new position
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // Move the window
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  // Save position for next time
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// When page loads, set up click handlers for all windows
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.draggable').forEach(win => {
        // Bring window to front when clicked
        win.addEventListener('mousedown', () => bringToFront(win));
    });
});
