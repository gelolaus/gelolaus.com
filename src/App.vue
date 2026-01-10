<script setup>
    import { ref, computed } from 'vue'
    import { marked } from 'marked'
    import { useWindowStore } from '@/stores/windowManager'
    import { fileSystem } from '@/utils/fileSystem'
    import WindowFrame from '@/components/os/WindowFrame.vue'
    import Terminal from '@/components/apps/Terminal.vue'
    import PDFViewer from '@/components/apps/PDFViewer.vue'
    import ImageViewer from '@/components/apps/ImageViewer.vue'
    import MatrixRain from '@/components/effects/MatrixRain.vue'
    import BootScreen from '@/components/effects/BootScreen.vue'
    import { readmeContent } from '@/utils/projectReadme'
    import Browser from '@/components/apps/Browser.vue'
    
    const store = useWindowStore()
    const isBooting = ref(false)
  
    const readmeHtml = computed(() => marked.parse(readmeContent))
    
    // Helper to get desktop icons dynamically
    const desktopIcons = computed(() => {
        return fileSystem.root.children.desktop.children
    })
  
    const finishBoot = () => {
      isBooting.value = false
      store.openWindow('readme') 
    }
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
        
        <div class="absolute top-4 left-4 grid gap-4 z-10">
            <div 
                v-for="(item, name) in desktopIcons" 
                :key="name"
                class="w-24 p-2 hover:bg-white/10 rounded cursor-pointer flex flex-col items-center transition-colors group"
                @click="store.openWindow(item.windowId)"
            >
                <i :class="[item.icon, 'text-4xl mb-2 group-hover:scale-110 transition-transform duration-200', 
                    name.includes('readme') ? 'text-gray-200' : 
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
            <div class="p-10 text-center">Files Coming Soon...</div>
        </WindowFrame>
        
        <WindowFrame windowId="pdf" :title="store.windows.pdf.title" :icon="store.windows.pdf.icon">
            <PDFViewer :filePath="store.windows.pdf.filePath" />
        </WindowFrame>
    
        <WindowFrame windowId="image" :title="store.windows.image.title" :icon="store.windows.image.icon">
            <ImageViewer :filePath="store.windows.image.filePath" />
        </WindowFrame>
    
        <WindowFrame windowId="readme" :title="store.windows.readme.title" :icon="store.windows.readme.icon">
          <div class="h-full overflow-y-auto p-6 prose prose-invert max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300" v-html="readmeHtml"></div>
        </WindowFrame>

        <WindowFrame windowId="browser" :title="store.windows.browser.title" :icon="store.windows.browser.icon">
          <Browser />
        </WindowFrame>
        
      </div>
  </template>