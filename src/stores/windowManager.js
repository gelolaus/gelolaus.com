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
  
  // --- NOTIFICATIONS ---

  // A list to hold our active alerts (toasts)
  const notifications = ref([])

  // Function to show a pop-up message
  // We can call this from anywhere: store.notify('Title', 'Message', 'success')
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
    mail: defaultState('mail', 'Mail', 'fa-solid fa-envelope')
  })
  
  // --- SAVED DATA LOADING ---

  // Check if we have any saved window settings in the browser's storage
  // This is so the user doesn't lose their work when they refresh the page
  const savedState = localStorage.getItem('gelos-windows')
  
  if (savedState) {
    try {
      // If we found saved data, turn it back into a JavaScript object
      const parsed = JSON.parse(savedState)
      
      // Loop through each window we found and update our current list
      // We do it this way to make sure we don't break anything if we added new apps later
      for (const key in parsed) {
        if (windows.value[key]) {
          windows.value[key] = parsed[key]
        }
      }
    } catch (e) {
      // If something goes wrong loading the data, just ignore it and start fresh
      console.error('Failed to load window state', e)
    }
  }

  // Check if we have any saved system settings (sound, theme, etc.)
  const savedSettings = localStorage.getItem('gelos-settings')

  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      
      // If we found saved settings, apply them
      // We use '??' to allow 'false' values to be accepted (because false is a valid setting)
      isMatrixActive.value = parsed.matrix ?? false
      isCRTActive.value = parsed.crt ?? true
      soundEnabled.value = parsed.sound ?? true
    } catch (e) {
      console.error('Failed to load settings', e)
    }
  }

  // --- AUTO-SAVE WATCHERS ---

  // Watch for any changes to our windows (like moving or resizing)
  // When something changes, save it immediately to the browser
  watch(windows, (newVal) => {
    localStorage.setItem('gelos-windows', JSON.stringify(newVal))
  }, { deep: true }) // "deep: true" means we watch nested properties like position.x

  // Watch for system setting changes and save them
  watch([isMatrixActive, isCRTActive, soundEnabled], () => {
    localStorage.setItem('gelos-settings', JSON.stringify({
      matrix: isMatrixActive.value,
      crt: isCRTActive.value,
      sound: soundEnabled.value
    }))
  })

  // --- ACTIONS ---

  // Turn Matrix effect on/off
  function toggleMatrix() {
    isMatrixActive.value = !isMatrixActive.value
  }

  // Toggle CRT Scanlines
  function toggleCRT() {
    isCRTActive.value = !isCRTActive.value
  }

  // Toggle System Sounds
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  // Open a window (and set it up if it's the first time)
  function openWindow(id, payload = {}) {
    if (!windows.value[id]) return

    const win = windows.value[id]

    // Update window properties if provided
    if (payload.title) win.title = payload.title
    if (payload.filePath) win.filePath = payload.filePath
    if (payload.url) win.url = payload.url

    // First time opening? Set up size and position
    if (!win.hasOpened) {
        const viewportW = window.innerWidth
        const viewportH = window.innerHeight
        
        // On mobile, make windows nearly fullscreen
        const targetWidth = viewportW < 768 ? viewportW * 0.9 : 800
        const targetHeight = viewportW < 768 ? viewportH * 0.8 : 600

        win.size = { 
            width: targetWidth, 
            height: targetHeight 
        }

        // Center the window
        win.position = { 
            x: (viewportW - targetWidth) / 2, 
            y: Math.max(20, (viewportH - targetHeight) / 2)
        }

        // On desktop, add a small random offset so windows don't stack exactly
        if (viewportW > 768) {
            const range = 50
            win.position.x += (Math.random() * range * 2) - range
            win.position.y += (Math.random() * range * 2) - range
        }

        win.hasOpened = true
    }

    // Actually open the window
    win.isOpen = true
    win.isMinimized = false 
    bringToFront(id)
  }

  // Close a window
  function closeWindow(id) {
    if (!windows.value[id]) return
    windows.value[id].isOpen = false
    windows.value[id].isMinimized = false
  }

  // Minimize a window (hide it but keep it open)
  function minimizeWindow(id) {
    if (!windows.value[id]) return
    windows.value[id].isMinimized = true
  }

  // Handle clicking a window in the taskbar
  function handleTaskbarClick(id) {
    const win = windows.value[id]
    if (!win.isOpen) return

    if (win.isMinimized) {
        // If minimized, restore it
        win.isMinimized = false
        bringToFront(id)
    } else {
        // If it's already on top, minimize it
        if (win.zIndex === activeZIndex.value) {
            minimizeWindow(id)
        } else {
            // Otherwise bring it to front
            bringToFront(id)
        }
    }
  }

  // Toggle between fullscreen and normal size
  function toggleMaximize(id) {
    if (!windows.value[id]) return
    windows.value[id].isMaximized = !windows.value[id].isMaximized
    bringToFront(id)
  }

  // Bring a window to the front (on top of others)
  function bringToFront(id) {
    if (!windows.value[id]) return
    activeZIndex.value++  // Increase the z-index counter
    windows.value[id].zIndex = activeZIndex.value
  }

  // Update a window's position (used when dragging)
  function updatePosition(id, newPosition) {
    if (windows.value[id]) {
        windows.value[id].position = newPosition
    }
  }

  // Update a window's size (used when resizing)
  function updateSize(id, newSize) {
    if (windows.value[id]) {
        windows.value[id].size = newSize
    }
  }

  // Return all the functions and data that components can use
  return { 
    windows, 
    isMatrixActive, 
    isCRTActive,       // Exported so we can use it in App.vue
    soundEnabled,      // Exported so sound.js can check it
    notifications,     // The list of active notifications
    notify,            // The function to trigger a new notification
    toggleMatrix, 
    toggleCRT, 
    toggleSound,
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