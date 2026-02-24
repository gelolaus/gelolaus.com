import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// Store for managing all the windows in our fake OS
export const useWindowStore = defineStore('windows', () => {
  // --- SYSTEM SETTINGS ---
  
  // Track if the Matrix effect is active
  const isMatrixActive = ref(false)
  
  // Track if the CRT scanline effect is on (retro monitor look)
  const isCRTActive = ref(true)

  // Track if sound effects are enabled (clicks, beeps)
  const soundEnabled = ref(true)
  
  // Track custom desktop wallpaper
  const wallpaper = ref(null)

  // --- GLOBAL AUTH STATE ---
  // Holds the currently logged-in user: { email, name, pin }
  const currentUser = ref(null) 

  // --- DESKTOP ICON POSITIONS ---
  const iconPositions = ref({})

  // --- NOTIFICATIONS ---

  // A list to hold our active alerts (toasts)
  const notifications = ref([])

  // Function to show a pop-up message
  function notify(title, message, type = 'info') {
    const id = Date.now() // Simple unique ID based on time
    
    // Add the new notification to our list
    notifications.value.push({ id, title, message, type })
    
    // Automatically remove it after 3 seconds so they don't stack up
    setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }, 3000)
  }

  // --- WINDOW STATE ---
  
  // Keep track of which window is on top
  const activeZIndex = ref(100)

  // Helper function to create default window settings
  const defaultState = (id, title, icon, url = '', filePath = '') => ({
    id,
    title,
    icon,
    isOpen: false,         // Is the window open?
    isMaximized: false,    // Is it fullscreen?
    isMinimized: false,    // Is it hidden in the taskbar?
    zIndex: 10,            // Layer order (higher = more on top)
    hasOpened: false,      // Has it been opened at least once?
    position: { x: 0, y: 0 },   // Window position on screen
    size: { width: 0, height: 0 },  // Window size
    url,                   // For browser window
    filePath               // For viewing files
  })

  // All the windows in our OS
  const windows = ref({
    terminal: defaultState('terminal', 'Terminal', 'fa-solid fa-terminal'),
    files: defaultState('files', 'File Explorer', 'fa-solid fa-folder-open'),
    browser: defaultState('browser', 'Browser', 'fa-solid fa-globe', 'https://gelolaus.com'),
    pdf: defaultState('pdf', 'PDF Viewer', 'fa-solid fa-file-pdf'),
    image: defaultState('image', 'Image Viewer', 'fa-solid fa-image'),
    readme: defaultState('readme', 'README.md', 'fa-brands fa-markdown'),
    settings: defaultState('settings', 'Settings', 'fa-solid fa-gears'),
    mail: defaultState('mail', 'Mail', 'fa-solid fa-envelope'),
    notepad: defaultState('notepad', 'Notepad', 'fa-solid fa-file-lines'),
    music: defaultState('music', 'Music Player', 'fa-solid fa-music'),
    code: defaultState('code', 'Code Editor', 'fa-solid fa-code'),
    about: defaultState('about', 'About Me', 'fa-solid fa-address-card'),
    chat: defaultState('chat', 'Global Chat', 'fa-solid fa-comments'),
    nettool: defaultState('nettool', 'Network Utility', 'fa-solid fa-network-wired')
  })
  
  // --- SAVED DATA LOADING ---

  // Check if we have any saved window settings in the browser's storage
  const savedState = localStorage.getItem('gelos-windows')
  
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState)
      for (const key in parsed) {
        if (windows.value[key]) {
          windows.value[key] = parsed[key]
        }
      }
    } catch (e) {
      console.error('Failed to load window state', e)
    }
  }

  // Check if we have any saved system settings (sound, theme, wallpaper, etc.)
  const savedSettings = localStorage.getItem('gelos-settings')

  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      isMatrixActive.value = parsed.matrix ?? false
      isCRTActive.value = parsed.crt ?? true
      soundEnabled.value = parsed.sound ?? true
      wallpaper.value = parsed.wallpaper ?? null
    } catch (e) {
      console.error('Failed to load settings', e)
    }
  }

  // Check if we have saved icon positions
  const savedIcons = localStorage.getItem('gelos-icons')
  
  if (savedIcons) {
    try {
      iconPositions.value = JSON.parse(savedIcons)
    } catch (e) {
      console.error('Failed to load icons', e)
    }
  }

  // --- AUTO-SAVE WATCHERS ---

  watch(windows, (newVal) => {
    localStorage.setItem('gelos-windows', JSON.stringify(newVal))
  }, { deep: true }) 

  watch([isMatrixActive, isCRTActive, soundEnabled, wallpaper], () => {
    localStorage.setItem('gelos-settings', JSON.stringify({
      matrix: isMatrixActive.value,
      crt: isCRTActive.value,
      sound: soundEnabled.value,
      wallpaper: wallpaper.value
    }))
  })

  watch(iconPositions, (newVal) => {
    localStorage.setItem('gelos-icons', JSON.stringify(newVal))
  }, { deep: true })

  // --- ACTIONS ---

  function toggleMatrix() {
    isMatrixActive.value = !isMatrixActive.value
  }

  function toggleCRT() {
    isCRTActive.value = !isCRTActive.value
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  function setWallpaper(base64) {
    wallpaper.value = base64
  }

  function removeWallpaper() {
    wallpaper.value = null
  }

  // Update a single icon's position
  function updateIconPosition(id, position) {
    iconPositions.value[id] = position
  }

  function openWindow(id, payload = {}) {
    if (!windows.value[id]) return

    const win = windows.value[id]

    if (payload.title) win.title = payload.title
    if (payload.filePath) win.filePath = payload.filePath
    if (payload.url) win.url = payload.url

    if (!win.hasOpened) {
        const viewportW = window.innerWidth
        const viewportH = window.innerHeight
        
        const targetWidth = viewportW < 768 ? viewportW * 0.9 : 800
        const targetHeight = viewportW < 768 ? viewportH * 0.8 : 600

        win.size = { 
            width: targetWidth, 
            height: targetHeight 
        }

        win.position = { 
            x: (viewportW - targetWidth) / 2, 
            y: Math.max(20, (viewportH - targetHeight) / 2)
        }

        if (viewportW > 768) {
            const range = 50
            win.position.x += (Math.random() * range * 2) - range
            win.position.y += (Math.random() * range * 2) - range
        }

        win.hasOpened = true
    }

    win.isOpen = true
    win.isMinimized = false 
    bringToFront(id)
  }

  function closeWindow(id) {
    if (!windows.value[id]) return
    windows.value[id].isOpen = false
    windows.value[id].isMinimized = false
  }

  function minimizeWindow(id) {
    if (!windows.value[id]) return
    windows.value[id].isMinimized = true
  }

  function handleTaskbarClick(id) {
    const win = windows.value[id]
    if (!win.isOpen) return

    if (win.isMinimized) {
        win.isMinimized = false
        bringToFront(id)
    } else {
        if (win.zIndex === activeZIndex.value) {
            minimizeWindow(id)
        } else {
            bringToFront(id)
        }
    }
  }

  function toggleMaximize(id) {
    if (!windows.value[id]) return
    windows.value[id].isMaximized = !windows.value[id].isMaximized
    bringToFront(id)
  }

  function bringToFront(id) {
    if (!windows.value[id]) return
    activeZIndex.value++ 
    windows.value[id].zIndex = activeZIndex.value
  }

  function updatePosition(id, newPosition) {
    if (windows.value[id]) {
        windows.value[id].position = newPosition
    }
  }

  function updateSize(id, newSize) {
    if (windows.value[id]) {
        windows.value[id].size = newSize
    }
  }

  return { 
    windows, 
    isMatrixActive, 
    isCRTActive, 
    soundEnabled, 
    wallpaper,
    currentUser, 
    notifications,
    iconPositions,
    notify, 
    toggleMatrix, 
    toggleCRT, 
    toggleSound,
    setWallpaper,
    removeWallpaper,
    updateIconPosition,
    openWindow, 
    closeWindow, 
    minimizeWindow,
    handleTaskbarClick,
    toggleMaximize, 
    bringToFront, 
    updatePosition, 
    updateSize 
  }
})