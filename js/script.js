/* =========================================
   1. SYSTEM CONFIGURATION & DATA
   ========================================= */

/* --- AUDIO SETTINGS --- */
// Load sound effects from the assets folder
const clickSound = new Audio('assets/sounds/click.mp3');
clickSound.volume = 0.4;

const keySound = new Audio('assets/sounds/keypress.wav'); 
keySound.volume = 0.2; 

// Function to play click sound (clones it so we can play rapidly)
function playClick() {
    const sound = clickSound.cloneNode();
    sound.volume = 0.4;
    sound.play().catch(e => {});
}

// Function to play typing sound
function playKey() {
    const sound = keySound.cloneNode();
    sound.volume = 0.2;
    sound.play().catch(e => {});
}

// Listen for any key press to play the typing sound
document.addEventListener('keydown', function(e) {
    // Don't play sound for modifier keys like Shift or Ctrl
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
        return;
    }
    playKey();
});

/* --- VIRTUAL FILE SYSTEM --- */
// This object mimics a file structure. 
// We updated the paths to point to the new 'assets' folder.
const fileSystem = {
    "root": {
        // "about.txt": { type: "text", content: "I am Gelo, a CS student specializing in Cybersecurity." },
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
                "cert_c3sa.pdf": { type: "pdf", path: "assets/certs/cert_c3sa.pdf" },
                "cert_ccep.pdf": { type: "pdf", path: "assets/certs/cert_ccep.pdf" },
                "cert_cpps.pdf": { type: "pdf", path: "assets/certs/cert_cpps.pdf" },
                "cert_crtom.pdf": { type: "pdf", path: "assets/certs/cert_crtom.pdf" }
                // "resume.pdf": { type: "pdf", path: "assets/docs/resume.pdf" } 
            }
        },
        "pictures": {
            type: "dir",
            children: {
                "01_PyConAPAC.jpg": { type: "img", path: "assets/pics/01_PyConAPAC.jpg" },
                "02_HWMUN.jpg": { type: "img", path: "assets/pics/02_HWMUN.jpg" },
                "03_ArduinoDayPH.jpg": { type: "img", path: "assets/pics/03_ArduinoDayPH.jpg" },
                "04_YSESIdeathon.jpg": { type: "img", path: "assets/pics/04_YSESIdeathon.jpg" },
                "05_AWSPartyRockHackathon.jpg": { type: "img", path: "assets/pics/05_AWSPartyRockHackathon.jpg" },
                "06_BitcoinPizzaDay.jpg": { type: "img", path: "assets/pics/06_BitcoinPizzaDay.jpg" },
                "07_APCFest2025.jpg": { type: "img", path: "assets/pics/07_APCFest2025.jpg" },
                "08_GDGMNLBuildWithAI.jpg": { type: "img", path: "assets/pics/08_GDGMNLBuildWithAI.jpg" },
                "09_Innoverse.jpg": { type: "img", path: "assets/pics/09_Innoverse.jpg" },
                "10_CyberPHMeetup1.JPG": { type: "img", path: "assets/pics/10_CyberPHMeetup1.JPG" },
                "11_WhoscallRelaunch.jpg": { type: "img", path: "assets/pics/11_WhoscallRelaunch.jpg" },
                "12_NotionWorkshop.jpg": { type: "img", path: "assets/pics/12_NotionWorkshop.jpg" },
                "13_RecognitionDay.jpg": { type: "img", path: "assets/pics/13_RecognitionDay.jpg" },
                "14_CursorMeetup2.jpeg": { type: "img", path: "assets/pics/14_CursorMeetup2.jpeg" },
                "15_EngagedtoCharl.jpg": { type: "img", path: "assets/pics/15_EngagedtoCharl.jpg" },
                "16_HackForGov2025NCR.jpg": { type: "img", path: "assets/pics/16_HackForGov2025NCR.jpg" },
                "17_GDGMNLDevFest.jpg": { type: "img", path: "assets/pics/17_GDGMNLDevFest.jpg" },
                "18_HackForGov2025Finals.jpg": { type: "img", path: "assets/pics/18_HackForGov2025Finals.jpg" }
            }
        }
    }
};

/* --- TERMINAL CONTENT --- */
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

// Update the clock every second
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// Logic to make sure the clicked window is always on top
let highestZ = 10;

function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;
}

// Interact.js configuration
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

function dragMoveListener (event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

document.querySelectorAll('.draggable').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});


/* =========================================
   3. WINDOW MANAGEMENT
   ========================================= */

const managedWindows = ['window-terminal', 'window-files', 'window-pdf', 'window-image', 'window-readme'];

function toggleWindow(windowId) {
    playClick();
    const win = document.getElementById(windowId);

    if (win.classList.contains('hidden')) {
        win.classList.remove('hidden');
        win.classList.add('flex');
        bringToFront(win);
        
        if(windowId === 'window-terminal') {
            const termInput = document.getElementById('terminal-input');
            if(termInput) termInput.focus();
        }
    } else {
        win.classList.add('hidden');
        win.classList.remove('flex');
    }
    
    renderTaskbar();
}

function renderTaskbar() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = ''; 

    managedWindows.forEach(id => {
        const win = document.getElementById(id);
        
        if (!win.classList.contains('hidden')) {
            let title = "App";
            let iconClass = "fa-window-maximize";
            
            if (id === 'window-terminal') { title = "Terminal"; iconClass = "fa-terminal"; }
            else if (id === 'window-files') { title = "Files"; iconClass = "fa-folder-open"; }
            else if (id === 'window-pdf') { title = "Viewer"; iconClass = "fa-file-pdf"; }
            else if (id === 'window-image') { title = "Image"; iconClass = "fa-image"; }
            else if (id === 'window-readme') { title = "README.md"; iconClass = "fa-markdown"; }

            const tab = document.createElement('div');
            tab.className = "h-8 px-3 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-2 cursor-pointer border-b-2 border-hacker-green transition-colors min-w-[100px]";
            tab.onclick = () => {
                bringToFront(win);
            };
            
            tab.innerHTML = `
                <i class="fa-solid ${iconClass} text-xs text-gray-400"></i>
                <span class="text-xs text-gray-300 truncate">${title}</span>
            `;
            
            container.appendChild(tab);
        }
    });
}

function toggleMaximize(windowId) {
    playClick();
    const win = document.getElementById(windowId);
    
    win.classList.toggle('maximized');
    
    if (win.classList.contains('maximized')) {
        win.setAttribute('data-original-transform', win.style.transform);
        win.style.transform = 'none';
    } else {
        const originalTransform = win.getAttribute('data-original-transform');
        if (originalTransform) win.style.transform = originalTransform;
    }
}

function openFolder(folderName, elm) {
    playClick();
    
    document.querySelectorAll('.file-grid').forEach(grid => {
        grid.classList.add('hidden');
    });

    const targetGrid = document.getElementById(`folder-${folderName}`);
    if(targetGrid) targetGrid.classList.remove('hidden');

    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('bg-white/10', 'text-gray-100', 'border-hacker-green');
        item.classList.add('text-gray-400', 'border-transparent');
    });

    if(elm) {
        elm.classList.add('bg-white/10', 'text-gray-100', 'border-hacker-green');
        elm.classList.remove('text-gray-400', 'border-transparent');
    }
    
    const pathEl = document.getElementById('file-path');
    if(pathEl) pathEl.innerText = `/ home / gelo / ${folderName}`;
}

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
   4. TERMINAL LOGIC
   ========================================= */

let currentPath = ["root"]; 
let commandHistory = [];
let historyIndex = -1;

const inputField = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const promptLabel = document.querySelector('.text-hacker-green.mr-2'); 

// Resolver function to handle paths like "cd documents/projects"
function resolvePath(inputPath) {
    let pathStack = inputPath.startsWith('/') ? [] : [...currentPath];
    const segments = inputPath.split('/').filter(seg => seg !== '' && seg !== '.');

    for (let segment of segments) {
        if (segment === '..') {
            if (pathStack.length > 1) { 
                pathStack.pop();
            }
        } else {
            pathStack.push(segment);
        }
    }

    let currentNode = fileSystem;
    
    for (let i = 0; i < pathStack.length; i++) {
        const folderName = pathStack[i];
        
        if (i === 0 && folderName === 'root') {
            currentNode = currentNode['root'];
        } else {
            if (currentNode.children && currentNode.children[folderName]) {
                currentNode = currentNode.children[folderName];
            } else if (currentNode[folderName]) {
                currentNode = currentNode[folderName];
            } else {
                return null; 
            }
        }
    }

    return {
        node: currentNode,
        fullPathArray: pathStack
    };
}

// Helper to get current directory object
function getCurrentDir() {
    let current = fileSystem['root'];
    
    for (let i = 1; i < currentPath.length; i++) {
        const folder = currentPath[i];
        
        if (current.children && current.children[folder]) {
            current = current.children[folder];
        } else if (current[folder]) {
            current = current[folder];
        }
    }
    return current;
}

function updatePrompt() {
    if(!promptLabel) return;
    const pathString = currentPath.length === 1 ? "~" : "~/" + currentPath.slice(1).join("/");
    promptLabel.innerText = `root@gelo:${pathString}$`;
}

function addToTerminal(htmlContent, className = '') {
    const div = document.createElement('div');
    div.className = `history-line mb-2 ${className}`;
    div.innerHTML = htmlContent;
    
    const inputLine = inputField.parentElement;
    terminalBody.insertBefore(div, inputLine);
}

function processCommand(cmd, target) {
    const currentDirObj = getCurrentDir();

    if (commands[cmd] && !['ls', 'cd', 'open', 'clear', 'exit', 'matrix'].includes(cmd)) {
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
            let items = currentDirObj.children ? currentDirObj.children : currentDirObj;
            
            for (let key in items) {
                const item = items[key];
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
                updatePrompt();
                return;
            } 
            
            const cdResult = resolvePath(target);
            
            if (cdResult && cdResult.node && (cdResult.node.type === 'dir' || cdResult.fullPathArray.length === 1)) {
                currentPath = cdResult.fullPathArray;
                updatePrompt();
            } else if (cdResult && cdResult.node && cdResult.node.type !== 'dir') {
                 addToTerminal(`cd: ${target}: Not a directory`, 'text-red-400');
            } else {
                 addToTerminal(`cd: ${target}: No such directory`, 'text-red-400');
            }
            break;

        case 'open':
            if (!target) {
                addToTerminal("usage: open [filename]", 'text-yellow-500');
                return;
            }
            
            const openResult = resolvePath(target);
            
            if (openResult && openResult.node) {
                const file = openResult.node;
                
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
                } else if (file.type === 'dir') {
                    addToTerminal(`open: ${target}: Is a directory`, 'text-red-400');
                } else {
                    addToTerminal(`Error: Cannot open file type '${file.type}'`, 'text-red-400');
                }
            } else {
                addToTerminal(`open: ${target}: File not found`, 'text-red-400');
            }
            break;
        
        case 'matrix':
            addToTerminal("Wake up, Neo...", "text-hacker-green font-bold");
            startMatrix();
            break;

        case '':
            break;

        default:
            addToTerminal(`Command not found: ${cmd}. Type 'help'.`, 'text-red-400');
    }
}

if (inputField && terminalBody) {
    inputField.addEventListener('keydown', function(event) {
        
        if (event.key === 'Tab') {
            event.preventDefault(); 
            
            const rawInput = inputField.value;
            const parts = rawInput.split(' ');
            const currentWord = parts[parts.length - 1];
            
            if (currentWord.length === 0) return;

            let candidates = [];
            let prefix = ""; 

            if (parts.length === 1) {
                const allCommands = [
                    ...Object.keys(commands),
                    'ls', 'cd', 'open', 'clear', 'exit', 'help'
                ];
                candidates = allCommands.filter(c => c.startsWith(currentWord));
            } 
            else {
                const lastSlashIndex = currentWord.lastIndexOf('/');
                
                if (lastSlashIndex !== -1) {
                    prefix = currentWord.substring(0, lastSlashIndex + 1); 
                    const search = currentWord.substring(lastSlashIndex + 1); 
                    
                    const parentDir = resolvePath(prefix);
                    
                    if (parentDir && parentDir.node) {
                        const items = parentDir.node.children || parentDir.node;
                        const files = Object.keys(items);
                        candidates = files.filter(f => f.startsWith(search));
                    }
                } else {
                    const currentDirObj = getCurrentDir();
                    const items = currentDirObj.children || currentDirObj; 
                    const files = Object.keys(items);
                    candidates = files.filter(f => f.startsWith(currentWord));
                }
            }

            if (candidates.length === 1) {
                parts[parts.length - 1] = prefix + candidates[0];
                inputField.value = parts.join(' ');
            }
        }

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
        
        else if (event.key === 'Enter') {
            const rawInput = inputField.value.trim();
            
            if (rawInput) {
                commandHistory.push(rawInput);
                historyIndex = commandHistory.length;
            }

            const pathString = currentPath.length === 1 ? "~" : "~/" + currentPath.slice(1).join("/");
            addToTerminal(`root@gelo:${pathString}$ ${rawInput}`, 'text-gray-400');

            const args = rawInput.split(' ');
            const cmd = args[0].toLowerCase();
            const target = args[1]; 

            processCommand(cmd, target);

            inputField.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    terminalBody.addEventListener('click', () => inputField.focus());
}


/* =========================================
   5. MATRIX EASTER EGG
   ========================================= */

const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let matrixInterval;

function startMatrix() {
    canvas.classList.remove('opacity-0');
    canvas.classList.add('opacity-50'); 

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let x = 0; x < columns; x++) drops[x] = 1;

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#0F0"; 
        ctx.font = fontSize + "px arial";

        for(let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 33);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}


/* =========================================
   6. BOOT SEQUENCE
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
    
    for (let text of bootTexts) {
        const p = document.createElement('div');
        if (text.includes('[OK]')) {
            p.innerHTML = text.replace('[OK]', '<span class="text-hacker-green font-bold">[OK]</span>');
        } else {
            p.innerText = text;
        }
        
        logContainer.appendChild(p);
        
        bootScreen.scrollTop = bootScreen.scrollHeight;
        
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
    }

    await new Promise(r => setTimeout(r, 800));

    bootScreen.classList.add('fade-out');
}

runBootSequence();