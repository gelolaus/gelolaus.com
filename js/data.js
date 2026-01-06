/* =========================================
   Contains the file system and command content for the terminal.
   ========================================= */

/* --- VIRTUAL FILE SYSTEM --- */
const fileSystem = {
    "root": {
        // "about.txt": { type: "text", content: "I am Gelo, a CS student specializing in Cybersecurity." },
        "desktop": {
            type: "dir",
            children: {
                "terminal.lnk": { type: "exec", action: () => toggleWindow('window-terminal') },
                "files.lnk": { type: "exec", action: () => toggleWindow('window-files') },
                "browser.lnk": { type: "exec", action: () => openBrowser('https://gelolaus.com') }
            }
        },
        "documents": {
            type: "dir",
            children: {
                "cert_c3sa.pdf": { type: "pdf", path: "assets/certs/cert_c3sa.pdf" },
                "cert_ccep.pdf": { type: "pdf", path: "assets/certs/cert_ccep.pdf" },
                "cert_cpps.pdf": { type: "pdf", path: "assets/certs/cert_cpps.pdf" },
                "cert_crtom.pdf": { type: "pdf", path: "assets/certs/cert_crtom.pdf" }
                // "resume.pdf": { type: "pdf", path: "assets/docs/resume.pdf" } 
            }
        },
        "pictures": {
            type: "dir",
            children: {
                "01_PyConAPAC.jpg": { type: "img", path: "assets/pics/01_PyConAPAC.jpg" },
                "02_HWMUN.jpg": { type: "img", path: "assets/pics/02_HWMUN.jpg" },
                "03_ArduinoDayPH.jpg": { type: "img", path: "assets/pics/03_ArduinoDayPH.jpg" },
                "04_YSESIdeathon.jpg": { type: "img", path: "assets/pics/04_YSESIdeathon.jpg" },
                "05_AWSPartyRockHackathon.jpg": { type: "img", path: "assets/pics/05_AWSPartyRockHackathon.jpg" },
                "06_BitcoinPizzaDay.jpg": { type: "img", path: "assets/pics/06_BitcoinPizzaDay.jpg" },
                "07_APCFest2025.jpg": { type: "img", path: "assets/pics/07_APCFest2025.jpg" },
                "08_GDGMNLBuildWithAI.jpg": { type: "img", path: "assets/pics/08_GDGMNLBuildWithAI.jpg" },
                "09_Innoverse.jpg": { type: "img", path: "assets/pics/09_Innoverse.jpg" },
                "10_CyberPHMeetup1.JPG": { type: "img", path: "assets/pics/10_CyberPHMeetup1.JPG" },
                "11_WhoscallRelaunch.jpg": { type: "img", path: "assets/pics/11_WhoscallRelaunch.jpg" },
                "12_NotionWorkshop.jpg": { type: "img", path: "assets/pics/12_NotionWorkshop.jpg" },
                "13_RecognitionDay.jpg": { type: "img", path: "assets/pics/13_RecognitionDay.jpg" },
                "14_CursorMeetup2.jpeg": { type: "img", path: "assets/pics/14_CursorMeetup2.jpeg" },
                "15_EngagedtoCharl.jpg": { type: "img", path: "assets/pics/15_EngagedtoCharl.jpg" },
                "16_HackForGov2025NCR.jpg": { type: "img", path: "assets/pics/16_HackForGov2025NCR.jpg" },
                "17_GDGMNLDevFest.jpg": { type: "img", path: "assets/pics/17_GDGMNLDevFest.jpg" },
                "18_HackForGov2025Finals.jpg": { type: "img", path: "assets/pics/18_HackForGov2025Finals.jpg" }
            }
        }
    }
};

/* --- TERMINAL COMMAND TEXTS --- */
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