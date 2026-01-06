/* =========================================
   Contains the command line logic for the terminal.
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
            if (typeof startMatrix === 'function') startMatrix();
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