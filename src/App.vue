<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue'
    import { marked } from 'marked'
    import { useWindowStore } from '@/stores/windowManager'
    import { fileSystem } from '@/utils/fileSystem'
    import { playKey, playClick } from '@/utils/sound' 
    import WindowFrame from '@/components/os/WindowFrame.vue'
    import Terminal from '@/components/apps/Terminal.vue'
    import PDFViewer from '@/components/apps/PDFViewer.vue'
    import ImageViewer from '@/components/apps/ImageViewer.vue'
    import MatrixRain from '@/components/effects/MatrixRain.vue'
    import BootScreen from '@/components/effects/BootScreen.vue'
    import { readmeContent } from '@/utils/projectReadme'
    import Browser from '@/components/apps/Browser.vue'
    import Taskbar from '@/components/os/Taskbar.vue'
    import FileExplorer from '@/components/apps/FileExplorer.vue' 
    
    const store = useWindowStore()
    const isBooting = ref(true) // Set to true for production!
  
    const readmeHtml = computed(() => marked.parse(readmeContent))
    
    const desktopIcons = computed(() => {
        return fileSystem.root.children.desktop.children
    })
  
    const finishBoot = () => {
      isBooting.value = false
      store.openWindow('readme') 
    }

    const browserInput = ref('https://gelolaus.com') 

    const navigateBrowser = () => {
        let target = browserInput.value.trim()
        if (!target.startsWith('http') && !target.startsWith('file')) {
            target = 'https://' + target
        }
        browserInput.value = target
        store.windows.browser.url = target
    }

    const handleGlobalClick = () => {
        playClick()
    }

    const handleGlobalKey = (e) => {
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return
        playKey()
    }

    onMounted(() => {
        // 'true' enables Capture Mode: Hear clicks even if event.stopPropagation() is used
        window.addEventListener('click', handleGlobalClick, true)
        window.addEventListener('keydown', handleGlobalKey)
    })

    onUnmounted(() => {
        window.removeEventListener('click', handleGlobalClick, true)
        window.removeEventListener('keydown', handleGlobalKey)
    })
</script>
    
<template>
      <BootScreen v-if="isBooting" @complete="finishBoot" />
    
      <div v-show="!isBooting" class="bg-hacker-black h-screen w-screen overflow-hidden font-mono text-gray-300 relative select-none">
        
        <div class="absolute inset-0 z-0 transition-opacity duration-700"
             :class="store.isMatrixActive ? 'opacity-100' : 'opacity-0'">
            <MatrixRain />
        </div>
    
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black transition-opacity duration-700"
             :class="store.isMatrixActive ? 'opacity-0' : 'opacity-20'">
        </div>
        
        <div class="scanline"></div>

        <div class="absolute top-4 left-4 grid gap-4 z-10">
            <div 
                v-for="(item, name) in desktopIcons" 
                :key="name"
                class="w-24 p-2 hover:bg-white/10 rounded cursor-pointer flex flex-col items-center transition-colors group"
                @click="store.openWindow(item.windowId)" 
            >
                <i :class="[item.icon, 'text-4xl mb-2 group-hover:scale-110 transition-transform duration-200', 
                    name.includes('readme') ? 'text-blue-400' : 
                    name.includes('files') ? 'text-yellow-500' : 
                    name.includes('browser') ? 'text-blue-400' : 
                    'text-gray-400']">
                </i>
                
                <span class="text-xs font-bold text-shadow text-center">
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

        <Taskbar />
        
      </div>
</template>