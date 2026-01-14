<script setup>
  import { ref, onMounted, computed, nextTick, watch } from 'vue'
  import interact from 'interactjs'
  import gsap from 'gsap'
  import { useWindowStore } from '@/stores/windowManager'
  import { useBreakpoints } from '@/composables/useBreakpoints'
  
  const props = defineProps(['windowId', 'title', 'icon'])
  const store = useWindowStore()
  const { isMobile } = useBreakpoints()
  const windowRef = ref(null)
  
  const winState = computed(() => store.windows[props.windowId])
  
  const onEnter = (el, done) => {
    gsap.fromTo(el, 
      { scale: 0.8, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)", onComplete: done }
    )
  }
  
  const onLeave = (el, done) => {
    gsap.to(el, 
      { scale: 0.9, opacity: 0, y: 30, duration: 0.2, ease: "power2.in", onComplete: done }
    )
  }
  
  const initInteract = (el) => {
    interact(el).draggable({
      allowFrom: '.window-header', 
      modifiers: [
        interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true })
      ],
      listeners: {
        move(event) {
          if (isMobile.value || winState.value.isMaximized) return
  
          const currentX = winState.value.position.x
          const currentY = winState.value.position.y
          
          const newX = currentX + event.dx
          const newY = currentY + event.dy
  
          store.updatePosition(props.windowId, { x: newX, y: newY })
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
              if (isMobile.value || winState.value.isMaximized) return
  
              const newWidth = event.rect.width
              const newHeight = event.rect.height
              
              const currentX = winState.value.position.x
              const currentY = winState.value.position.y
              
              const newX = currentX + event.deltaRect.left
              const newY = currentY + event.deltaRect.top
  
              store.updateSize(props.windowId, { width: newWidth, height: newHeight })
              store.updatePosition(props.windowId, { x: newX, y: newY })
          }
      }
    })
  }
  
  const windowStyle = computed(() => {
      if (isMobile.value) {
          return {
              top: '0px', left: '0px', width: '100%', height: 'calc(100% - 3rem)',
              zIndex: winState.value.zIndex, position: 'absolute', borderRadius: '0'
          }
      }
  
      if (winState.value.isMaximized) {
          return {
              top: '0px', left: '0px', width: '100%', height: '100%',
              zIndex: winState.value.zIndex, position: 'absolute', borderRadius: '0'
          }
      }
  
      return {
          width: `${winState.value.size.width}px`,
          height: `${winState.value.size.height}px`,
          left: `${winState.value.position.x}px`,
          top: `${winState.value.position.y}px`,
          zIndex: winState.value.zIndex,
          position: 'absolute'
      }
  })
  
  onMounted(() => {
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
  })
  </script>
  
  <template>
    <Transition 
      @enter="onEnter" 
      @leave="onLeave" 
      :css="false"
    >
        <div 
        v-if="winState.isOpen"
        v-show="!winState.isMinimized"
        ref="windowRef"
        class="bg-hacker-gray border border-gray-600 shadow-2xl flex flex-col overflow-hidden"
        :class="{ 'rounded-lg': !isMobile && !winState.isMaximized }"
        :style="windowStyle"
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
            <div class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" @click.stop="store.minimizeWindow(props.windowId)"></div>
            <div class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" @click.stop="store.closeWindow(props.windowId)"></div>
            </div>
        </div>
    
        <div class="flex-1 overflow-hidden bg-hacker-black relative">
            <slot></slot>
        </div>
        </div>
    </Transition>
  </template>