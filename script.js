/* =========================================
   1. SYSTEM CONFIGURATION & DATA
   ========================================= */

/* --- AUDIO SETTINGS --- */
// Load sound effects for clicking and typing
const clickSound = new Audio('sounds/click.mp3');
clickSound.volume = 0.4;

const keySound = new Audio('sounds/keypress.wav'); 
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
// Folders have a "children" object, and files have "content" or "path".
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

/* --- TERMINAL CONTENT --- */
// Content for specific commands like 'help' or 'whoami'
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

// Interact.js configuration for dragging and resizing windows
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
        if (window.innerWidth < 768) return; // Disable drag on mobile phones
        dragMoveListener(event);
      }
    }
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: false },
    listeners: {
      move: function (event) {
        if (window.innerWidth < 768) return; // Disable resize on mobile phones

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

// Attach the click event to all windows so they come to front when clicked
document.querySelectorAll('.draggable').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});


/* =========================================
   3. WINDOW MANAGEMENT
   ========================================= */

// Keep track of which windows can be opened
const managedWindows = ['window-terminal', 'window-files', 'window-pdf', 'window-image', 'window-readme'];

// Open or Close a window by its ID
function toggleWindow(windowId) {
    playClick();
    const win = document.getElementById(windowId);

    if (win.classList.contains('hidden')) {
        // Show the window
        win.classList.remove('hidden');
        win.classList.add('flex');
        bringToFront(win);
        
        // If it's the terminal, automatically focus the typing area
        if(windowId === 'window-terminal') {
            const termInput = document.getElementById('terminal-input');
            if(termInput) termInput.focus();
        }
    } else {
        // Hide the window
        win.classList.add('hidden');
        win.classList.remove('flex');
    }
    
    // Refresh the taskbar at the bottom
    renderTaskbar();
}

// Logic to draw the tabs in the taskbar
function renderTaskbar() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = ''; // Clear existing tabs

    managedWindows.forEach(id => {
        const win = document.getElementById(id);
        
        // Only create a tab if the window is open
        if (!win.classList.contains('hidden')) {
            
            // Set the correct name and icon for each app
            let title = "App";
            let iconClass = "fa-window-maximize";
            
            if (id === 'window-terminal') { title = "Terminal"; iconClass = "fa-terminal"; }
            else if (id === 'window-files') { title = "Files"; iconClass = "fa-folder-open"; }
            else if (id === 'window-pdf') { title = "Viewer"; iconClass = "fa-file-pdf"; }
            else if (id === 'window-image') { title = "Image"; iconClass = "fa-image"; }
            else if (id === 'window-readme') { title = "README.md"; iconClass = "fa-markdown"; }

            // Create the tab element
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

// Maximize (Full Screen) button logic
function toggleMaximize(windowId) {
    playClick();
    const win = document.getElementById(windowId);
    
    // Toggle the 'maximized' CSS class
    win.classList.toggle('maximized');
    
    // If maximizing, remove drag transform so it fills screen cleanly
    if (win.classList.contains('maximized')) {
        win.setAttribute('data-original-transform', win.style.transform);
        win.style.transform = 'none';
    } else {
        // If restoring, put it back where it was
        const originalTransform = win.getAttribute('data-original-transform');
        if (originalTransform) win.style.transform = originalTransform;
    }
}

// Logic for clicking folders in the File Explorer sidebar
function openFolder(folderName, elm) {
    playClick();
    
    // 1. Hide all existing file lists
    document.querySelectorAll('.file-grid').forEach(grid => {
        grid.classList.add('hidden');
    });

    // 2. Show the list for the folder we clicked
    const targetGrid = document.getElementById(`folder-${folderName}`);
    if(targetGrid) targetGrid.classList.remove('hidden');

    // 3. Reset the sidebar styling
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('bg-white/10', 'text-gray-100', 'border-hacker-green');
        item.classList.add('text-gray-400', 'border-transparent');
    });

    // 4. Highlight the sidebar item we just clicked
    if(elm) {
        elm.classList.add('bg-white/10', 'text-gray-100', 'border-hacker-green');
        elm.classList.remove('text-gray-400', 'border-transparent');
    }
    
    // 5. Update the breadcrumb text
    const pathEl = document.getElementById('file-path');
    if(pathEl) pathEl.innerText = `/ home / gelo / ${folderName}`;
}

// Function to open the PDF Viewer window
function openPDF(title, filePath, orientation = 'landscape') {
    const win = document.getElementById('window-pdf');
    
    document.getElementById('pdf-title').innerText = title;
    document.getElementById('pdf-frame').src = filePath;
    
    // Resize window based on document type (only on desktop)
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

// Function to open the Image Viewer window
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

// Tracking where we are in the terminal
let currentPath = ["root"]; // We start at root
let commandHistory = [];
let historyIndex = -1;

const inputField = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const promptLabel = document.querySelector('.text-hacker-green.mr-2'); 

// This function processes paths like "cd documents/projects" or "open ../resume.pdf"
function resolvePath(inputPath) {
    // 1. Decide where to start
    // If path starts with '/', start from root. Otherwise, start from current folder.
    let pathStack = inputPath.startsWith('/') ? [] : [...currentPath];
    
    // 2. Break the path string into individual folder names
    const segments = inputPath.split('/').filter(seg => seg !== '' && seg !== '.');

    // 3. Process each folder name
    for (let segment of segments) {
        if (segment === '..') {
            // ".." means go up one level
            if (pathStack.length > 1) { // Don't allow going above root
                pathStack.pop();
            }
        } else {
            // Otherwise, go down into the folder
            pathStack.push(segment);
        }
    }

    // 4. Check if this path actually exists in our fileSystem object
    let currentNode = fileSystem;
    
    // We walk through the JSON object step-by-step
    for (let i = 0; i < pathStack.length; i++) {
        const folderName = pathStack[i];
        
        // Special case for root level
        if (i === 0 && folderName === 'root') {
            currentNode = currentNode['root'];
        } else {
            // Check if folder exists inside .children (nested) or directly
            if (currentNode.children && currentNode.children[folderName]) {
                currentNode = currentNode.children[folderName];
            } else if (currentNode[folderName]) {
                currentNode = currentNode[folderName];
            } else {
                return null; // Path doesn't exist
            }
        }
    }

    return {
        node: currentNode,
        fullPathArray: pathStack
    };
}

// Helper to get the current folder object based on the currentPath array
function getCurrentDir() {
    let current = fileSystem['root'];
    
    // Loop through the path array to find the correct object
    for (let i = 1; i < currentPath.length; i++) {
        const folder = currentPath[i];
        
        // Check both .children (standard) and direct keys (legacy support)
        if (current.children && current.children[folder]) {
            current = current.children[folder];
        } else if (current[folder]) {
            current = current[folder];
        }
    }
    return current;
}

// Update the "root@gelo:~$" text
function updatePrompt() {
    if(!promptLabel) return;
    const pathString = currentPath.length === 1 ? "~" : "~/" + currentPath.slice(1).join("/");
    promptLabel.innerText = `root@gelo:${pathString}$`;
}

// Add a line of text to the terminal history
function addToTerminal(htmlContent, className = '') {
    const div = document.createElement('div');
    div.className = `history-line mb-2 ${className}`;
    div.innerHTML = htmlContent;
    
    // Insert the new line before the input field
    const inputLine = inputField.parentElement;
    terminalBody.insertBefore(div, inputLine);
}

// Main logic to handle user commands
function processCommand(cmd, target) {
    const currentDirObj = getCurrentDir();

    // Check if the command is one of our text blocks (whoami, ed, xp, etc.)
    if (commands[cmd] && !['ls', 'cd', 'open', 'clear', 'exit'].includes(cmd)) {
        addToTerminal(commands[cmd]);
        return;
    }

    switch (cmd) {
        case 'help':
            addToTerminal(commands.help);
            break;

        case 'clear':
            // Remove all previous lines
            document.querySelectorAll('.history-line').forEach(el => el.remove());
            break;

        case 'exit':
            toggleWindow('window-terminal');
            break;

        case 'ls':
            // List all files and folders in the current directory
            let output = '<div class="grid grid-cols-2 md:grid-cols-4 gap-2">';
            // Handle differences between root object and folder objects
            let items = currentDirObj.children ? currentDirObj.children : currentDirObj;
            
            for (let key in items) {
                const item = items[key];
                // Color code: Blue for directories, Green for executables, Gray for files
                const color = item.type === 'dir' ? 'text-blue-400 font-bold' : 
                              item.type === 'exec' ? 'text-hacker-green' : 'text-gray-300';
                const icon = item.type === 'dir' ? '/' : '';
                output += `<span class="${color}">${key}${icon}</span>`;
            }
            output += '</div>';
            addToTerminal(output);
            break;

        case 'cd':
            // If no folder specified, go back to root
            if (!target) {
                currentPath = ["root"];
                updatePrompt();
                return;
            } 
            
            // Use our helper to find the target folder
            const cdResult = resolvePath(target);
            
            if (cdResult && cdResult.node && (cdResult.node.type === 'dir' || cdResult.fullPathArray.length === 1)) {
                // Update our path variable
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
            
            // Use our helper to find the file
            const openResult = resolvePath(target);
            
            if (openResult && openResult.node) {
                const file = openResult.node;
                
                // Open the correct window based on file type
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

        case '':
            break;

        default:
            addToTerminal(`Command not found: ${cmd}. Type 'help'.`, 'text-red-400');
    }
}

// Event Listeners for the Terminal Input
if (inputField && terminalBody) {
    inputField.addEventListener('keydown', function(event) {
        
        // 0. TAB COMPLETION (Upgraded for Nested Paths)
        if (event.key === 'Tab') {
            event.preventDefault(); // Stop the tab from switching focus
            
            const rawInput = inputField.value;
            const parts = rawInput.split(' ');
            const currentWord = parts[parts.length - 1];
            
            if (currentWord.length === 0) return;

            let candidates = [];
            let prefix = ""; // To store "pictures/" if we are typing a path

            // A. If it's the first word, complete from COMMANDS
            if (parts.length === 1) {
                const allCommands = [
                    ...Object.keys(commands),
                    'ls', 'cd', 'open', 'clear', 'exit', 'help'
                ];
                candidates = allCommands.filter(c => c.startsWith(currentWord));
            } 
            
            // B. If it's the second word, complete from FILES
            else {
                // Check if the user is typing a nested path (e.g. "pictures/01")
                const lastSlashIndex = currentWord.lastIndexOf('/');
                
                if (lastSlashIndex !== -1) {
                    // Case B1: Nested Path found
                    // Separate "pictures/" from "01"
                    prefix = currentWord.substring(0, lastSlashIndex + 1); // "pictures/"
                    const search = currentWord.substring(lastSlashIndex + 1); // "01"
                    
                    // Use resolvePath to find the folder they are pointing to
                    const parentDir = resolvePath(prefix);
                    
                    if (parentDir && parentDir.node) {
                        const items = parentDir.node.children || parentDir.node;
                        const files = Object.keys(items);
                        // Find files starting with "01" inside that folder
                        candidates = files.filter(f => f.startsWith(search));
                    }
                } else {
                    // Case B2: Normal file in current directory
                    const currentDirObj = getCurrentDir();
                    const items = currentDirObj.children || currentDirObj; 
                    const files = Object.keys(items);
                    candidates = files.filter(f => f.startsWith(currentWord));
                }
            }

            // If we found exactly one match, fill it in
            if (candidates.length === 1) {
                // If we had a prefix (like "pictures/"), add it back to the match
                parts[parts.length - 1] = prefix + candidates[0];
                inputField.value = parts.join(' ');
            }
        }

        // HISTORY NAVIGATION (ArrowUp)
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[historyIndex];
            }
        } 
        // HISTORY NAVIGATION (ArrowDown)
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputField.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                inputField.value = "";
            }
        }
        
        // EXECUTE (Enter)
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

    // Focus input when clicking anywhere in terminal
    terminalBody.addEventListener('click', () => inputField.focus());
}


/* =========================================
   5. BOOT SEQUENCE
   ========================================= */

// Text log to simulate system startup
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
    
    // Print each line one by one
    for (let text of bootTexts) {
        const p = document.createElement('div');
        if (text.includes('[OK]')) {
            p.innerHTML = text.replace('[OK]', '<span class="text-hacker-green font-bold">[OK]</span>');
        } else {
            p.innerText = text;
        }
        
        logContainer.appendChild(p);
        
        // Scroll to keep new lines visible
        bootScreen.scrollTop = bootScreen.scrollHeight;
        
        // Random delay to make it look realistic
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
    }

    // Wait a moment before showing the desktop
    await new Promise(r => setTimeout(r, 800));

    // Hide the boot screen
    bootScreen.classList.add('fade-out');
}

// Start the boot sequence immediately
runBootSequence();