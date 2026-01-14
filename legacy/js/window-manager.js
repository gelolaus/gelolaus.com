// =========================================
// WINDOW MANAGEMENT
// =========================================

// Track if we've already loaded the README file
let readmeLoaded = false;

// List of all windows we need to manage
const managedWindows = ['window-terminal', 'window-files', 'window-pdf', 'window-image', 'window-readme', 'window-browser'];

// Open or close a window
function toggleWindow(windowId) {
    playClick(); // Play a click sound
    const win = document.getElementById(windowId);

    if (win.classList.contains('hidden')) {
        // Window is closed, so open it
        win.classList.remove('hidden');
        win.classList.add('flex');
        bringToFront(win);
        
        // Load README content if opening README for first time
        if (windowId === 'window-readme' && !readmeLoaded) {
            loadReadme();
        }

        // Focus the terminal input if opening terminal
        if(windowId === 'window-terminal') {
            const termInput = document.getElementById('terminal-input');
            if(termInput) termInput.focus();
        }
    } else {
        // Window is open, so close it
        win.classList.add('hidden');
        win.classList.remove('flex');
    }
    
    // Update the taskbar to reflect changes
    renderTaskbar();
}
   
// Update the taskbar to show currently open windows
function renderTaskbar() {
    const container = document.getElementById('taskbar-apps');
    if (!container) return;
    
    // Clear the taskbar
    container.innerHTML = ''; 

    // Add a button for each open window
    managedWindows.forEach(id => {
        const win = document.getElementById(id);
        
        // Only show buttons for open windows
        if (win && !win.classList.contains('hidden')) {
            // Set the title and icon for each window type
            let title = "App";
            let iconClass = "fa-window-maximize";
            
            if (id === 'window-terminal') { title = "Terminal"; iconClass = "fa-terminal"; }
            else if (id === 'window-files') { title = "Files"; iconClass = "fa-folder-open"; }
            else if (id === 'window-pdf') { title = "Viewer"; iconClass = "fa-file-pdf"; }
            else if (id === 'window-image') { title = "Image"; iconClass = "fa-image"; }
            else if (id === 'window-readme') { title = "README.md"; iconClass = "fa-markdown"; }
            else if (id === 'window-browser') { title = "Browser"; iconClass = "fa-globe"; }

            // Create the taskbar button
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
   
// Toggle between maximized and normal window size
function toggleMaximize(windowId) {
    playClick();
    const win = document.getElementById(windowId);
    
    win.classList.toggle('maximized');
    
    if (win.classList.contains('maximized')) {
        // Save the window's position so we can restore it later
        win.setAttribute('data-original-transform', win.style.transform);
        win.style.transform = 'none';
    } else {
        // Restore the original position
        const originalTransform = win.getAttribute('data-original-transform');
        if (originalTransform) win.style.transform = originalTransform;
    }
}
   
// Switch to a different folder in the file explorer
function openFolder(folderName, elm) {
    playClick();
    
    // Hide all folder grids
    document.querySelectorAll('.file-grid').forEach(grid => {
        grid.classList.add('hidden');
    });

    // Show the selected folder's grid
    const targetGrid = document.getElementById(`folder-${folderName}`);
    if(targetGrid) targetGrid.classList.remove('hidden');

    // Update sidebar styling to show which folder is selected
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('bg-white/10', 'text-gray-100', 'border-hacker-green');
        item.classList.add('text-gray-400', 'border-transparent');
    });

    if(elm) {
        elm.classList.add('bg-white/10', 'text-gray-100', 'border-hacker-green');
        elm.classList.remove('text-gray-400', 'border-transparent');
    }
    
    // Update the path display
    const pathEl = document.getElementById('file-path');
    if(pathEl) pathEl.innerText = `/ home / gelo / ${folderName}`;
}
   
// Open a PDF file in the viewer
function openPDF(title, filePath, orientation = 'landscape') {
    const win = document.getElementById('window-pdf');
    
    // Set the title and load the PDF
    document.getElementById('pdf-title').innerText = title;
    document.getElementById('pdf-frame').src = filePath;
    
    // Adjust window size based on PDF orientation
    if (window.innerWidth > 768) {
        if (orientation === 'portrait') {
            win.style.width = '600px';
            win.style.height = '850px';
        } else {
            win.style.width = '1000px';
            win.style.height = '750px';
        }
    }

    // Open the window if it's not already open
    if (win.classList.contains('hidden')) {
        toggleWindow('window-pdf');
    }
    bringToFront(win);
}

// Open an image in the viewer
function openImage(title, imagePath) {
    // Set the title and image source
    document.getElementById('img-title').innerText = title;
    document.getElementById('img-viewer').src = imagePath;
    
    // Open the window if it's not already open
    const win = document.getElementById('window-image');
    if (win.classList.contains('hidden')) {
        toggleWindow('window-image');
    }
    bringToFront(win);
}

// Load the README.md file and convert it from Markdown to HTML
async function loadReadme() {
    const container = document.getElementById('readme-content');
    if (!container) return;

    try {
        // Fetch the README file
        const response = await fetch('README.md'); 
        if (!response.ok) throw new Error("HTTP error " + response.status);
        
        const markdownText = await response.text();
        
        // Convert Markdown to HTML using the marked library
        container.innerHTML = marked.parse(markdownText);
        
        // Make all links open in new tabs
        container.querySelectorAll('a').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer'); // For security
            link.classList.add('text-blue-400', 'hover:text-blue-300');
        });

        readmeLoaded = true;
        
    } catch (error) {
        // If loading fails, show an error message
        console.error(error);
        container.innerHTML = `
            <p class="text-red-500 font-bold">Error loading README.md</p>
            <p class="text-gray-400 text-xs">If opening locally, use Live Server.</p>
        `;
    }
}
