/* =========================================
   Contains the startup and effects for the OS.
   ========================================= */

/* --- MATRIX EFFECT --- */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let matrixInterval;

function startMatrix() {
    if (!canvas || !ctx) return;

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

/* --- BOOT SEQUENCE --- */
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
    
    if (!logContainer || !bootScreen) return;

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

    setTimeout(() => {
        toggleWindow('window-readme');
    }, 500);
}

runBootSequence();