<script setup>
    import { ref, onMounted, onUnmounted, computed } from 'vue'
    import { useWindowStore } from '@/stores/windowManager'
    
    const store = useWindowStore()
    const clock = ref('')
    let clockInterval = null
    
    // Filter only OPEN windows
    const openWindows = computed(() => {
        return Object.values(store.windows).filter(w => w.isOpen)
    })
    
    const updateClock = () => {
        const now = new Date()
        clock.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    const handleTaskClick = (windowId) => {
        store.bringToFront(windowId)
    }
    
    onMounted(() => {
        updateClock()
        clockInterval = setInterval(updateClock, 1000)
    })
    
    onUnmounted(() => {
        if (clockInterval) clearInterval(clockInterval)
    })
    </script>
    
    <template>
        <footer class="h-12 bg-hacker-gray/90 border-t border-gray-700 flex items-center px-2 z-50 gap-2 w-full absolute bottom-0 backdrop-blur-sm">
            
            <div 
                class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded cursor-pointer transition-colors text-hacker-green font-bold text-sm tracking-wider flex items-center gap-2 select-none"
            >
                <i class="fa-brands fa-linux text-lg"></i>
                <span>START</span>
            </div>
        
            <div class="w-[1px] h-6 bg-gray-600 mx-2"></div>
        
            <div class="flex-1 flex items-center gap-2 overflow-x-auto">
                <div 
                    v-for="win in openWindows" 
                    :key="win.id"
                    @click="handleTaskClick(win.id)"
                    class="px-3 py-1 rounded flex items-center gap-2 cursor-pointer transition-all border-b-2 min-w-[120px] max-w-[200px] select-none"
                    :class="win.zIndex >= 100 
                        ? 'bg-white/10 border-hacker-green text-gray-100 shadow-[0_0_10px_rgba(0,255,65,0.1)]' 
                        : 'bg-white/5 hover:bg-white/10 border-transparent text-gray-400'" 
                >
                    <i :class="[win.icon, 'text-xs', 
                        win.id === 'files' ? 'text-yellow-500' : 
                        win.id === 'browser' ? 'text-blue-400' : 
                        win.id === 'pdf' ? 'text-red-500' : 
                        win.id === 'image' ? 'text-purple-400' : 
                        win.id === 'readme' ? 'text-blue-400' :
                        'text-gray-400']">
                    </i>
                    
                    <span class="text-xs truncate font-mono pt-0.5">{{ win.title }}</span>
                </div>
            </div>
        
            <div class="px-4 text-xs text-gray-400 font-mono select-none">
                {{ clock }}
            </div>
        </footer>
    </template>