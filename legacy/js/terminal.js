// =========================================
// TERMINAL STATE
// =========================================

// Keep track of where we are in the file system
let currentPath = ["root"]; 

// Remember commands the user has typed
let commandHistory = [];
let historyIndex = -1;

// Get references to the terminal elements
const inputField = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const promptLabel = document.querySelector('.text-hacker-green.mr-2');

// =========================================
// FILE SYSTEM NAVIGATION
// =========================================

// Figure out where a path leads to (handles things like ../ and /)
function resolvePath(inputPath) {
    // Start from current location, unless path starts with /
    let pathStack = inputPath.startsWith('/') ? [] : [...currentPath];
    
    // Break the path into parts (like "documents/folder")
    const segments = inputPath.split('/').filter(seg => seg !== '' && seg !== '.');

    // Process each part of the path
    for (let segment of segments) {
        if (segment === '..') {
            // ".." means go up one folder
            if (pathStack.length > 1) {
                pathStack.pop();
            }
        } else {
            // Add this folder to our path
            pathStack.push(segment);
        }
    }

    // Now find this location in our file system
    let currentNode = fileSystem;
    
    for (let i = 0; i < pathStack.length; i++) {
        const folderName = pathStack[i];
        
        if (i === 0 && folderName === 'root') {
            currentNode = currentNode['root'];
        } else {
            // Try to find this folder
            if (currentNode.children && currentNode.children[folderName]) {
                currentNode = currentNode.children[folderName];
            } else if (currentNode[folderName]) {
                currentNode = currentNode[folderName];
            } else {
                // Folder doesn't exist
                return null;
            }
        }
    }

    return {
        node: currentNode,
        fullPathArray: pathStack
    };
}
   
// Get the folder we're currently in
function getCurrentDir() {
    let current = fileSystem['root'];
    
    // Follow the path to where we are
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
   
// Update the terminal prompt to show current location
function updatePrompt() {
    if(!promptLabel) return;
    // Show "~" for root, or "~/folder/subfolder" for deeper paths
    const pathString = currentPath.length === 1 ? "~" : "~/" + currentPath.slice(1).join("/");
    promptLabel.innerText = `root@gelo:${pathString}$`;
}
   
// Add text output to the terminal
function addToTerminal(htmlContent, className = '') {
    const div = document.createElement('div');
    div.className = `history-line mb-2 ${className}`;
    div.innerHTML = htmlContent;
    
    // Insert above the input line
    const inputLine = inputField.parentElement;
    terminalBody.insertBefore(div, inputLine);
}

// =========================================
// COMMAND PROCESSING
// =========================================
   
// Run a command that the user typed
function processCommand(cmd, target) {
    const currentDirObj = getCurrentDir();

    // Check if it's a simple info command (like whoami, ed, etc.)
    if (commands[cmd] && !['ls', 'cd', 'open', 'clear', 'exit', 'matrix'].includes(cmd)) {
        addToTerminal(commands[cmd]);
        return;
    }

    // Handle each command
    switch (cmd) {
        case 'help':
            addToTerminal(commands.help);
            break;

        case 'clear':
            // Remove all previous output
            document.querySelectorAll('.history-line').forEach(el => el.remove());
            break;

        case 'exit':
            // Close the terminal window
            toggleWindow('window-terminal');
            break;

        case 'ls':
            // List files in current directory
            let output = '<div class="grid grid-cols-2 md:grid-cols-4 gap-2">';
            let items = currentDirObj.children ? currentDirObj.children : currentDirObj;
            
            // Show each file with appropriate color
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
            // Change directory
            if (!target) {
                // No argument means go to root
                currentPath = ["root"];
                updatePrompt();
                return;
            } 
            
            const cdResult = resolvePath(target);
            
            if (cdResult && cdResult.node && (cdResult.node.type === 'dir' || cdResult.fullPathArray.length === 1)) {
                // Valid directory, change to it
                currentPath = cdResult.fullPathArray;
                updatePrompt();
            } else if (cdResult && cdResult.node && cdResult.node.type !== 'dir') {
                addToTerminal(`cd: ${target}: Not a directory`, 'text-red-400');
            } else {
                addToTerminal(`cd: ${target}: No such directory`, 'text-red-400');
            }
            break;

        case 'open':
            // Open a file
            if (!target) {
                addToTerminal("usage: open [filename]", 'text-yellow-500');
                return;
            }
            
            const openResult = resolvePath(target);
            
            if (openResult && openResult.node) {
                const file = openResult.node;
                
                // Open different file types appropriately
                if (file.type === 'pdf') {
                    openPDF(target, file.path);
                    addToTerminal(`Opening ${target}...`, 'text-gray-400');
                } else if (file.type === 'img') {
                    openImage(target, file.path);
                    addToTerminal(`Opening ${target}...`, 'text-gray-400');
                } else if (file.type === 'text') {
                    addToTerminal(file.content, 'text-white');
                } else if (file.type === 'exec') {
                    // Run executable files
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
            // Easter egg: start the Matrix effect
            addToTerminal("Wake up, Neo...", "text-hacker-green font-bold");
            if (typeof startMatrix === 'function') startMatrix();
            break;

        case '':
            // Empty command, do nothing
            break;

        default:
            // Unknown command
            addToTerminal(`Command not found: ${cmd}. Type 'help'.`, 'text-red-400');
    }
}

// =========================================
// INPUT HANDLING
// =========================================

// Set up keyboard listeners for the terminal
if (inputField && terminalBody) {
    inputField.addEventListener('keydown', function(event) {
        
        // Tab key: auto-complete
        if (event.key === 'Tab') {
            event.preventDefault(); 
            
            const rawInput = inputField.value;
            const parts = rawInput.split(' ');
            const currentWord = parts[parts.length - 1];
            
            if (currentWord.length === 0) return;

            let candidates = [];
            let prefix = ""; 

            // Completing a command name
            if (parts.length === 1) {
                const allCommands = [
                    ...Object.keys(commands),
                    'ls', 'cd', 'open', 'clear', 'exit', 'help'
                ];
                candidates = allCommands.filter(c => c.startsWith(currentWord));
            } 
            // Completing a file/folder name
            else {
                const lastSlashIndex = currentWord.lastIndexOf('/');
                
                if (lastSlashIndex !== -1) {
                    // Path contains slashes
                    prefix = currentWord.substring(0, lastSlashIndex + 1);
                    const search = currentWord.substring(lastSlashIndex + 1); 
                    
                    const parentDir = resolvePath(prefix);
                    
                    if (parentDir && parentDir.node) {
                        const items = parentDir.node.children || parentDir.node;
                        const files = Object.keys(items);
                        candidates = files.filter(f => f.startsWith(search));
                    }
                } else {
                    // No slashes, complete from current directory
                    const currentDirObj = getCurrentDir();
                    const items = currentDirObj.children || currentDirObj;
                    const files = Object.keys(items);
                    candidates = files.filter(f => f.startsWith(currentWord));
                }
            }

            // If there's only one match, auto-fill it
            if (candidates.length === 1) {
                parts[parts.length - 1] = prefix + candidates[0];
                inputField.value = parts.join(' ');
            }
        }

        // Up arrow: previous command from history
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[historyIndex];
            }
        } 
        // Down arrow: next command from history
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
        
        // Enter key: run the command
        else if (event.key === 'Enter') {
            const rawInput = inputField.value.trim();
            
            // Save to history
            if (rawInput) {
                commandHistory.push(rawInput);
                historyIndex = commandHistory.length;
            }

            // Show what the user typed
            const pathString = currentPath.length === 1 ? "~" : "~/" + currentPath.slice(1).join("/");
            addToTerminal(`root@gelo:${pathString}$ ${rawInput}`, 'text-gray-400');

            // Parse and run the command
            const args = rawInput.split(' ');
            const cmd = args[0].toLowerCase();
            const target = args[1]; 

            processCommand(cmd, target);

            // Clear the input field
            inputField.value = '';
            // Scroll to bottom so you can see the output
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    // Click anywhere in terminal to focus the input
    terminalBody.addEventListener('click', () => inputField.focus());
}
