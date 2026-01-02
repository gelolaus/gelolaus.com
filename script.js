// Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// Toggle Window Visibility
function toggleWindow(windowId) {
    // 1. Play Sound
    playClick();

    const win = document.getElementById(windowId);
    if (win.classList.contains('hidden')) {
        win.classList.remove('hidden');
        win.classList.add('flex');
        bringToFront(win);
        // Focus input if opening terminal
        if(windowId === 'window-terminal') {
            const termInput = document.getElementById('terminal-input');
            if(termInput) termInput.focus();
        }
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
    allowFrom: '.window-header', 
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    autoScroll: true,
    
    // LISTENERS
    listeners: { 
      move: function(event) {
        // DISABLE DRAG ON MOBILE (Screen width < 768px)
        if (window.innerWidth < 768) {
             return; 
        }
        dragMoveListener(event);
      }
    }
  })
  .resizable({
    // Disable resizing on mobile too
    edges: { left: true, right: true, bottom: true, top: false },
    listeners: {
      move: function (event) {
        if (window.innerWidth < 768) return; // Stop resize on mobile

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

/* --- TERMINAL LOGIC --- */

// 1. Commands
const commands = {
    help: `
        <span class="text-hacker-green">Available commands:</span><br>
        <span class="ml-4">whoami</span> - About Me<br>
        <span class="ml-4">ed</span> - Education<br>
        <span class="ml-4">ac</span> - Achievements, Awards, and Recognitions<br>
        <span class="ml-4">xp</span> - Experience<br>
        <span class="ml-4">go</span> - Short-Term and Long-Term Goals<br>
        <span class="ml-4">clear</span> - Clear terminal<br>
    `,
    whoami: `
        <span class="font-bold text-yellow-500">>> ABOUT ME</span><br>
        I am Angelo Laus, but you can call me “Gelo”. I graduated from the Science, Technology, Engineering, and Mathematics with a Specialization in Information Technology (STEM-IT) strand at Asia Pacific College, Makati City.<br><br>
        I am a Notion Campus Leader (one out of eight Cohort 4 Campus Leaders in the Philippines) and the Director of External Relations at JPCS-APC, a role I’ve been doing inside and outside college for different organizations for the past four years.<br>
    `,
    ed: `
        <span class="font-bold text-blue-400">>> EDUCATION</span><br>
        <span class="font-bold text-green-400"> Senior High School</span><br>
        Science, Technology, Engineering, and Mathematics with a Specialization in Information Technology (STEM-IT)<br>
        Asia Pacific College, Makati City<br><br>

        <span class="font-bold text-green-400"> College</span><br>
        Bachelor of Science in Computer Science Specialized in Cyber Security and Forensics<br>
        55% Scholarship<br>
        Asia Pacific College, Makati City<br>
    `,
    ac: `
        <span class="font-bold text-blue-400">>> ACHIEVEMENTS</span><br>
        <span class="font-bold text-green-400">Certifications</span><br>
        - Certified Cyber Security Analyst (C3SA) - 2025<br>
        - Certified Red Team Operations Management (CRTOM) - 2025<br>
        - Certified Cybersecurity Educator Professional (CCEP) - 2025<br>
        - Certified Phishing Prevention Specialist (CPPS) - 2025<br><br>

        <span class="font-bold text-green-400">Awards and Recognitions</span><br>
        - HackForGov 2025 Capture the Flag Philippines Champion (Team Akira: Requiem)<br>
        - HackForGov 2025 Capture the Flag NCR Champion (Team Akira: Requiem)<br>
        - HackForGov 2024 Capture the Flag NCR 2nd Runner-Up (Team Akira)<br>
    `,
    xp: `
        <span class="font-bold text-blue-400">>> LEADERSHIP EXPERIENCE</span><br>
        <span class="font-bold text-green-400">Notion Campus Leader</span><br>
        Notion (Remote)<br>
        September 2025 - Present<br><br>
        <span class="font-bold text-green-400">Vice President of External Growth and Expansion</span><br>
        CyberPH (Hybrid)<br>
        April 2025 - Present<br><br>
        <span class="font-bold text-green-400">Director of External Relations</span><br>
        JPCS-APC (Hybrid)<br>
        July 2025 - Present<br><br>

        <span class="font-bold text-blue-400">>> IT EXPERIENCE</span><br>
        - Event QR Registration System (Web Application) for APC SOAR<br>
        - Rangya E-Commerce System (Web Application)<br>
        - Doon Ride-Hailing Comparison System (Web Application)<br>
    `,
    go: `
        <span class="font-bold text-blue-400">>> SHORT-TERM AND LONG-TERM GOALS</span><br>
        <span class="font-bold text-green-400">Short-Term Goals</span><br>
        - Graduate with a Summa Cum Laude Honor<br>
        - Treat myself a ticket to ROOTCON<br><br>

        <span class="font-bold text-green-400">Long-Term Goals</span><br>
        - Become a Chief Information Security Officer (CISO)<br>
    `
};

// 2. Logic
const inputField = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');

// Check if elements exist before adding listeners (prevents errors)
if (inputField && terminalBody) {
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const input = inputField.value.trim().toLowerCase();
            
            // Print user command to history
            addToTerminal(`root@gelo:~$ ${input}`, 'text-gray-400');

            // Process Command
            if (input === 'clear') {
                const history = terminalBody.querySelectorAll('.history-line');
                history.forEach(el => el.remove());
            } else if (commands[input]) {
                addToTerminal(commands[input]);
            } else if (input !== '') {
                addToTerminal(`Command not found: ${input}. Type 'help'.`, 'text-red-500');
            }

            // Reset
            inputField.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    // Auto-focus input when clicking the window body
    terminalBody.addEventListener('click', () => inputField.focus());
}

function addToTerminal(htmlContent, className = '') {
    const div = document.createElement('div');
    div.className = `history-line mb-2 ${className}`;
    div.innerHTML = htmlContent;
    
    // Insert before the input field
    const inputLine = inputField.parentElement;
    terminalBody.insertBefore(div, inputLine);
}

/* --- FILE EXPLORER LOGIC --- */
function openFolder(folderName, elm) {
    playClick();
    // 1. Hide all file grids
    document.querySelectorAll('.file-grid').forEach(grid => {
        grid.classList.add('hidden');
    });

    // 2. Show the selected grid
    document.getElementById(`folder-${folderName}`).classList.remove('hidden');

    // 3. Update Sidebar Visuals (Remove 'bg-white/10' from all, add to clicked)
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('bg-white/10', 'text-gray-100', 'border-hacker-green');
        item.classList.add('text-gray-400', 'border-transparent');
    });

    // 4. Highlight the active sidebar item
    elm.classList.add('bg-white/10', 'text-gray-100', 'border-hacker-green');
    elm.classList.remove('text-gray-400', 'border-transparent');
    
    // 5. Update Breadcrumb path
    document.getElementById('file-path').innerText = `/ home / gelo / ${folderName}`;
}

/* --- PDF VIEWER LOGIC --- */
function openPDF(title, filePath, orientation = 'landscape') {
    const win = document.getElementById('window-pdf');
    
    // 1. Set Title & File
    document.getElementById('pdf-title').innerText = title;
    document.getElementById('pdf-frame').src = filePath;
    
    // 2. Resize Window based on Orientation (Only on Desktop)
    if (window.innerWidth > 768) {
        if (orientation === 'portrait') {
            win.style.width = '600px';
            win.style.height = '850px';
        } else {
            // Default Landscape
            win.style.width = '1000px';
            win.style.height = '750px';
        }
    }

    // 3. Open Window
    if (win.classList.contains('hidden')) {
        toggleWindow('window-pdf');
    }
    bringToFront(win);
}

/* --- IMAGE VIEWER LOGIC --- */
function openImage(title, imagePath) {
    // 1. Set Title & Src
    document.getElementById('img-title').innerText = title;
    document.getElementById('img-viewer').src = imagePath;
    
    // 2. Open Window
    const win = document.getElementById('window-image');
    if (win.classList.contains('hidden')) {
        toggleWindow('window-image');
    }
    
    // 3. Bring to front
    bringToFront(win);
}

/* --- AUDIO SYSTEM --- */
const clickSound = new Audio('sounds/click.mp3');
clickSound.volume = 0.4;

// NEW: Keypress Sound
const keySound = new Audio('sounds/keypress.wav');
keySound.volume = 0.2; // Keep this subtle

function playClick() {
    const sound = clickSound.cloneNode();
    sound.volume = 0.4;
    sound.play().catch(e => {});
}

function playKey() {
    // Clone node allows rapid-fire typing without cutting off the previous sound
    const sound = keySound.cloneNode();
    sound.volume = 0.2;
    // Optional: Slight pitch variation makes it sound more natural
    // sound.playbackRate = 0.9 + Math.random() * 0.2; 
    sound.play().catch(e => {});
}

/* --- GLOBAL KEYBOARD SOUNDS --- */
document.addEventListener('keydown', function(e) {
    // 1. Ignore modifier keys (so holding Shift doesn't spam sound)
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
        return;
    }
    
    // 2. Play the sound
    playKey();
});

/* --- BOOT SEQUENCE LOGIC --- */
const bootTexts = [
    "Initializing GELO-KERNEL v1.0.4...",
    "Loading BIOS settings... [OK]",
    "Verifying CPU microcode... [OK]",
    "[OK] CPU: Intel Core i9-14900K detected (24 Cores).",
    "[OK] Memory: 64GB DDR5 RAM verified.",
    "Mounting root filesystem (/) read-only...",
    "Checking integrity of filesystem...",
    "[OK] /dev/nvme0n1p2: clean, 1204422/6291456 files, 332912/25165824 blocks",
    "Remounting root filesystem read-write... [OK]",
    "Loading kernel modules...",
    "   - crypto_user.ko",
    "   - security_layer.ko",
    "   - networking.ko",
    "   - wifi_driver.ko",
    "[OK] Interfaces: eth0, wlan0 initialized.",
    "Starting system message bus...",
    "Starting OpenBSD Secure Shell server... [OK]",
    "Starting Network Manager...",
    "   > Connecting to secure-node-1...",
    "   > Authenticating via encrypted handshake...",
    "[OK] Connection established. IP: 192.168.1.104",
    "Loading Portfolio Assets...",
    "   - /home/gelo/documents/resume.pdf",
    "   - /home/gelo/pics/hackathon.jpg",
    "Starting Graphical User Interface (X11)...",
    "Welcome, User."
];

async function runBootSequence() {
    const logContainer = document.getElementById('boot-log');
    const bootScreen = document.getElementById('boot-screen');
    
    // 1. Print Logs
    for (let text of bootTexts) {
        const p = document.createElement('div');
        
        // Highlight [OK] in green
        if (text.includes('[OK]')) {
            p.innerHTML = text.replace('[OK]', '<span class="text-hacker-green font-bold">[OK]</span>');
        } else {
            p.innerText = text;
        }
        
        // Append to container
        logContainer.appendChild(p);
        
        // Auto-scroll logic (keep the view at the bottom as new lines are added)
        // We scroll the CONTAINER, not the window, because the container is fixed.
        bootScreen.scrollTop = bootScreen.scrollHeight;
        
        // Random delay for realism (shorter delay for faster boot)
        // Adjust the '50' and '150' to make it faster or slower
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
    }

    // 2. Short pause after completion
    await new Promise(r => setTimeout(r, 800));

    // 3. Fade out
    bootScreen.classList.add('fade-out');
}

// Start the sequence
runBootSequence();