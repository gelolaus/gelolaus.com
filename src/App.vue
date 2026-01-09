<script setup>
  import { useWindowStore } from '@/stores/windowManager'
  import WindowFrame from '@/components/os/WindowFrame.vue'
  import Terminal from '@/components/apps/Terminal.vue'
  import PDFViewer from '@/components/apps/PDFViewer.vue'
  import ImageViewer from '@/components/apps/ImageViewer.vue'
  
  const store = useWindowStore()
  </script>
  
  <template>
    <div class="bg-hacker-black h-screen w-screen overflow-hidden font-mono text-gray-300 relative select-none">
      
      <div class="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black"></div>
      
      <div class="absolute top-4 left-4 grid gap-4 z-0">
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

      <WindowFrame 
        windowId="pdf" :title="store.windows.pdf.title" icon="fa-file-pdf">
          <PDFViewer :filePath="store.windows.pdf.filePath" />
      </WindowFrame>

      <WindowFrame windowId="image" :title="store.windows.image.title" icon="fa-image">
          <ImageViewer :filePath="store.windows.image.filePath" />
      </WindowFrame>
      
    </div>
  </template>