<script setup>
    import { useWindowStore } from '@/stores/windowManager'
    
    // Get the store so we can see the list of notifications
    const store = useWindowStore()
    
    // Helper to get the right icon based on the message type
    const getIcon = (type) => {
      if (type === 'success') return 'fa-solid fa-check-circle'
      if (type === 'error') return 'fa-solid fa-circle-exclamation'
      return 'fa-solid fa-circle-info' // default to info icon
    }
    
    // Helper to get the right color for the border and icon
    const getColor = (type) => {
      if (type === 'success') return 'text-green-500 border-green-500'
      if (type === 'error') return 'text-red-500 border-red-500'
      return 'text-blue-400 border-blue-400'
    }
    </script>
    
    <template>
      <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        
        <TransitionGroup name="toast">
          <div 
            v-for="note in store.notifications" 
            :key="note.id"
            class="bg-gray-900 border-l-4 p-4 rounded shadow-2xl min-w-[300px] pointer-events-auto flex items-start gap-3"
            :class="getColor(note.type)"
          >
            <i :class="[getIcon(note.type), 'mt-1 text-lg']"></i>
            
            <div>
              <h4 class="font-bold text-gray-200 text-sm font-mono">{{ note.title }}</h4>
              <p class="text-gray-400 text-xs font-sans mt-1">{{ note.message }}</p>
            </div>
          </div>
        </TransitionGroup>
    
      </div>
    </template>
    
    <style scoped>
    /* Animations for the toasts sliding in/out */
    .toast-enter-active,
    .toast-leave-active {
      transition: all 0.3s ease;
    }
    
    .toast-enter-from,
    .toast-leave-to {
      opacity: 0;
      transform: translateX(30px); /* Slide from right */
    }
    </style>