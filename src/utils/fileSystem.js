export const fileSystem = {
    "root": {
        type: "directory",
        children: {
            "desktop": {
                type: "directory",
                children: {
                    "terminal.lnk": { type: "shortcut", windowId: "terminal", icon: "fa-solid fa-terminal" },
                    "files.lnk": { type: "shortcut", windowId: "files", icon: "fa-solid fa-folder-open" },
                    "browser.lnk": { type: "shortcut", windowId: "browser", icon: "fa-solid fa-globe" },
                    "README.md.lnk": { type: "shortcut", windowId: "readme", icon: "fa-brands fa-markdown" }
                }
            },
            "documents": {
                type: "directory",
                children: {
                    "cert_c3sa.pdf": { type: "pdf", path: "assets/certs/cert_c3sa.pdf" },
                    "cert_ccep.pdf": { type: "pdf", path: "assets/certs/cert_ccep.pdf" },
                    "cert_cpps.pdf": { type: "pdf", path: "assets/certs/cert_cpps.pdf" },
                    "cert_crtom.pdf": { type: "pdf", path: "assets/certs/cert_crtom.pdf" }
                }
            },
            "pictures": {
                type: "directory",
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
    }
}