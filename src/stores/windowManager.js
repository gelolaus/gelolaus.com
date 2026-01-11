import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWindowStore = defineStore('windows', () => {
  const isMatrixActive = ref(false)
  const activeZIndex = ref(100)

  const defaultState = (id, title, icon, url = '', filePath = '') => ({
    id,
    title,
    icon,
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    zIndex: 10,
    hasOpened: false,
    position: { x: 100, y: 50 },
    size: { width: 800, height: 600 },
    url,
    filePath
  })

  const windows = ref({
    terminal: defaultState('terminal', 'Terminal', 'fa-solid fa-terminal'),
    files: defaultState('files', 'File Explorer', 'fa-solid fa-folder-open'),
    browser: defaultState('browser', 'Browser', 'fa-solid fa-globe', 'https://gelolaus.com'),
    pdf: defaultState('pdf', 'PDF Viewer', 'fa-solid fa-file-pdf'),
    image: defaultState('image', 'Image Viewer', 'fa-solid fa-image'),
    readme: defaultState('readme', 'README.md', 'fa-brands fa-markdown')
  })

  
  function toggleMatrix() {
    isMatrixActive.value = !isMatrixActive.value
  }

  function openWindow(id, payload = {}) {
    if (!windows.value[id]) return

    const win = windows.value[id]

    if (payload.title) win.title = payload.title
    if (payload.filePath) win.filePath = payload.filePath
    if (payload.url) win.url = payload.url

    if (!win.hasOpened) {
        if (window.innerWidth > 768) {
            const centerX = (window.innerWidth - 800) / 2
            const centerY = (window.innerHeight - 600) / 2

            const range = 300 
            const offsetX = (Math.random() * range * 2) - range
            const offsetY = (Math.random() * range * 2) - range

            win.position = { 
                x: Math.max(0, centerX + offsetX), 
                y: Math.max(0, centerY + offsetY) 
            }
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
  }

  function minimizeWindow(id) {
    if (!windows.value[id]) return
    windows.value[id].isOpen = false
    windows.value[id].isMinimized = true
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
    toggleMatrix, 
    openWindow, 
    closeWindow, 
    minimizeWindow, 
    toggleMaximize, 
    bringToFront, 
    updatePosition, 
    updateSize 
  }
})