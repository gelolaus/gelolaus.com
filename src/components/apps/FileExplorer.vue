<script setup>
    import { ref, computed } from 'vue'
    import { useWindowStore } from '@/stores/windowManager'
    import { fileSystem } from '@/utils/fileSystem'
    
    const store = useWindowStore()
    const currentFolder = ref('desktop') // Default folder
    
    // Get the files for the currently selected folder
    const currentFiles = computed(() => {
        const folder = fileSystem.root.children[currentFolder.value]
        return folder ? folder.children : {}
    })
    
    // Helper to handle clicks on files
    const openFile = (filename, file) => {
        if (file.type === 'shortcut') {
            store.openWindow(file.windowId)
        } 
        else if (file.type === 'pdf') {
            store.openWindow('pdf', { title: filename, filePath: file.path })
        }
        else if (file.type === 'img') {
            store.openWindow('image', { title: filename, filePath: file.path })
        }
    }
    </script>
    
    <template>
        <div class="flex-1 flex overflow-hidden h-full font-mono">
            
            <div class="w-16 md:w-48 bg-gray-800 border-r border-gray-700 flex flex-col py-2">
                
                <div 
                    @click="currentFolder = 'desktop'"
                    class="sidebar-item px-4 py-2 cursor-pointer flex items-center gap-3 border-l-2 transition-colors"
                    :class="currentFolder === 'desktop' ? 'bg-white/10 text-gray-100 border-hacker-green' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent'"
                >
                    <i class="fa-solid fa-desktop text-blue-400 w-4"></i>
                    <span class="hidden md:inline text-sm">Desktop</span>
                </div>
    
                <div 
                    @click="currentFolder = 'documents'"
                    class="sidebar-item px-4 py-2 cursor-pointer flex items-center gap-3 border-l-2 transition-colors"
                    :class="currentFolder === 'documents' ? 'bg-white/10 text-gray-100 border-hacker-green' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent'"
                >
                    <i class="fa-solid fa-file-lines text-yellow-500 w-4"></i>
                    <span class="hidden md:inline text-sm">Documents</span>
                </div>
    
                <div 
                    @click="currentFolder = 'pictures'"
                    class="sidebar-item px-4 py-2 cursor-pointer flex items-center gap-3 border-l-2 transition-colors"
                    :class="currentFolder === 'pictures' ? 'bg-white/10 text-gray-100 border-hacker-green' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent'"
                >
                    <i class="fa-solid fa-images text-purple-400 w-4"></i>
                    <span class="hidden md:inline text-sm">Pictures</span>
                </div>
            </div>
    
            <div class="flex-1 bg-hacker-black/50 p-4 overflow-y-auto relative">
                
                <div class="text-xs text-gray-500 mb-4">
                    / home / gelo / {{ currentFolder }}
                </div>
    
                <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
                    <div 
                        v-for="(file, name) in currentFiles" 
                        :key="name"
                        class="group flex flex-col items-center p-2 hover:bg-white/10 rounded cursor-pointer transition-colors"
                        @click="openFile(name, file)"
                    >
                        <i v-if="file.type === 'pdf'" class="fa-solid fa-file-pdf text-4xl text-red-500 mb-2 group-hover:scale-110 transition-transform"></i>
                        <i v-else-if="file.type === 'img'" class="fa-solid fa-image text-4xl text-purple-400 mb-2 group-hover:scale-110 transition-transform"></i>
                        <i v-else-if="file.windowId === 'readme'" class="fa-brands fa-markdown text-4xl text-blue-400 mb-2 group-hover:scale-110 transition-transform"></i>
                        <i v-else-if="file.windowId === 'browser'" class="fa-solid fa-globe text-4xl text-blue-400 mb-2 group-hover:scale-110 transition-transform"></i>
                        <i v-else-if="file.windowId === 'terminal'" class="fa-solid fa-terminal text-4xl text-gray-400 mb-2 group-hover:scale-110 transition-transform"></i>
                        <i v-else class="fa-solid fa-file text-4xl text-gray-400 mb-2"></i>
    
                        <span class="text-xs text-center text-gray-300 break-all">{{ name }}</span>
                    </div>
                </div>
    
            </div>
        </div>
    </template>