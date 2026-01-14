<script setup>
    import { computed } from 'vue'
    import { useWindowStore } from '@/stores/windowManager'
    import { useBreakpoints } from '@/composables/useBreakpoints'
    
    // Tell parent to close the menu
    const emit = defineEmits(['close'])
    const store = useWindowStore()
    const { isMobile } = useBreakpoints()
    
    // Get list of all available apps
    const apps = computed(() => Object.values(store.windows))
    
    // Open an app from the menu
    const openApp = (id) => {
        store.openWindow(id)
        emit('close') // Close menu after opening app
    }
    
    // "Shut down" by reloading the page
    const shutDown = () => {
        window.location.reload()
    }
</script>
    
<template>
    <div 
        id="start-menu-root"
        class="bg-hacker-gray border-gray-600 shadow-2xl overflow-hidden flex flex-col z-[9999]"
        :class="isMobile 
            ? 'fixed top-0 left-0 right-0 bottom-12 border-b' 
            : 'absolute bottom-12 left-0 w-64 border rounded-t-lg'"
    >
        <div class="bg-hacker-green text-black px-4 py-2 font-bold text-sm tracking-wider flex items-center justify-between shrink-0">
            <span>GelOS v2.0</span>
            <i class="fa-solid fa-user-astronaut"></i>
        </div>

        <div class="p-2 grid gap-1 overflow-y-auto flex-1 content-start" :class="isMobile ? 'grid-cols-2 gap-4 p-4' : ''">
            <div 
                v-for="app in apps" 
                :key="app.id"
                @click="openApp(app.id)"
                class="px-3 py-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3 text-gray-200 transition-colors group"
                :class="isMobile ? 'flex-col justify-center py-6 bg-white/5 border border-white/5' : ''"
            >
                <div class="flex items-center justify-center" :class="isMobile ? 'w-12 h-12' : 'w-6 h-6'">
                    <i :class="[app.icon, 
                        app.id === 'files' ? 'text-yellow-500' : 
                        app.id === 'browser' ? 'text-blue-400' : 
                        app.id === 'pdf' ? 'text-red-500' : 
                        app.id === 'readme' ? 'text-blue-400' : 
                        'text-gray-400',
                        'transition-transform',
                        isMobile ? 'text-3xl' : 'group-hover:scale-110']">
                    </i>
                </div>
                <span class="font-mono" :class="isMobile ? 'text-xs text-center' : 'text-sm'">{{ app.title }}</span>
            </div>
        </div>

        <div class="h-[1px] bg-gray-600 mx-2 my-1 shrink-0"></div>

        <div class="p-2 shrink-0">
            <div 
                @click="shutDown"
                class="px-3 py-2 hover:bg-red-500/20 rounded cursor-pointer flex items-center gap-3 text-gray-200 hover:text-red-400 transition-colors"
                :class="isMobile ? 'justify-center bg-red-500/10' : ''"
            >
                <div class="w-6 h-6 flex items-center justify-center">
                    <i class="fa-solid fa-power-off"></i>
                </div>
                <span class="text-sm font-mono font-bold">Shut Down</span>
            </div>
        </div>
    </div>
</template>