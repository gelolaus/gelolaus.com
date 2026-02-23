<script setup>
import { ref, watch, computed } from 'vue'
import { fileSystem } from '@/utils/fileSystem'
import { Editor } from '@guolao/vue-monaco-editor'
import { useWindowStore } from '@/stores/windowManager'

const props = defineProps({
  filePath: {
    type: String,
    default: ''
  }
})

const store = useWindowStore()

// State for our VS Code style tabs
const openTabs = ref([])
const activeTabPath = ref('')

// Helper to find the file's content in our virtual fileSystem
const getFileNode = (path) => {
  if (!path) return null
  const parts = path.split('/')
  let current = fileSystem.root
  for (const part of parts) {
    if (current.children && current.children[part]) {
      current = current.children[part]
    } else {
      return null
    }
  }
  return current
}

// Helper to determine language for syntax highlighting
const getLanguage = (path) => {
  if (path.endsWith('.py')) return 'python'
  if (path.endsWith('.vue') || path.endsWith('.html')) return 'html'
  if (path.endsWith('.css')) return 'css'
  if (path.endsWith('.json')) return 'json'
  return 'javascript' // default
}

// Watch for files being opened via the OS (File Explorer or Terminal)
watch(() => props.filePath, (newPath) => {
  if (!newPath) return

  // Check if the tab is already open
  const existingTab = openTabs.value.find(t => t.path === newPath)
  
  if (existingTab) {
    // If it is, just make it the active tab
    activeTabPath.value = newPath
  } else {
    // If it's new, fetch it from the file system and add a new tab
    const node = getFileNode(newPath)
    if (node) {
      openTabs.value.push({
        path: newPath,
        name: newPath.split('/').pop(),
        content: node.content || '// Empty file',
        language: getLanguage(newPath)
      })
      activeTabPath.value = newPath
    }
  }
}, { immediate: true })

// The currently viewed tab object
const activeTab = computed(() => {
  return openTabs.value.find(t => t.path === activeTabPath.value)
})

// Function to handle clicking the 'x' on a tab
const closeTab = (path, event) => {
  event.stopPropagation() // Prevent click from selecting the tab
  
  const index = openTabs.value.findIndex(t => t.path === path)
  if (index > -1) {
    openTabs.value.splice(index, 1) // Remove from array
    
    // Clear the store's filePath memory so if we close it and immediately reopen it, Vue registers the change
    if (store.windows.code.filePath === path) {
      store.windows.code.filePath = ''
    }

    // If we closed the active tab, fall back to the adjacent tab
    if (activeTabPath.value === path) {
      if (openTabs.value.length > 0) {
        // Switch to the previous tab (or the first one if we closed the first tab)
        activeTabPath.value = openTabs.value[Math.max(0, index - 1)].path
      } else {
        // No tabs left
        activeTabPath.value = ''
      }
    }
  }
}

const editorOptions = {
  readOnly: true,
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: '"Fira Code", monospace',
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  renderLineHighlight: 'all'
}
</script>

<template>
  <div class="h-full bg-[#1e1e1e] flex flex-col font-mono text-gray-200 overflow-hidden">
    
    <div class="bg-[#252526] flex overflow-x-auto custom-scrollbar shrink-0 select-none">
      
      <div
        v-for="tab in openTabs"
        :key="tab.path"
        @click="activeTabPath = tab.path"
        class="group flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-[#1e1e1e] border-t-2 transition-colors min-w-max"
        :class="activeTabPath === tab.path ? 'bg-[#1e1e1e] border-t-blue-500 text-white' : 'bg-[#2d2d2d] border-t-transparent text-gray-400 hover:bg-[#2b2d2e]'"
      >
        <i class="fa-brands fa-js text-yellow-400" v-if="tab.language === 'javascript'"></i>
        <i class="fa-brands fa-python text-blue-400" v-if="tab.language === 'python'"></i>
        <i class="fa-brands fa-html5 text-orange-400" v-if="tab.language === 'html'"></i>
        <i class="fa-brands fa-css3-alt text-blue-500" v-if="tab.language === 'css'"></i>
        <i class="fa-solid fa-code text-gray-400" v-if="!['javascript', 'python', 'html', 'css'].includes(tab.language)"></i>
        
        <span class="text-xs">{{ tab.name }}</span>
        
        <div 
          @click.stop="closeTab(tab.path, $event)"
          class="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100': activeTabPath === tab.path }"
        >
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </div>
      </div>
      
    </div>

    <div class="flex-1 relative" v-if="activeTab">
      <Editor
        :language="activeTab.language"
        :value="activeTab.content"
        :options="editorOptions"
        theme="vs-dark"
      />
    </div>
    
    <div v-else class="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] select-none">
      <i class="fa-solid fa-code text-8xl text-gray-800 mb-6"></i>
      <p class="text-gray-500 text-sm">Open a file from the terminal to view code</p>
      <p class="text-gray-600 text-xs mt-2 font-sans">e.g. <span class="text-blue-400 font-mono">open scripts/init.js</span></p>
    </div>
    
    <div class="bg-[#007acc] px-3 py-1 text-[10px] text-white flex justify-between select-none shrink-0" v-if="activeTab">
      <div class="flex gap-4">
        <span><i class="fa-solid fa-code-branch mr-1"></i> main</span>
        <span v-if="editorOptions.readOnly"><i class="fa-solid fa-ban mr-1"></i> READ ONLY</span>
      </div>
      <div class="flex gap-4">
        <span>UTF-8</span>
        <span>{{ activeTab.language.toUpperCase() }}</span>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
/* Slim scrollbar for the tab list */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563; 
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280; 
}
</style>