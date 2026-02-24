<script setup>
    import { ref, computed } from 'vue'
    import { useWindowStore } from '../../stores/windowManager'
    import { fileSystem } from '../../utils/fileSystem'
    import { useBreakpoints } from '../../composables/useBreakpoints'
    
    const store = useWindowStore()
    const { isMobile } = useBreakpoints()
    
    const currentPath = ref(['root', 'desktop'])
    
    const currentFolderNode = computed(() => {
        let node = fileSystem.root
        for (let i = 1; i < currentPath.value.length; i++) {
            if (node.children && node.children[currentPath.value[i]]) {
                node = node.children[currentPath.value[i]]
            } else {
                return { children: {} }
            }
        }
        return node
    })
    
    const currentFiles = computed(() => {
        const rawFiles = currentFolderNode.value.children || {}
        const processedFiles = {}
        const isDesktop = currentPath.value.length === 2 && currentPath.value[1] === 'desktop'
    
        for (const [key, value] of Object.entries(rawFiles)) {
            if (isDesktop) {
                if (['terminal.lnk', 'files.lnk', 'browser.lnk'].includes(key)) continue
                const newKey = key.replace('.lnk', '')
                processedFiles[newKey] = value
            } else {
                processedFiles[key] = value
            }
        }
        return processedFiles
    })
    
    const pathDisplay = computed(() => {
        if (currentPath.value.length === 1) return '/'
        return '~/' + currentPath.value.slice(1).join('/')
    })
    
    const navigateTo = (location) => {
        currentPath.value = ['root', location]
    }

    const navigateToSegment = (index) => {
        currentPath.value = currentPath.value.slice(0, index + 1)
    }
    
    const goUp = () => {
        if (currentPath.value.length > 1) {
            currentPath.value.pop()
        }
    }
    
    const openItem = (name, item) => {
        if (item.type === 'directory') {
            currentPath.value.push(name)
        } 
        else if (item.type === 'shortcut') {
            store.openWindow(item.windowId)
        } 
        else if (item.type === 'pdf') {
            store.openWindow('pdf', { title: name, filePath: item.path })
        }
        else if (item.type === 'img') {
            store.openWindow('image', { title: name, filePath: item.path })
        }
    }
</script>
    
<template>
    <div class="flex-1 flex overflow-hidden h-full font-mono select-none bg-hacker-black">
        
        <div class="w-14 md:w-48 bg-gray-900 border-r border-gray-800 flex flex-col py-2 shrink-0">
            <div 
                v-for="folder in [
                    { id: 'desktop', icon: 'fa-desktop', color: 'text-blue-400', label: 'Desktop' },
                    { id: 'documents', icon: 'fa-file-lines', color: 'text-yellow-500', label: 'Documents' },
                    { id: 'pictures', icon: 'fa-images', color: 'text-purple-400', label: 'Pictures' }
                ]"
                :key="folder.id"
                @click="navigateTo(folder.id)"
                class="px-4 py-3 cursor-pointer flex items-center justify-center md:justify-start gap-3 border-l-2 transition-all active:bg-white/10"
                :class="currentPath.includes(folder.id) && currentPath.length === 2 ? 'bg-white/10 text-gray-100 border-hacker-green' : 'text-gray-500 border-transparent'"
            >
                <i :class="['fa-solid w-4 text-lg md:text-base', folder.icon, folder.color]"></i>
                <span class="hidden md:inline text-sm">{{ folder.label }}</span>
            </div>

            <div class="flex-1"></div>
            
            <div 
                @click="currentPath = ['root']"
                class="px-4 py-3 cursor-pointer flex items-center justify-center md:justify-start gap-3 border-l-2 border-transparent text-gray-500 active:bg-white/10"
                :class="{ 'bg-white/10 text-gray-100 border-hacker-green': currentPath.length === 1 }"
            >
                <i class="fa-solid fa-hard-drive w-4 text-lg md:text-base"></i>
                <span class="hidden md:inline text-sm">System (C:)</span>
            </div>
        </div>

        <div class="flex-1 flex flex-col min-w-0">
            <div class="h-12 border-b border-gray-800 flex items-center px-4 gap-2 bg-gray-900/50">
                <button 
                    @click="goUp" 
                    class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-hacker-green active:text-black transition-colors"
                    :class="currentPath.length > 1 ? 'text-gray-200' : 'text-gray-600 cursor-not-allowed'"
                    :disabled="currentPath.length <= 1"
                >
                    <i class="fa-solid fa-arrow-up text-xs"></i>
                </button>
                
                <div class="h-4 w-[1px] bg-gray-700 mx-1"></div>
                
                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <template v-for="(segment, index) in currentPath" :key="index">
                        <button 
                            @click="navigateToSegment(index)"
                            class="text-[10px] md:text-xs px-2 py-1 rounded hover:bg-white/10 active:text-hacker-green transition-colors"
                            :class="index === currentPath.length - 1 ? 'text-white font-bold' : 'text-gray-500'"
                        >
                            {{ segment === 'root' ? 'System' : segment }}
                        </button>
                        <i v-if="index < currentPath.length - 1" class="fa-solid fa-chevron-right text-[8px] text-gray-700"></i>
                    </template>
                </div>
            </div>

            <div class="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                    <div 
                        v-for="(item, name) in currentFiles" 
                        :key="name"
                        class="group flex flex-col items-center p-3 rounded-xl hover:bg-white/5 active:bg-hacker-green/20 cursor-pointer transition-all border border-transparent active:border-hacker-green/30"
                        @dblclick="!isMobile && openItem(name, item)"
                        @click="isMobile && openItem(name, item)" 
                    >
                        <div class="relative mb-2 group-hover:scale-110 transition-transform duration-200">
                            <i v-if="item.type === 'directory'" class="fa-solid fa-folder text-4xl text-yellow-500"></i>
                            <i v-else-if="item.type === 'pdf'" class="fa-solid fa-file-pdf text-4xl text-red-500"></i>
                            <i v-else-if="item.type === 'img'" class="fa-solid fa-image text-4xl text-purple-400"></i>
                            <i v-else-if="item.windowId === 'readme'" class="fa-brands fa-markdown text-4xl text-blue-400"></i>
                            <i v-else-if="item.windowId === 'browser'" class="fa-solid fa-globe text-4xl text-blue-400"></i>
                            <i v-else-if="item.windowId === 'terminal'" class="fa-solid fa-terminal text-4xl text-gray-400"></i>
                            <i v-else class="fa-solid fa-file text-4xl text-gray-400"></i>
                        </div>

                        <span class="text-[10px] md:text-xs text-center text-gray-300 break-all w-full line-clamp-2 leading-tight px-1">
                            {{ name }}
                        </span>
                    </div>

                    <div v-if="Object.keys(currentFiles).length === 0" class="col-span-full flex flex-col items-center justify-center text-gray-600 mt-12">
                        <i class="fa-regular fa-folder-open text-5xl mb-4 opacity-20"></i>
                        <span class="text-xs uppercase tracking-widest opacity-40">Directory Empty</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>