<script setup>
    import { computed } from 'vue'
    import { useWindowStore } from '@/stores/windowManager'
    
    const emit = defineEmits(['close'])
    const store = useWindowStore()
    
    const apps = computed(() => Object.values(store.windows))
    
    const openApp = (id) => {
        store.openWindow(id)
        emit('close')
    }
    
    const shutDown = () => {
        window.location.reload()
    }
    </script>
    
    <template>
        <div class="absolute bottom-12 left-0 w-64 bg-hacker-gray border border-gray-600 shadow-2xl rounded-t-lg overflow-hidden flex flex-col z-50">
            <div class="bg-hacker-green text-black px-4 py-2 font-bold text-sm tracking-wider flex items-center justify-between">
                <span>GELOS v2.0</span>
                <i class="fa-solid fa-user-astronaut"></i>
            </div>
    
            <div class="p-2 grid gap-1">
                <div 
                    v-for="app in apps" 
                    :key="app.id"
                    @click="openApp(app.id)"
                    class="px-3 py-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3 text-gray-200 transition-colors group"
                >
                    <div class="w-6 h-6 flex items-center justify-center">
                        <i :class="[app.icon, 
                            app.id === 'files' ? 'text-yellow-500' : 
                            app.id === 'browser' ? 'text-blue-400' : 
                            app.id === 'pdf' ? 'text-red-500' : 
                            app.id === 'readme' ? 'text-blue-400' : 
                            'text-gray-400',
                            'group-hover:scale-110 transition-transform']">
                        </i>
                    </div>
                    <span class="text-sm font-mono">{{ app.title }}</span>
                </div>
            </div>
    
            <div class="h-[1px] bg-gray-600 mx-2 my-1"></div>
    
            <div class="p-2">
                <div 
                    @click="shutDown"
                    class="px-3 py-2 hover:bg-red-500/20 rounded cursor-pointer flex items-center gap-3 text-gray-200 hover:text-red-400 transition-colors"
                >
                    <div class="w-6 h-6 flex items-center justify-center">
                        <i class="fa-solid fa-power-off"></i>
                    </div>
                    <span class="text-sm font-mono font-bold">Shut Down</span>
                </div>
            </div>
        </div>
    </template>