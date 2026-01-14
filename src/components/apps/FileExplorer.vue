<script setup>
    import { ref, computed } from 'vue'
    import { useWindowStore } from '@/stores/windowManager'
    import { fileSystem } from '@/utils/fileSystem'
    import { useBreakpoints } from '@/composables/useBreakpoints'
    
    const store = useWindowStore()
    const { isMobile } = useBreakpoints()
    
    // Keep track of what folder we're currently viewing
    const currentPath = ref(['root', 'desktop'])
    
    // Get the folder object we're currently in
    const currentFolderNode = computed(() => {
        let node = fileSystem.root
        // Walk through the path to find the current folder
        for (let i = 1; i < currentPath.value.length; i++) {
            if (node.children && node.children[currentPath.value[i]]) {
                node = node.children[currentPath.value[i]]
            } else {
                return { children: {} }
            }
        }
        return node
    })
    
    // Get list of files to show (with some filtering)
    const currentFiles = computed(() => {
        const rawFiles = currentFolderNode.value.children || {}
        const processedFiles = {}
        
        // On desktop, hide some shortcuts that are already on the main desktop
        const isDesktop = currentPath.value.length === 2 && currentPath.value[1] === 'desktop'
    
        for (const [key, value] of Object.entries(rawFiles)) {
            if (isDesktop) {
                // Skip these shortcuts on desktop view
                if (['terminal.lnk', 'files.lnk', 'browser.lnk'].includes(key)) {
                    continue
                }
                // Remove .lnk extension from shortcut names
                const newKey = key.replace('.lnk', '')
                processedFiles[newKey] = value
            } else {
                processedFiles[key] = value
            }
        }
        
        return processedFiles
    })
    
    // Format path for display (like "~/documents")
    const pathDisplay = computed(() => {
        if (currentPath.value.length === 1) return '/'
        return '~/' + currentPath.value.slice(1).join('/')
    })
    
    // Jump directly to a folder (from sidebar)
    const navigateTo = (location) => {
        currentPath.value = ['root', location]
    }
    
    // Go up one folder
    const goUp = () => {
        if (currentPath.value.length > 1) {
            currentPath.value.pop()
        }
    }
    
    // Open a file or folder when user clicks it
    const openItem = (name, item) => {
        if (item.type === 'directory') {
            // Go into the folder
            currentPath.value.push(name)
        } 
        else if (item.type === 'shortcut') {
            // Launch the app
            store.openWindow(item.windowId)
        } 
        else if (item.type === 'pdf') {
            // Open PDF viewer
            store.openWindow('pdf', { title: name, filePath: item.path })
        }
        else if (item.type === 'img') {
            // Open image viewer
            store.openWindow('image', { title: name, filePath: item.path })
        }
    }
    </script>
    
    <template>
        <div class="flex-1 flex overflow-hidden h-full font-mono select-none">
            
            <div class="w-16 md:w-48 bg-gray-800 border-r border-gray-700 flex flex-col py-2">
                
                <div 
                    @click="navigateTo('desktop')"
                    class="sidebar-item px-4 py-2 cursor-pointer flex items-center gap-3 border-l-2 transition-colors"
                    :class="currentPath.includes('desktop') && currentPath.length === 2 ? 'bg-white/10 text-gray-100 border-hacker-green' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent'"
                >
                    <i class="fa-solid fa-desktop text-blue-400 w-4"></i>
                    <span class="hidden md:inline text-sm">Desktop</span>
                </div>
    
                <div 
                    @click="navigateTo('documents')"
                    class="sidebar-item px-4 py-2 cursor-pointer flex items-center gap-3 border-l-2 transition-colors"
                    :class="currentPath.includes('documents') ? 'bg-white/10 text-gray-100 border-hacker-green' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent'"
                >
                    <i class="fa-solid fa-file-lines text-yellow-500 w-4"></i>
                    <span class="hidden md:inline text-sm">Documents</span>
                </div>
    
                <div 
                    @click="navigateTo('pictures')"
                    class="sidebar-item px-4 py-2 cursor-pointer flex items-center gap-3 border-l-2 transition-colors"
                    :class="currentPath.includes('pictures') ? 'bg-white/10 text-gray-100 border-hacker-green' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent'"
                >
                    <i class="fa-solid fa-images text-purple-400 w-4"></i>
                    <span class="hidden md:inline text-sm">Pictures</span>
                </div>
                
                <div class="flex-1"></div>
                
                 <div 
                    @click="currentPath = ['root']"
                    class="sidebar-item px-4 py-2 cursor-pointer flex items-center gap-3 border-l-2 transition-colors"
                    :class="currentPath.length === 1 ? 'bg-white/10 text-gray-100 border-hacker-green' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent'"
                >
                    <i class="fa-solid fa-hard-drive text-gray-500 w-4"></i>
                    <span class="hidden md:inline text-sm">Local Disk (C:)</span>
                </div>
            </div>
    
            <div class="flex-1 bg-hacker-black/50 flex flex-col relative overflow-hidden">
                
                <div class="h-10 border-b border-gray-700 flex items-center px-4 gap-2 bg-gray-800/50">
                    <button 
                        @click="goUp" 
                        class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                        :class="currentPath.length > 1 ? 'text-gray-200' : 'text-gray-600 cursor-not-allowed'"
                        :disabled="currentPath.length <= 1"
                    >
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    
                    <div class="h-4 w-[1px] bg-gray-600 mx-2"></div>
                    
                    <div class="text-sm text-gray-300 font-mono flex-1 truncate">
                       {{ pathDisplay }}
                    </div>
                </div>
    
                <div class="flex-1 p-4 overflow-y-auto">
                    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div 
                            v-for="(item, name) in currentFiles" 
                            :key="name"
                            class="group flex flex-col items-center p-2 hover:bg-white/10 rounded cursor-pointer transition-colors"
                            @dblclick="openItem(name, item)"
                            @click="isMobile && openItem(name, item)" 
                        >
                            <i v-if="item.type === 'directory'" class="fa-solid fa-folder text-4xl text-yellow-500 mb-2 group-hover:scale-110 transition-transform"></i>
                            <i v-else-if="item.type === 'pdf'" class="fa-solid fa-file-pdf text-4xl text-red-500 mb-2 group-hover:scale-110 transition-transform"></i>
                            <i v-else-if="item.type === 'img'" class="fa-solid fa-image text-4xl text-purple-400 mb-2 group-hover:scale-110 transition-transform"></i>
                            <i v-else-if="item.windowId === 'readme'" class="fa-brands fa-markdown text-4xl text-blue-400 mb-2 group-hover:scale-110 transition-transform"></i>
                            <i v-else-if="item.windowId === 'browser'" class="fa-solid fa-globe text-4xl text-blue-400 mb-2 group-hover:scale-110 transition-transform"></i>
                            <i v-else-if="item.windowId === 'terminal'" class="fa-solid fa-terminal text-4xl text-gray-400 mb-2 group-hover:scale-110 transition-transform"></i>
                            <i v-else class="fa-solid fa-file text-4xl text-gray-400 mb-2"></i>
    
                            <span class="text-xs text-center text-gray-300 break-words w-full line-clamp-2 leading-tight">{{ name }}</span>
                        </div>
                        
                        <div v-if="Object.keys(currentFiles).length === 0" class="col-span-full flex flex-col items-center justify-center text-gray-500 mt-10">
                            <i class="fa-regular fa-folder-open text-4xl mb-2 opacity-50"></i>
                            <span class="text-sm">This folder is empty.</span>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    </template>