const browserFrame = document.getElementById('browser-frame');
const addressBar = document.getElementById('browser-address-bar');
const loader = document.getElementById('browser-loader');

function openBrowser(url) {
    const win = document.getElementById('window-browser');
    if (win.classList.contains('hidden')) {
        toggleWindow('window-browser');
    }
    bringToFront(win);

    if (url) {
        if (!url.startsWith('http') && !url.startsWith('file')) {
            url = 'https://' + url;
        }
        const addressBar = document.getElementById('browser-address-bar');
        if(addressBar) addressBar.value = url;
        
        navigateToUrl(url);
    }
}
   
function navigateToUrl(url) {
    if(!browserFrame) return;

    if(loader) loader.classList.remove('hidden');

    browserFrame.src = url;

    setTimeout(() => {
        if(loader) loader.classList.add('hidden');
    }, 1500);
}

function navigateBrowser() {
    const url = addressBar.value;
    navigateToUrl(url);
}

if (addressBar) {
    addressBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            navigateBrowser();
        }
    });
}