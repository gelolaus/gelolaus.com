<script setup>
    import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
    import { marked } from 'marked'
    import { useWindowStore } from '@/stores/windowManager'
    import { fileSystem } from '@/utils/fileSystem'
    import { playKey, playClick } from '@/utils/sound' 
    import { useBreakpoints } from '@/composables/useBreakpoints'
    import WindowFrame from '@/components/os/WindowFrame.vue'
    import Taskbar from '@/components/os/Taskbar.vue'
    import BootScreen from '@/components/effects/BootScreen.vue'
    import MatrixRain from '@/components/effects/MatrixRain.vue'
    import NotificationToast from '@/components/os/NotificationToast.vue'
    import { readmeContent } from '@/utils/projectReadme'
    
    // Load app components lazily (only when needed) to speed up initial load
    const Terminal = defineAsyncComponent(() => import('@/components/apps/Terminal.vue'))
    const PDFViewer = defineAsyncComponent(() => import('@/components/apps/PDFViewer.vue'))
    const ImageViewer = defineAsyncComponent(() => import('@/components/apps/ImageViewer.vue'))
    const Browser = defineAsyncComponent(() => import('@/components/apps/Browser.vue'))
    const FileExplorer = defineAsyncComponent(() => import('@/components/apps/FileExplorer.vue'))
    const Settings = defineAsyncComponent(() => import('@/components/apps/Settings.vue'))
    const Mail = defineAsyncComponent(() => import('@/components/apps/Mail.vue'))

    const store = useWindowStore()
    const { isMobile } = useBreakpoints()
    
    // Show boot screen initially
    const isBooting = ref(true)
    
    // Track which desktop icon is selected
    const selectedIcon = ref(null)
  
    // Convert README markdown to HTML
    const readmeHtml = computed(() => marked.parse(readmeContent))
    
    // Get desktop icon list from file system
    const desktopIcons = computed(() => {
        return fileSystem.root.children.desktop.children
    })
  
    // Called when boot sequence finishes
    const finishBoot = () => {
      isBooting.value = false
      store.openWindow('readme') // Open README by default
      // Test notification on boot
      setTimeout(() => {
        store.notify('System Online', 'Welcome back, Administrator.', 'success')
      }, 1000)
    }

    // Track browser URL (for the custom address bar in header)
    const browserInput = ref('https://gelolaus.com') 

    // Navigate browser to a URL
    const navigateBrowser = () => {
        let target = browserInput.value.trim()
        // Add https:// if missing
        if (!target.startsWith('http') && !target.startsWith('file')) {
            target = 'https://' + target
        }
        browserInput.value = target
        store.windows.browser.url = target
    }

    // Play click sound on any click
    const handleGlobalClick = () => {
        playClick()
    }

    // Play keyboard sound on any keypress (except modifier keys)
    const handleGlobalKey = (e) => {
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return
        playKey()
    }
    
    // Deselect icon when clicking background
    const handleBackgroundClick = () => {
        selectedIcon.value = null
    }

    // Handle clicking a desktop icon
    const handleIconClick = (name, windowId) => {
        if (isMobile.value) {
            // On mobile, single click opens the app
            store.openWindow(windowId)
            selectedIcon.value = null
        } else {
            // On desktop, single click selects it
            selectedIcon.value = name
        }
    }

    // Handle double-clicking a desktop icon (opens the app)
    const handleIconDblClick = (windowId) => {
        store.openWindow(windowId)
        selectedIcon.value = null
    }

    // Set up global event listeners
    onMounted(() => {
        window.addEventListener('click', handleGlobalClick, true)
        window.addEventListener('keydown', handleGlobalKey)
    })

    // Clean up event listeners
    onUnmounted(() => {
        window.removeEventListener('click', handleGlobalClick, true)
        window.removeEventListener('keydown', handleGlobalKey)
    })
</script>
    
<template>
      <BootScreen v-if="isBooting" @complete="finishBoot" />
    
      <div 
        v-show="!isBooting" 
        @click="handleBackgroundClick"
        class="bg-hacker-black h-full w-full overflow-hidden font-mono text-gray-300 relative select-none touch-none"
      >
        
        <div class="absolute inset-0 z-0 transition-opacity duration-700"
             :class="store.isMatrixActive ? 'opacity-100' : 'opacity-0'">
            <MatrixRain />
        </div>
    
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black transition-opacity duration-700"
             :class="store.isMatrixActive ? 'opacity-0' : 'opacity-20'">
        </div>
        
        <div v-if="store.isCRTActive" class="scanline"></div>

        <div class="absolute top-4 left-4 grid gap-4 z-10">
            <div 
                v-for="(item, name) in desktopIcons" 
                :key="name"
                @click.stop="handleIconClick(name, item.windowId)"
                @dblclick="handleIconDblClick(item.windowId)"
                class="w-20 md:w-24 p-2 rounded cursor-pointer flex flex-col items-center transition-colors group border border-transparent"
                :class="selectedIcon === name ? 'bg-white/20 border-white/30' : 'hover:bg-white/10'"
            >
                <i :class="[item.icon, 'text-3xl md:text-4xl mb-2 transition-transform duration-200', 
                    name.includes('readme') ? 'text-blue-400' : 
                    name.includes('files') ? 'text-yellow-500' : 
                    name.includes('browser') ? 'text-blue-400' : 
                    name.includes('settings') ? 'text-gray-200' :
                    name.includes('mail') ? 'text-blue-500' :
                    'text-gray-400',
                    selectedIcon === name ? 'scale-110' : 'group-hover:scale-110']">
                </i>
                
                <span 
                    class="text-xs font-bold text-shadow text-center leading-tight px-1 rounded"
                    :class="selectedIcon === name ? 'bg-blue-600/80 text-white' : ''"
                >
                    {{ name.replace('.lnk', '').charAt(0).toUpperCase() + name.replace('.lnk', '').slice(1) }}
                </span>
            </div>
        </div>
    
        <WindowFrame windowId="terminal" :title="store.windows.terminal.title" :icon="store.windows.terminal.icon">
            <Terminal />
        </WindowFrame>
    
        <WindowFrame windowId="files" :title="store.windows.files.title" :icon="store.windows.files.icon">
            <FileExplorer />
        </WindowFrame>
        
        <WindowFrame windowId="pdf" :title="store.windows.pdf.title" :icon="store.windows.pdf.icon">
            <PDFViewer :filePath="store.windows.pdf.filePath" />
        </WindowFrame>
    
        <WindowFrame windowId="image" :title="store.windows.image.title" :icon="store.windows.image.icon">
            <ImageViewer :filePath="store.windows.image.filePath" />
        </WindowFrame>
    
        <WindowFrame windowId="readme" :title="store.windows.readme.title" :icon="store.windows.readme.icon">
            <div 
                class="h-full overflow-y-auto p-6 prose prose-invert max-w-none 
                       bg-hacker-black/90 font-sans text-sm leading-relaxed

                       prose-h1:text-hacker-green prose-h1:font-bold prose-h1:text-3xl 
                       prose-h1:mb-2 prose-h1:pb-2 prose-h1:border-b prose-h1:border-gray-700
                       
                       prose-h2:text-blue-400 prose-h2:font-bold prose-h2:text-xl 
                       prose-h2:mt-6 prose-h2:mb-3

                       prose-h3:text-yellow-500 prose-h3:font-bold prose-h3:text-lg 
                       prose-h3:mt-4 prose-h3:mb-2
                        
                       prose-p:text-gray-300 prose-p:my-3
                       prose-li:text-gray-300 prose-li:my-0.5
                       prose-ul:my-2
                       prose-strong:text-white
                       
                       prose-hr:border-gray-700 prose-hr:my-6
                       prose-img:inline-block prose-img:mr-2 prose-img:my-0
                       
                       prose-a:text-blue-400 hover:prose-a:text-blue-300"
                v-html="readmeHtml"
            ></div>
        </WindowFrame>

        <WindowFrame windowId="browser" :title="store.windows.browser.title" :icon="store.windows.browser.icon">
            <template #header-middle>
                <div class="flex-1 flex items-center max-w-[600px]">
                    <input 
                        v-model="browserInput"
                        @keydown.enter="navigateBrowser"
                        type="text" 
                        class="w-full h-6 bg-black/50 border border-gray-600 rounded px-2 text-xs text-hacker-green font-mono focus:outline-none focus:border-hacker-green placeholder-gray-600"
                        placeholder="https://..."
                    >
                    <button 
                        @click="navigateBrowser" 
                        class="ml-2 px-2 h-6 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
                    >
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </template>
            
            <Browser />
        </WindowFrame>

        <WindowFrame windowId="settings" :title="store.windows.settings.title" :icon="store.windows.settings.icon">
            <Settings />
        </WindowFrame>

        <WindowFrame windowId="mail" :title="store.windows.mail.title" :icon="store.windows.mail.icon">
            <Mail />
        </WindowFrame>

        <Taskbar />
        <NotificationToast />
        
      </div>
</template>