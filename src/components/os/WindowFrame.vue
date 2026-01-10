<script setup>
  import { onMounted, ref, computed, watch, nextTick } from 'vue'
  import interact from 'interactjs'
  import { useWindowStore } from '@/stores/windowManager'
  
  const props = defineProps(['windowId', 'title', 'icon'])
  const store = useWindowStore()
  const windowRef = ref(null)
  
  // Access the state for this specific window
  const winState = computed(() => store.windows[props.windowId])
  
  // Function to initialize Drag & Drop (Only called when element exists)
  const initInteract = (el) => {
    interact(el).draggable({
      allowFrom: '.window-header', // Only drag from the top bar
      modifiers: [
        interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true })
      ],
      listeners: {
        move(event) {
          if(winState.value.isMaximized) return; // Don't move if maximized
          
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
      listeners: {
          move(event) {
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
    // Watch for when the window actually opens
    watch(
      () => winState.value.isOpen,
      async (isOpen) => {
        if (isOpen) {
          // Wait for Vue to actually render the <div>
          await nextTick()
          
          // Now it's safe to grab the element
          const el = windowRef.value
          if (el) {
            initInteract(el)
          }
        }
      },
      { immediate: true } // Run check immediately in case it's already open
    )
  })
</script>
  
<template>
  <div 
    v-if="winState.isOpen"
    ref="windowRef"
    class="absolute bg-hacker-gray border border-gray-600 shadow-2xl rounded-lg flex flex-col overflow-hidden"
    :class="{ 'inset-0 w-full h-full rounded-none': winState.isMaximized, 'w-[800px] h-[600px] top-20 left-20': !winState.isMaximized }"
    :style="{ zIndex: winState.zIndex }"
    @mousedown="store.bringToFront(props.windowId)"
  >
    <div class="window-header h-8 bg-gray-800 flex items-center justify-between px-2 border-b border-gray-600 select-none cursor-grab active:cursor-grabbing">
      <div class="flex items-center gap-2">
        <i :class="[props.icon, 'text-gray-400']"></i>
        <span class="text-xs text-gray-300 font-mono">{{ props.title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" @click.stop="store.toggleMaximize(props.windowId)"></div>
        <div class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" @click.stop="store.closeWindow(props.windowId)"></div>
      </div>
    </div>

    <div class="flex-1 overflow-hidden bg-hacker-black relative">
      <slot></slot>
    </div>
  </div>
</template>