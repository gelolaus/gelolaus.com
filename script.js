// Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// Toggle Window Visibility
function toggleWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win.classList.contains('hidden')) {
        win.classList.remove('hidden');
        win.classList.add('flex');
    } else {
        win.classList.add('hidden');
        win.classList.remove('flex');
    }
}

/* --- Z-INDEX MANAGEMENT --- */
let highestZ = 10;

function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;
}

// Add event listener to all draggable windows
document.querySelectorAll('.draggable').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});

/* --- DRAGGABLE & RESIZABLE LOGIC (Interact.js) --- */
interact('.draggable')
  .draggable({
    allowFrom: '.window-header', // Only drag via the header bar
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent', // Keep inside the desktop
        endOnly: true
      })
    ],
    autoScroll: true,
    listeners: { move: dragMoveListener }
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: false },
    listeners: {
      move: function (event) {
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

function dragMoveListener (event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}