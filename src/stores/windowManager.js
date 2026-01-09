import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWindowStore = defineStore('windows', () => {
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
      title: 'Browser', 
      icon: 'fa-globe', 
      isOpen: false, 
      isMaximized: false, 
      zIndex: 10,
      url: 'https://gelolaus.com' // Default URL
    },
    pdf: { 
      id: 'pdf', 
      title: 'PDF Viewer', 
      icon: 'fa-file-pdf', 
      isOpen: false, 
      isMaximized: false, 
      zIndex: 10,
      filePath: '' // Holds the path to the PDF
    },
    image: { 
        id: 'image', 
        title: 'Image Viewer', 
        icon: 'fa-image', 
        isOpen: false, 
        isMaximized: false, 
        zIndex: 10,
        filePath: '' // Holds the path to the Image
    },
    readme: { 
      id: 'readme', 
      title: 'README.md', 
      icon: 'fa-markdown', 
      isOpen: false, 
      isMaximized: false, 
      zIndex: 10 
    }
  })

  const activeZIndex = ref(100)

  // Open a window (and optionally set its content)
  function openWindow(id, payload = {}) {
    if (!windows.value[id]) return

    // Update title or content if provided
    if (payload.title) windows.value[id].title = payload.title
    if (payload.filePath) windows.value[id].filePath = payload.filePath
    if (payload.url) windows.value[id].url = payload.url

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