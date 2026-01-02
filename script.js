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