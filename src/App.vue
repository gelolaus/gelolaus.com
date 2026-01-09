<script setup>
  import { ref } from 'vue'
  import { useWindowStore } from '@/stores/windowManager'
  import WindowFrame from '@/components/os/WindowFrame.vue'
  import Terminal from '@/components/apps/Terminal.vue'
  import PDFViewer from '@/components/apps/PDFViewer.vue'
  import ImageViewer from '@/components/apps/ImageViewer.vue'
  import MatrixRain from '@/components/effects/MatrixRain.vue'
  import BootScreen from '@/components/effects/BootScreen.vue'
  
  const store = useWindowStore()
  const isBooting = ref(true)

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
          <div class="w-24 p-2 hover:bg-white/10 rounded cursor-pointer flex flex-col items-center transition-colors" @click="store.openWindow('terminal')">
              <i class="fa-solid fa-terminal text-4xl text-gray-400 mb-2"></i>
              <span class="text-xs font-bold text-shadow">Terminal</span>
          </div>
  
          <div class="w-24 p-2 hover:bg-white/10 rounded cursor-pointer flex flex-col items-center transition-colors" @click="store.openWindow('files')">
              <i class="fa-solid fa-folder-open text-4xl text-yellow-500 mb-2"></i>
              <span class="text-xs font-bold text-shadow">Files</span>
          </div>
      </div>
  
      <WindowFrame windowId="terminal" title="Terminal" icon="fa-terminal">
          <Terminal />
      </WindowFrame>
  
      <WindowFrame windowId="files" title="File Explorer" icon="fa-folder-open">
          <div class="p-10 text-center">Files Coming Soon...</div>
      </WindowFrame>
      
      <WindowFrame windowId="pdf" :title="store.windows.pdf.title" icon="fa-file-pdf">
          <PDFViewer :filePath="store.windows.pdf.filePath" />
      </WindowFrame>
  
      <WindowFrame windowId="image" :title="store.windows.image.title" icon="fa-image">
          <ImageViewer :filePath="store.windows.image.filePath" />
      </WindowFrame>
  
      <WindowFrame windowId="readme" title="README.md" icon="fa-markdown">
          <div class="p-6 prose prose-invert max-w-none">
               <h1>Welcome to GelOS v2.0</h1>
               <p>This is my interactive portfolio built with Vue.js.</p>
               <ul>
                  <li>Use the <strong>Terminal</strong> to explore using commands.</li>
                  <li>Click <strong>Icons</strong> to open apps.</li>
                  <li>Try typing <code>matrix</code> in the terminal!</li>
               </ul>
          </div>
      </WindowFrame>
      
    </div>
</template>