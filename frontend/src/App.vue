<script setup>
    import { ref, computed, onMounted, onUnmounted, defineAsyncComponent, watch } from 'vue'
    import { marked } from 'marked'
    import { useWindowStore } from './stores/windowManager'
    import { fileSystem } from './utils/fileSystem'
    import { playKey, playClick } from './utils/sound' 
    import { useBreakpoints } from './composables/useBreakpoints'
    import WindowFrame from '@/components/os/WindowFrame.vue'
    import Taskbar from '@/components/os/Taskbar.vue'
    import BootScreen from '@/components/effects/BootScreen.vue'
    import MatrixRain from '@/components/effects/MatrixRain.vue'
    import NotificationToast from '@/components/os/NotificationToast.vue'
    import LoginScreen from '@/components/os/LoginScreen.vue'
    import { readmeContent } from './utils/projectReadme'
    
    // Load app components lazily
    const Terminal = defineAsyncComponent(() => import('@/components/apps/Terminal.vue'))
    const PDFViewer = defineAsyncComponent(() => import('@/components/apps/PDFViewer.vue'))
    const ImageViewer = defineAsyncComponent(() => import('@/components/apps/ImageViewer.vue'))
    const Browser = defineAsyncComponent(() => import('@/components/apps/Browser.vue'))
    const FileExplorer = defineAsyncComponent(() => import('@/components/apps/FileExplorer.vue'))
    const Settings = defineAsyncComponent(() => import('@/components/apps/Settings.vue'))
    const Mail = defineAsyncComponent(() => import('@/components/apps/Mail.vue'))
    const Notepad = defineAsyncComponent(() => import('@/components/apps/Notepad.vue'))
    const MusicPlayer = defineAsyncComponent(() => import('@/components/apps/MusicPlayer.vue'))
    const CodeViewer = defineAsyncComponent(() => import('@/components/apps/CodeViewer.vue'))
    const AboutMe = defineAsyncComponent(() => import('@/components/apps/AboutMe.vue'))
    const Chat = defineAsyncComponent(() => import('@/components/apps/Chat.vue'))
    const NetTool = defineAsyncComponent(() => import('@/components/apps/NetTool.vue'))
    
    const store = useWindowStore()
    const { isMobile } = useBreakpoints()
    
    const isBooting = ref(true)
    const isLoggingIn = ref(false) 
    const selectedIcon = ref(null)
    const currentTime = ref('')
    const isSwitcherOpen = ref(false)

    // Mobile specific: Track if an app is open in full-screen
    const activeMobileApp = computed(() => store.focusedWindow)
  
    const readmeHtml = computed(() => marked.parse(readmeContent))
    const desktopIcons = computed(() => fileSystem.root.children.desktop.children)

    // --- CLOCK LOGIC ---
    const updateTime = () => {
        const now = new Date()
        currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // --- FILE OPENING FIX FOR MOBILE ---
    // This watches for new windows (like images/PDFs) opening and auto-focuses them on mobile
    watch(() => store.activeWindows.length, (newCount, oldCount) => {
        if (isMobile.value && newCount > oldCount) {
            const latestWin = store.activeWindows[store.activeWindows.length - 1]
            if (latestWin) {
                store.focusedWindow = latestWin.id
                isSwitcherOpen.value = false
            }
        }
    })

    // --- ICON DRAG & GRID LOGIC (DESKTOP ONLY) ---
    const CELL_W = 100 
    const CELL_H = 110 
    const OFFSET_X = 16 
    const OFFSET_Y = 16 

    const dragState = ref({
        isDragging: false, iconName: null, startX: 0, startY: 0,
        initialX: 0, initialY: 0, currentX: 0, currentY: 0, hasMoved: false
    })

    const getIconPos = (name) => {
        if (dragState.value.isDragging && dragState.value.iconName === name) {
            return { x: dragState.value.currentX, y: dragState.value.currentY }
        }
        if (store.iconPositions[name]) return store.iconPositions[name]
        const keys = Object.keys(desktopIcons.value)
        const index = keys.indexOf(name)
        const maxRows = Math.max(1, Math.floor((window.innerHeight - 100) / CELL_H))
        const col = Math.floor(index / maxRows)
        const row = index % maxRows
        return { x: col * CELL_W + OFFSET_X, y: row * CELL_H + OFFSET_Y }
    }

    const startDrag = (name, e) => {
        if (isMobile.value) return 
        const clientX = e.clientX
        const clientY = e.clientY
        const currentPos = getIconPos(name)
        dragState.value = {
            isDragging: true, iconName: name, startX: clientX, startY: clientY,
            initialX: currentPos.x, initialY: currentPos.y, currentX: currentPos.x, currentY: currentPos.y, hasMoved: false
        }
        selectedIcon.value = name
        window.addEventListener('mousemove', onDrag)
        window.addEventListener('mouseup', stopDrag)
    }

    const onDrag = (e) => {
        if (!dragState.value.isDragging) return
        const dx = e.clientX - dragState.value.startX
        const dy = e.clientY - dragState.value.startY
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragState.value.hasMoved = true
        if (dragState.value.hasMoved) {
            dragState.value.currentX = dragState.value.initialX + dx
            dragState.value.currentY = dragState.value.initialY + dy
        }
    }

    const stopDrag = () => {
        if (!dragState.value.isDragging) return
        if (dragState.value.hasMoved) {
            let snappedX = Math.round((dragState.value.currentX - OFFSET_X) / CELL_W) * CELL_W + OFFSET_X
            let snappedY = Math.round((dragState.value.currentY - OFFSET_Y) / CELL_H) * CELL_H + OFFSET_Y
            store.updateIconPosition(dragState.value.iconName, { x: snappedX, y: snappedY })
        }
        dragState.value.isDragging = false
        window.removeEventListener('mousemove', onDrag)
        window.removeEventListener('mouseup', stopDrag)
    }

    const finishBoot = () => { isBooting.value = false; isLoggingIn.value = true }
    const finishLogin = () => {
      isLoggingIn.value = false
      if (!isMobile.value) store.openWindow('readme')
    }

    const handleIconClick = (windowId) => {
        store.openWindow(windowId)
        store.focusedWindow = windowId 
        selectedIcon.value = null
        isSwitcherOpen.value = false
    }

    const getIconColor = (name) => {
        if (!name) return 'text-gray-400'
        const n = name.toLowerCase()
        if (n.includes('readme')) return 'text-blue-400'
        if (n.includes('files')) return 'text-yellow-500'
        if (n.includes('browser')) return 'text-blue-400'
        if (n.includes('settings')) return 'text-gray-200'
        if (n.includes('mail')) return 'text-blue-500'
        if (n.includes('notepad')) return 'text-yellow-400'
        if (n.includes('music')) return 'text-purple-400'
        if (n.includes('code')) return 'text-blue-300'
        if (n.includes('about')) return 'text-green-400'
        if (n.includes('chat')) return 'text-teal-400'
        if (n.includes('nettool')) return 'text-orange-400'
        return 'text-gray-400'
    }

    // --- MOBILE SWITCHER & SWIPE-TO-CLOSE ---
    const touchY = ref(0)
    const cardOffsets = ref({})
    const onCardTouchStart = (e) => { touchY.value = e.touches[0].clientY }
    const onCardTouchMove = (id, e) => {
        const deltaY = e.touches[0].clientY - touchY.value
        if (deltaY < 0) cardOffsets.value[id] = deltaY
    }
    const onCardTouchEnd = (id) => {
        if (cardOffsets.value[id] < -120) {
            store.closeWindow(id)
            if (store.focusedWindow === id) store.focusedWindow = null
        }
        cardOffsets.value[id] = 0
    }

    const clearAllApps = () => {
        [...store.activeWindows].forEach(win => store.closeWindow(win.id))
        store.focusedWindow = null
        isSwitcherOpen.value = false
    }

    let _switcherTapAt = 0
    const onSwitcherTap = () => {
        const now = Date.now()
        if (now - _switcherTapAt < 400) return
        _switcherTapAt = now
        isSwitcherOpen.value = !isSwitcherOpen.value
    }

    onMounted(() => {
        updateTime()
        setInterval(updateTime, 1000)
        window.addEventListener('click', () => playClick(), true)
        window.addEventListener('keydown', (e) => { if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) playKey() })
    })
</script>
    
<template>
    <BootScreen v-if="isBooting" @complete="finishBoot" />
    <LoginScreen v-else-if="isLoggingIn" @success="finishLogin" />
    
    <div v-else class="h-full w-full overflow-hidden bg-black relative select-none touch-none font-mono">
        <div class="absolute inset-0 z-0 transition-opacity duration-700" :class="store.isMatrixActive ? 'opacity-100' : 'opacity-0'"><MatrixRain /></div>

        <div v-if="isMobile" class="h-full w-full flex flex-col relative z-[100] bg-[#0a0a0a] touch-manipulation">
            
            <div class="h-7 px-4 flex justify-between items-center text-[10px] bg-black/40 backdrop-blur-md font-sans font-bold shrink-0">
                <span>{{ currentTime }}</span>
                <div class="flex gap-2 items-center text-[11px]">
                    <i class="fa-solid fa-wifi"></i>
                    <i class="fa-solid fa-battery-three-quarters text-hacker-green"></i>
                </div>
            </div>

            <div class="flex-1 relative overflow-hidden bg-black">
                <div class="h-full w-full p-6 grid grid-cols-3 gap-y-8 gap-x-4 content-start overflow-y-auto absolute inset-0" :class="{ 'pointer-events-none opacity-50': activeMobileApp || isSwitcherOpen }">
                    <div v-for="(item, name) in desktopIcons" :key="name" @click="handleIconClick(item.windowId)" class="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                        <div class="w-16 h-16 rounded-2xl bg-gray-800/50 border border-white/5 flex items-center justify-center text-3xl shadow-xl" :class="getIconColor(name)"><i :class="item.icon"></i></div>
                        <span class="text-[10px] text-center font-bold text-gray-300 uppercase tracking-tighter">{{ name.replace('.lnk', '') }}</span>
                    </div>
                </div>

                <div v-if="activeMobileApp" class="absolute inset-0 bg-[#121212] z-50 animate-mobile-app" :class="{ 'pointer-events-none': isSwitcherOpen }">
                    <component :is="{
                        terminal: Terminal, files: FileExplorer, code: CodeViewer, pdf: PDFViewer,
                        image: ImageViewer, readme: 'div', browser: Browser, settings: Settings,
                        mail: Mail, notepad: Notepad, music: MusicPlayer, about: AboutMe,
                        chat: Chat, nettool: NetTool
                    }[activeMobileApp]" 
                    :key="activeMobileApp"
                    :filePath="store.windows[activeMobileApp]?.filePath" class="h-full" />
                    <div v-if="activeMobileApp === 'readme'" class="h-full overflow-y-auto p-6 prose prose-invert prose-sm bg-[#0a0a0a] max-w-none" v-html="readmeHtml"></div>
                </div>

                <div v-if="isSwitcherOpen" class="absolute inset-0 z-[999] bg-black/80 backdrop-blur-xl flex flex-col animate-fade-in">
                    <div class="flex-1 overflow-x-auto flex items-center gap-6 px-12 snap-x">
                        <div v-if="store.activeWindows.length === 0" class="text-gray-500 text-sm w-full text-center font-sans">No apps running</div>
                        <div 
                            v-for="win in store.activeWindows" :key="win.id"
                            class="relative shrink-0 w-64 h-[60vh] bg-gray-900 rounded-2xl border border-white/10 overflow-hidden snap-center transition-transform duration-200"
                            :style="{ transform: `translateY(${cardOffsets[win.id] || 0}px)` }"
                            @touchstart="onCardTouchStart" @touchmove="onCardTouchMove(win.id, $event)" @touchend="onCardTouchEnd(win.id)" @click="handleIconClick(win.id)"
                        >
                            <div class="h-10 bg-gray-800 flex items-center px-4 gap-2 border-b border-white/5">
                                <i :class="[win.icon, getIconColor(win.title)]" class="text-xs"></i>
                                <span class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{{ win.title }}</span>
                            </div>
                            <div class="flex-1 bg-[#121212] flex items-center justify-center p-8">
                                <i :class="win.icon" class="text-6xl opacity-10"></i>
                            </div>
                        </div>
                    </div>
                    <div v-if="store.activeWindows.length > 0" class="p-8 flex justify-center">
                        <button @click="clearAllApps" class="px-6 py-2 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white active:bg-red-500/20 transition-all">Clear All</button>
                    </div>
                </div>
            </div>

            <div class="h-14 bg-black/90 border-t border-white/5 flex justify-around items-center px-12 shrink-0 relative z-[1000]">
                <button @click.stop="store.focusedWindow = null; isSwitcherOpen = false" class="text-gray-500 active:text-white transition-colors min-h-[44px] min-w-[44px]"><i class="fa-solid fa-chevron-left text-lg"></i></button>
                <button @click.stop="store.focusedWindow = null; isSwitcherOpen = false" class="text-gray-500 active:text-white transition-colors min-h-[44px] min-w-[44px]"><i class="fa-solid fa-circle text-xl"></i></button>
                <button @click.stop="onSwitcherTap" class="text-gray-500 transition-colors min-h-[44px] min-w-[44px]" :class="isSwitcherOpen ? 'text-teal-400' : 'active:text-white'"><i class="fa-solid fa-square text-lg"></i></button>
            </div>
        </div>

        <div v-else @click="handleBackgroundClick" class="h-full w-full relative z-10 text-gray-300" :style="store.wallpaper ? { backgroundImage: `url(${store.wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
            <div v-if="store.isCRTActive" class="scanline"></div>
            <div class="absolute inset-0 z-10 pointer-events-none">
                <div v-for="(item, name) in desktopIcons" :key="name" @mousedown.stop="startDrag(name, $event)" @dblclick.stop="handleIconClick(item.windowId)" class="absolute w-24 p-2 rounded cursor-pointer flex flex-col items-center group border border-transparent pointer-events-auto transition-colors" :class="selectedIcon === name ? 'bg-white/20 border-white/30' : 'hover:bg-white/10'" :style="{ transform: `translate(${getIconPos(name).x}px, ${getIconPos(name).y}px)`, transition: (dragState.isDragging && dragState.iconName === name) ? 'none' : 'transform 0.2s' }">
                    <i :class="[item.icon, 'text-4xl mb-2 transition-transform duration-200', getIconColor(name), selectedIcon === name ? 'scale-110' : 'group-hover:scale-110']"></i>
                    <span class="text-xs font-bold text-shadow">{{ name.replace('.lnk', '') }}</span>
                </div>
            </div>
            <WindowFrame v-for="win in store.activeWindows" :key="win.id" :windowId="win.id" :title="win.title" :icon="win.icon">
                <component :is="{terminal: Terminal, files: FileExplorer, code: CodeViewer, pdf: PDFViewer, image: ImageViewer, readme: 'div', browser: Browser, settings: Settings, mail: Mail, notepad: Notepad, music: MusicPlayer, about: AboutMe, chat: Chat, nettool: NetTool}[win.id]" :filePath="win.filePath" />
                <div v-if="win.id === 'readme'" class="h-full overflow-y-auto p-6 prose prose-invert" v-html="readmeHtml"></div>
            </WindowFrame>
            <Taskbar />
        </div>
        <NotificationToast />
    </div>
</template>

<style scoped>
.animate-mobile-app { animation: mobileAppIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
@keyframes mobileAppIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.snap-x { scroll-snap-type: x mandatory; scroll-behavior: smooth; }
.snap-center { scroll-snap-align: center; }
.text-shadow { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); }
.scanline { width: 100%; height: 100px; z-index: 100; background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0) 100%); opacity: 0.1; position: absolute; bottom: 100%; animation: scanline 8s linear infinite; pointer-events: none; }
@keyframes scanline { 0% { bottom: 100%; } 100% { bottom: -100px; } }
</style>