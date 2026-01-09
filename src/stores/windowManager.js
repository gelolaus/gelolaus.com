import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWindowStore = defineStore('windows', () => {
  // 1. STATE: The list of all possible windows and their status
  const windows = ref({
    terminal: { 
      id: 'terminal', 
      title: 'Terminal', 
      icon: 'fa-terminal', 
      isOpen: false, 
      isMaximized: false, 
      zIndex: 10 
    },
    files: { 
      id: 'files', 
      title: 'File Explorer', 
      icon: 'fa-folder-open', 
      isOpen: false, 
      isMaximized: false, 
      zIndex: 10 
    },
    browser: { 
      id: 'browser', 
      title: 'GeloNet', 
      icon: 'fa-globe', 
      isOpen: false, 
      isMaximized: false, 
      zIndex: 10 
    },
    readme: { 
      id: 'readme', 
      title: 'README.md', 
      icon: 'fa-markdown', 
      isOpen: false, 
      isMaximized: false, 
      zIndex: 10 
    },
    features: { 
        id: 'features', 
        title: 'Sys Specs', 
        icon: 'fa-microchip', 
        isOpen: false, 
        isMaximized: false, 
        zIndex: 10 
    }
  })

  const activeZIndex = ref(100)

  // 2. ACTIONS: Functions to open/close windows
  function openWindow(id) {
    if (!windows.value[id]) return
    windows.value[id].isOpen = true
    bringToFront(id)
  }

  function closeWindow(id) {
    if (!windows.value[id]) return
    windows.value[id].isOpen = false
  }

  function toggleMaximize(id) {
    if (!windows.value[id]) return
    windows.value[id].isMaximized = !windows.value[id].isMaximized
  }

  function bringToFront(id) {
    if (!windows.value[id]) return
    activeZIndex.value++
    windows.value[id].zIndex = activeZIndex.value
  }

  return { windows, openWindow, closeWindow, toggleMaximize, bringToFront }
})