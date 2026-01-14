// =========================================
// MATRIX RAIN EFFECT
// =========================================

// Get the canvas element where we'll draw the Matrix effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let matrixInterval;

// Start the Matrix falling characters animation
function startMatrix() {
    if (!canvas || !ctx) return;

    // Make the canvas visible
    canvas.classList.remove('opacity-0');
    canvas.classList.add('opacity-50'); 

    // Make canvas fill the whole screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters that can appear in the Matrix rain
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Keep track of where each column's character is
    const drops = [];
    for(let x = 0; x < columns; x++) drops[x] = 1;

    // This function draws one frame of the animation
    function draw() {
        // Add a semi-transparent black layer (creates the trail effect)
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set the text color to Matrix green
        ctx.fillStyle = "#0F0"; 
        ctx.font = fontSize + "px arial";

        // Draw a character in each column
        for(let i = 0; i < drops.length; i++) {
            // Pick a random character
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            // Draw it at the current drop position
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // If the drop went off screen, randomly reset it to the top
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            // Move the drop down for next frame
            drops[i]++;
        }
    }

    // Start the animation (30 frames per second)
    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 33);
    
    // If window is resized, update canvas size
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// =========================================
// BOOT SEQUENCE
// =========================================

// All the messages that appear during boot
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

// Run the boot sequence animation
async function runBootSequence() {
    const logContainer = document.getElementById('boot-log');
    const bootScreen = document.getElementById('boot-screen');
    
    if (!logContainer || !bootScreen) return;

    // Show each boot message one by one
    for (let text of bootTexts) {
        const p = document.createElement('div');
        // Make [OK] messages green
        if (text.includes('[OK]')) {
            p.innerHTML = text.replace('[OK]', '<span class="text-hacker-green font-bold">[OK]</span>');
        } else {
            p.innerText = text;
        }
        
        // Add the message to the screen
        logContainer.appendChild(p);
        
        // Auto-scroll to bottom so you can see the latest message
        bootScreen.scrollTop = bootScreen.scrollHeight;
        
        // Wait a random short time before next message
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
    }

    // Wait a bit after boot finishes
    await new Promise(r => setTimeout(r, 800));

    // Fade out the boot screen
    bootScreen.classList.add('fade-out');

    // Open the README window after boot completes
    setTimeout(() => {
        toggleWindow('window-readme');
    }, 500);
}

// Start the boot sequence when the page loads
runBootSequence();
