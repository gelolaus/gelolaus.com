// =========================================
// BROWSER FUNCTIONALITY
// =========================================

// Get references to the browser elements
const browserFrame = document.getElementById('browser-frame');
const addressBar = document.getElementById('browser-address-bar');
const loader = document.getElementById('browser-loader');

// Open the browser window and load a URL
function openBrowser(url) {
    const win = document.getElementById('window-browser');
    
    // If browser is closed, open it
    if (win.classList.contains('hidden')) {
        toggleWindow('window-browser');
    }
    // Make sure it's on top
    bringToFront(win);

    // If a URL was provided, navigate to it
    if (url) {
        // Add https:// if the user didn't type it
        if (!url.startsWith('http') && !url.startsWith('file')) {
            url = 'https://' + url;
        }
        // Update the address bar
        const addressBar = document.getElementById('browser-address-bar');
        if(addressBar) addressBar.value = url;
        
        // Load the URL in the iframe
        navigateToUrl(url);
    }
}
   
// Load a URL in the browser iframe
function navigateToUrl(url) {
    if(!browserFrame) return;

    // Show loading indicator
    if(loader) loader.classList.remove('hidden');

    // Actually load the page
    browserFrame.src = url;

    // Hide loading indicator after a delay
    setTimeout(() => {
        if(loader) loader.classList.add('hidden');
    }, 1500);
}

// Called when user clicks the Go button
function navigateBrowser() {
    const url = addressBar.value;
    navigateToUrl(url);
}

// Allow user to press Enter in the address bar to navigate
if (addressBar) {
    addressBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            navigateBrowser();
        }
    });
}
