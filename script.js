/* =========================================
   1. SYSTEM CONFIGURATION & DATA
   ========================================= */

/* --- AUDIO SYSTEM --- */
const clickSound = new Audio('sounds/click.mp3');
clickSound.volume = 0.4;

const keySound = new Audio('sounds/keypress.wav'); // Ensure this matches your filename
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

/* --- GLOBAL KEYBOARD SOUNDS --- */
document.addEventListener('keydown', function(e) {
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
        return;
    }
    playKey();
});

/* --- VIRTUAL FILE SYSTEM (DATA) --- */
const fileSystem = {
    "root": {
        "about.txt": { type: "text", content: "I am Gelo, a CS student specializing in Cybersecurity." },
        "desktop": {
            type: "dir",
            children: {
                "terminal.lnk": { type: "exec", action: () => toggleWindow('window-terminal') },
                "files.lnk": { type: "exec", action: () => toggleWindow('window-files') }
            }
        },
        "documents": {
            type: "dir",
            children: {
                "cert_c3sa.pdf": { type: "pdf", path: "certs/cert_c3sa.pdf" },
                "cert_ccep.pdf": { type: "pdf", path: "certs/cert_ccep.pdf" },
                "cert_cpps.pdf": { type: "pdf", path: "certs/cert_cpps.pdf" },
                "cert_crtom.pdf": { type: "pdf", path: "certs/cert_crtom.pdf" },
                "resume.pdf": { type: "pdf", path: "docs/resume.pdf" } 
            }
        },
        "pictures": {
            type: "dir",
            children: {
                "01_PyConAPAC.jpg": { type: "img", path: "pics/01_PyConAPAC.jpg" },
                "02_HWMUN.jpg": { type: "img", path: "pics/02_HWMUN.jpg" },
                "03_ArduinoDayPH.jpg": { type: "img", path: "pics/03_ArduinoDayPH.jpg" },
                "04_YSESIdeathon.jpg": { type: "img", path: "pics/04_YSESIdeathon.jpg" },
                "05_AWSPartyRockHackathon.jpg": { type: "img", path: "pics/05_AWSPartyRockHackathon.jpg" },
                "06_BitcoinPizzaDay.jpg": { type: "img", path: "pics/06_BitcoinPizzaDay.jpg" },
                "07_APCFest2025.jpg": { type: "img", path: "pics/07_APCFest2025.jpg" },
                "08_GDGMNLBuildWithAI.jpg": { type: "img", path: "pics/08_GDGMNLBuildWithAI.jpg" },
                "09_Innoverse.jpg": { type: "img", path: "pics/09_Innoverse.jpg" },
                "10_CyberPHMeetup1.JPG": { type: "img", path: "pics/10_CyberPHMeetup1.JPG" },
                "11_WhoscallRelaunch.jpg": { type: "img", path: "pics/11_WhoscallRelaunch.jpg" },
                "12_NotionWorkshop.jpg": { type: "img", path: "pics/12_NotionWorkshop.jpg" },
                "13_RecognitionDay.jpg": { type: "img", path: "pics/13_RecognitionDay.jpg" },
                "14_CursorMeetup2.jpeg": { type: "img", path: "pics/14_CursorMeetup2.jpeg" },
                "15_EngagedtoCharl.jpg": { type: "img", path: "pics/15_EngagedtoCharl.jpg" },
                "16_HackForGov2025NCR.jpg": { type: "img", path: "pics/16_HackForGov2025NCR.jpg" },
                "17_GDGMNLDevFest.jpg": { type: "img", path: "pics/17_GDGMNLDevFest.jpg" },
                "18_HackForGov2025Finals.jpg": { type: "img", path: "pics/18_HackForGov2025Finals.jpg" }
            }
        }
    }
};

/* --- TERMINAL COMMANDS CONTENT --- */
const commands = {
    help: `
        <span class="text-hacker-green">Available commands:</span><br>
        <span class="ml-4">whoami</span> - About Me<br>
        <span class="ml-4">ed</span> - Education<br>
        <span class="ml-4">ac</span> - Achievements, Awards, and Recognitions<br>
        <span class="ml-4">xp</span> - Experience<br>
        <span class="ml-4">go</span> - Short-Term and Long-Term Goals<br>
        <span class="ml-4">ls</span> - List files<br>
        <span class="ml-4">cd [dir]</span> - Change directory<br>
        <span class="ml-4">open [file]</span> - Open a file<br>
        <span class="ml-4">clear</span> - Clear terminal<br>
        <span class="ml-4">exit</span> - Close terminal<br>
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


/* =========================================
   2. CORE UTILITIES
   ========================================= */

// Clock Logic
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// Z-Index Management
let highestZ = 10;

function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;
}

// Interact.js (Draggable & Resizable)
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
        if (window.innerWidth < 768) return; // Disable on mobile
        dragMoveListener(event);
      }
    }
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: false },
    listeners: {
      move: function (event) {
        if (window.innerWidth < 768) return; // Disable on mobile

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

// Add event listener to all draggable windows for Z-Index
document.querySelectorAll('.draggable').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});


/* =========================================
   3. WINDOW MANAGEMENT
   ========================================= */

// List of all managed window IDs
const managedWindows = ['window-terminal', 'window-files', 'window-pdf', 'window-image', 'window-readme'];

function toggleWindow(windowId) {
    playClick();
    const win = document.getElementById(windowId);

    if (win.classList.contains('hidden')) {
        // OPEN
        win.classList.remove('hidden');
        win.classList.add('flex');
        bringToFront(win);
        
        // Focus input if terminal
        if(windowId === 'window-terminal') {
            const termInput = document.getElementById('terminal-input');
            if(termInput) termInput.focus();
        }
    } else {
        // CLOSE (Hide)
        win.classList.add('hidden');
        win.classList.remove('flex');
    }
    
    // UPDATE TASKBAR
    renderTaskbar();
}

/* --- TASKBAR LOGIC --- */
function renderTaskbar() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = ''; // Clear current

    managedWindows.forEach(id => {
        const win = document.getElementById(id);
        
        // If window is visible (open), show tab
        if (!win.classList.contains('hidden')) {
            
            // Determine Title & Icon based on ID
            let title = "App";
            let iconClass = "fa-window-maximize";
            
            if (id === 'window-terminal') { title = "Terminal"; iconClass = "fa-terminal"; }
            else if (id === 'window-files') { title = "Files"; iconClass = "fa-folder-open"; }
            else if (id === 'window-pdf') { title = "Viewer"; iconClass = "fa-file-pdf"; }
            else if (id === 'window-image') { title = "Image"; iconClass = "fa-image"; }
            else if (id === 'window-readme') { title = "README.md"; iconClass = "fa-markdown"; }

            // Create Tab Element
            const tab = document.createElement('div');
            tab.className = "h-8 px-3 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-2 cursor-pointer border-b-2 border-hacker-green transition-colors min-w-[100px]";
            tab.onclick = () => {
                bringToFront(win);
                // Optional: Toggle minimize logic could go here
            };
            
            tab.innerHTML = `
                <i class="fa-solid ${iconClass} text-xs text-gray-400"></i>
                <span class="text-xs text-gray-300 truncate">${title}</span>
            `;
            
            container.appendChild(tab);
        }
    });
}

/* --- MAXIMIZE WINDOW LOGIC --- */
function toggleMaximize(windowId) {
    playClick();
    const win = document.getElementById(windowId);
    
    // Toggle class
    win.classList.toggle('maximized');
    
    // Check if we need to reset Interact.js position data
    if (win.classList.contains('maximized')) {
        // Disable dragging while maximized (optional, feels cleaner)
        win.setAttribute('data-original-transform', win.style.transform);
        win.style.transform = 'none';
    } else {
        // Restore
        const originalTransform = win.getAttribute('data-original-transform');
        if (originalTransform) win.style.transform = originalTransform;
    }
}

// File Explorer Folder Logic
function openFolder(folderName, elm) {
    playClick();
    
    // 1. Hide all file grids
    document.querySelectorAll('.file-grid').forEach(grid => {
        grid.classList.add('hidden');
    });

    // 2. Show the selected grid
    const targetGrid = document.getElementById(`folder-${folderName}`);
    if(targetGrid) targetGrid.classList.remove('hidden');

    // 3. Update Sidebar Visuals
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('bg-white/10', 'text-gray-100', 'border-hacker-green');
        item.classList.add('text-gray-400', 'border-transparent');
    });

    // 4. Highlight the active sidebar item
    if(elm) {
        elm.classList.add('bg-white/10', 'text-gray-100', 'border-hacker-green');
        elm.classList.remove('text-gray-400', 'border-transparent');
    }
    
    // 5. Update Breadcrumb path
    const pathEl = document.getElementById('file-path');
    if(pathEl) pathEl.innerText = `/ home / gelo / ${folderName}`;
}

// PDF Viewer Logic
function openPDF(title, filePath, orientation = 'landscape') {
    const win = document.getElementById('window-pdf');
    
    document.getElementById('pdf-title').innerText = title;
    document.getElementById('pdf-frame').src = filePath;
    
    if (window.innerWidth > 768) {
        if (orientation === 'portrait') {
            win.style.width = '600px';
            win.style.height = '850px';
        } else {
            win.style.width = '1000px';
            win.style.height = '750px';
        }
    }

    if (win.classList.contains('hidden')) {
        toggleWindow('window-pdf');
    }
    bringToFront(win);
}

// Image Viewer Logic
function openImage(title, imagePath) {
    document.getElementById('img-title').innerText = title;
    document.getElementById('img-viewer').src = imagePath;
    
    const win = document.getElementById('window-image');
    if (win.classList.contains('hidden')) {
        toggleWindow('window-image');
    }
    bringToFront(win);
}


/* =========================================
   4. ADVANCED TERMINAL LOGIC
   ========================================= */

// Terminal State
let currentPath = ["root"]; // Start at root
let commandHistory = [];
let historyIndex = -1;

const inputField = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const promptLabel = document.querySelector('.text-hacker-green.mr-2'); 

// Helper: Get current directory object
function getCurrentDir() {
    let dir = fileSystem;
    for (let folder of currentPath) {
        dir = dir[folder] ? dir[folder].children || dir[folder] : dir;
    }
    return dir;
}

// Helper: Update Prompt Display
function updatePrompt() {
    if(!promptLabel) return;
    const pathString = currentPath.length === 1 ? "~" : "~/" + currentPath.slice(1).join("/");
    promptLabel.innerText = `root@gelo:${pathString}$`;
}

// Helper: Print to Terminal
function addToTerminal(htmlContent, className = '') {
    const div = document.createElement('div');
    div.className = `history-line mb-2 ${className}`;
    div.innerHTML = htmlContent;
    
    const inputLine = inputField.parentElement;
    terminalBody.insertBefore(div, inputLine);
}

// Command Processor
function processCommand(cmd, target) {
    const currentDirObj = getCurrentDir();

    // Check predefined text commands first (whoami, ed, etc.)
    if (commands[cmd] && !['ls', 'cd', 'open', 'clear', 'exit'].includes(cmd)) {
        addToTerminal(commands[cmd]);
        return;
    }

    switch (cmd) {
        case 'help':
            addToTerminal(commands.help);
            break;

        case 'clear':
            document.querySelectorAll('.history-line').forEach(el => el.remove());
            break;

        case 'exit':
            toggleWindow('window-terminal');
            break;

        case 'ls':
            let output = '<div class="grid grid-cols-2 md:grid-cols-4 gap-2">';
            for (let key in currentDirObj) {
                const item = currentDirObj[key];
                const color = item.type === 'dir' ? 'text-blue-400 font-bold' : 
                              item.type === 'exec' ? 'text-hacker-green' : 'text-gray-300';
                const icon = item.type === 'dir' ? '/' : '';
                output += `<span class="${color}">${key}${icon}</span>`;
            }
            output += '</div>';
            addToTerminal(output);
            break;

        case 'cd':
            if (!target) {
                currentPath = ["root"];
            } else if (target === '..') {
                if (currentPath.length > 1) currentPath.pop();
            } else if (currentDirObj[target] && currentDirObj[target].type === 'dir') {
                currentPath.push(target);
            } else {
                addToTerminal(`cd: ${target}: No such directory`, 'text-red-400');
            }
            updatePrompt();
            break;

        case 'open':
            if (!target) {
                addToTerminal("usage: open [filename]", 'text-yellow-500');
            } else if (currentDirObj[target]) {
                const file = currentDirObj[target];
                
                if (file.type === 'pdf') {
                    openPDF(target, file.path);
                    addToTerminal(`Opening ${target}...`, 'text-gray-400');
                } else if (file.type === 'img') {
                    openImage(target, file.path);
                    addToTerminal(`Opening ${target}...`, 'text-gray-400');
                } else if (file.type === 'text') {
                    addToTerminal(file.content, 'text-white');
                } else if (file.type === 'exec') {
                    file.action();
                    addToTerminal(`Executing ${target}...`, 'text-gray-400');
                } else {
                    addToTerminal(`Error: Cannot open file type '${file.type}'`, 'text-red-400');
                }
            } else {
                addToTerminal(`open: ${target}: File not found`, 'text-red-400');
            }
            break;

        case '':
            break;

        default:
            addToTerminal(`Command not found: ${cmd}. Type 'help'.`, 'text-red-400');
    }
}

// Input Listener
if (inputField && terminalBody) {
    inputField.addEventListener('keydown', function(event) {
        
        // 0. TAB COMPLETION
        if (event.key === 'Tab') {
            event.preventDefault(); // Stop focus from moving
            
            const rawInput = inputField.value;
            const parts = rawInput.split(' ');
            const currentWord = parts[parts.length - 1];
            
            if (currentWord.length === 0) return; // Don't complete empty space

            let candidates = [];
            let match = "";

            // A. If it's the first word, complete from COMMANDS
            if (parts.length === 1) {
                // Combine custom commands + logic commands
                const allCommands = [
                    ...Object.keys(commands), // whoami, ed, ac...
                    'ls', 'cd', 'open', 'clear', 'exit', 'help'
                ];
                candidates = allCommands.filter(c => c.startsWith(currentWord));
            } 
            
            // B. If it's the second word, complete from FILES/FOLDERS
            else {
                const currentDirObj = getCurrentDir();
                const files = Object.keys(currentDirObj);
                candidates = files.filter(f => f.startsWith(currentWord));
            }

            // C. Apply Completion
            if (candidates.length === 1) {
                // Exact match found - auto fill it
                parts[parts.length - 1] = candidates[0];
                inputField.value = parts.join(' ');
            } else if (candidates.length > 1) {
                // Optional: If multiple matches (e.g., 'cert_'), 
                // you could print them to console or terminal, 
                // but for now we do nothing (standard shell behavior).
            }
        }

        // HISTORY NAVIGATION
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputField.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                inputField.value = "";
            }
        }
        
        // EXECUTE
        else if (event.key === 'Enter') {
            const rawInput = inputField.value.trim();
            
            // Add to history
            if (rawInput) {
                commandHistory.push(rawInput);
                historyIndex = commandHistory.length;
            }

            // Print user line
            const pathString = currentPath.length === 1 ? "~" : "~/" + currentPath.slice(1).join("/");
            addToTerminal(`root@gelo:${pathString}$ ${rawInput}`, 'text-gray-400');

            // Parse Command
            const args = rawInput.split(' ');
            const cmd = args[0].toLowerCase();
            const target = args[1]; 

            processCommand(cmd, target);

            // Reset
            inputField.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    terminalBody.addEventListener('click', () => inputField.focus());
}


/* =========================================
   5. BOOT SEQUENCE
   ========================================= */

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
        if (text.includes('[OK]')) {
            p.innerHTML = text.replace('[OK]', '<span class="text-hacker-green font-bold">[OK]</span>');
        } else {
            p.innerText = text;
        }
        
        logContainer.appendChild(p);
        
        // Auto-scroll logic
        bootScreen.scrollTop = bootScreen.scrollHeight;
        
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
    }

    // 2. Short pause after completion
    await new Promise(r => setTimeout(r, 800));

    // 3. Fade out
    bootScreen.classList.add('fade-out');
}

// Start the sequence
runBootSequence();