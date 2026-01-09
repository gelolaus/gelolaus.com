/* =========================================
   Contains the GUI and applications for the OS.
   ========================================= */

let readmeLoaded = false;

const managedWindows = ['window-terminal', 'window-files', 'window-pdf', 'window-image', 'window-readme', 'window-browser'];

function toggleWindow(windowId) {
    playClick();
    const win = document.getElementById(windowId);

    if (win.classList.contains('hidden')) {
        win.classList.remove('hidden');
        win.classList.add('flex');
        bringToFront(win);
        
        if (windowId === 'window-readme' && !readmeLoaded) {
            loadReadme();
        }

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
    if (!container) return;
    
    container.innerHTML = ''; 

    managedWindows.forEach(id => {
        const win = document.getElementById(id);
        
        if (win && !win.classList.contains('hidden')) {
            let title = "App";
            let iconClass = "fa-window-maximize";
            
            if (id === 'window-terminal') { title = "Terminal"; iconClass = "fa-terminal"; }
            else if (id === 'window-files') { title = "Files"; iconClass = "fa-folder-open"; }
            else if (id === 'window-pdf') { title = "Viewer"; iconClass = "fa-file-pdf"; }
            else if (id === 'window-image') { title = "Image"; iconClass = "fa-image"; }
            else if (id === 'window-readme') { title = "README.md"; iconClass = "fa-markdown"; }
            else if (id === 'window-browser') { title = "Browser"; iconClass = "fa-globe"; }

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

async function loadReadme() {
    const container = document.getElementById('readme-content');
    if (!container) return;

    try {
        const response = await fetch('README.md'); 
        if (!response.ok) throw new Error("HTTP error " + response.status);
        
        const markdownText = await response.text();
        
        // 1. Convert Markdown to HTML
        container.innerHTML = marked.parse(markdownText);
        
        // 2. FORCE EXTERNAL LINKS TO OPEN IN NEW TAB (The Fix)
        container.querySelectorAll('a').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer'); // Security best practice
            link.classList.add('text-blue-400', 'hover:text-blue-300'); // Add styling if missing
        });

        readmeLoaded = true;
        
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <p class="text-red-500 font-bold">Error loading README.md</p>
            <p class="text-gray-400 text-xs">If opening locally, use Live Server.</p>
        `;
    }
}