/* =========================================
   BROWSER.JS - Web Browser Logic
   ========================================= */

   const browserFrame = document.getElementById('browser-frame');
   const addressBar = document.getElementById('browser-address-bar');
   const loader = document.getElementById('browser-loader');
   
   // Function to load a URL
    function openBrowser(url) {
        // Open the window if it's closed
        const win = document.getElementById('window-browser');
        if (win.classList.contains('hidden')) {
            toggleWindow('window-browser');
        }
        bringToFront(win);

        // Update Address Bar and Frame
        if (url) {
            if (!url.startsWith('http') && !url.startsWith('file')) {
                url = 'https://' + url;
            }
            const addressBar = document.getElementById('browser-address-bar');
            if(addressBar) addressBar.value = url;
            
            navigateToUrl(url);
        }
    }
   
   // Internal function to handle the iframe source
   function navigateToUrl(url) {
       if(!browserFrame) return;
   
       // Show simple loader
       if(loader) loader.classList.remove('hidden');
   
       browserFrame.src = url;
   
       // Hide loader after a short delay (simulated, as we can't detect iframe load fully x-domain)
       setTimeout(() => {
           if(loader) loader.classList.add('hidden');
       }, 1500);
   }
   
   // Function called by the "Go" arrow button
   function navigateBrowser() {
       const url = addressBar.value;
       navigateToUrl(url);
   }
   
   // Allow pressing "Enter" in the address bar
   if (addressBar) {
       addressBar.addEventListener('keydown', (e) => {
           if (e.key === 'Enter') {
               navigateBrowser();
           }
       });
   }