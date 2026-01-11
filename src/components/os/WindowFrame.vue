<script setup>
  import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
  import interact from 'interactjs'
  import { useWindowStore } from '@/stores/windowManager'
  
  const props = defineProps(['windowId', 'title', 'icon'])
  const store = useWindowStore()
  const windowRef = ref(null)
  const isMobile = ref(false) // Track mobile state
  
  // Access the state for this specific window
  const winState = computed(() => store.windows[props.windowId])
  
  // Check if we are on a mobile device
  const checkMobile = () => {
      isMobile.value = window.innerWidth < 768
  }
  
  // Function to initialize Drag & Drop
  const initInteract = (el) => {
    interact(el).draggable({
      allowFrom: '.window-header', 
      modifiers: [
        interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true })
      ],
      listeners: {
        move(event) {
          // Disable dragging on mobile or if maximized
          if (isMobile.value || winState.value.isMaximized) return; 
          
          const target = event.target
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
          target.style.transform = `translate(${x}px, ${y}px)`
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        }
      }
    }).resizable({
      edges: { left: true, right: true, bottom: true, top: false },
      modifiers: [
          interact.modifiers.restrictSize({
              min: { width: 300, height: 200 }
          })
      ],
      listeners: {
          move(event) {
              // Disable resizing on mobile or if maximized
              if (isMobile.value || winState.value.isMaximized) return;
  
              let { x, y } = event.target.dataset
              x = (parseFloat(x) || 0) + event.deltaRect.left
              y = (parseFloat(y) || 0) + event.deltaRect.top
              
              Object.assign(event.target.style, {
                  width: `${event.rect.width}px`,
                  height: `${event.rect.height}px`,
                  transform: `translate(${x}px, ${y}px)`
              })
              Object.assign(event.target.dataset, { x, y })
          }
      }
    })
  }
  
  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  
    // Initialize drag/drop when window opens
    watch(
      () => winState.value.isOpen,
      async (isOpen) => {
        if (isOpen) {
          await nextTick()
          const el = windowRef.value
          if (el) initInteract(el)
        }
      },
      { immediate: true }
    )
  
    watch(
      () => winState.value.isMaximized,
      (maximized) => {
          const el = windowRef.value
          if (!el) return
  
          if (maximized) {
              el.style.transform = 'none'
          } else {
              const x = el.getAttribute('data-x') || 0
              const y = el.getAttribute('data-y') || 0
              el.style.transform = `translate(${x}px, ${y}px)`
          }
      }
    )
  })
  
  onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
  })
  </script>
  
  <template>
    <div 
      v-if="winState.isOpen"
      ref="windowRef"
      class="absolute bg-hacker-gray border border-gray-600 shadow-2xl flex flex-col overflow-hidden"
      :class="{ 
          'inset-0 w-full h-full rounded-none': winState.isMaximized, 
          'rounded-lg': !isMobile && !winState.isMaximized,
          // Mobile Override:
          'top-0 left-0 w-full !h-[calc(100%-3rem)] rounded-none': isMobile
      }"
      :style="!isMobile && !winState.isMaximized ? { 
          width: '800px', 
          height: '600px', 
          top: '5rem', 
          left: '5rem', 
          zIndex: winState.zIndex 
      } : { zIndex: winState.zIndex }"
      @mousedown="store.bringToFront(props.windowId)"
    >
      <div class="window-header h-8 bg-gray-800 flex items-center justify-between px-2 border-b border-gray-600 select-none"
           :class="isMobile ? '' : 'cursor-grab active:cursor-grabbing'">
        <div class="flex items-center gap-2">
          <i :class="[props.icon, 'text-gray-400']"></i>
          <span class="text-xs text-gray-300 font-mono">{{ props.title }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div v-if="!isMobile" class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" @click.stop="store.toggleMaximize(props.windowId)"></div>
          <div class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" @click.stop="store.closeWindow(props.windowId)"></div>
        </div>
      </div>
  
      <div class="flex-1 overflow-hidden bg-hacker-black relative">
        <slot></slot>
      </div>
    </div>
  </template>