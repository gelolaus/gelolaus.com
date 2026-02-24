import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Example store - shows how to use Pinia for state management
// (Not actually used in the app, just here as a template)
export const useCounterStore = defineStore('counter', () => {
  // Create a reactive counter
  const count = ref(0)
  
  // Computed value that's always double the count
  const doubleCount = computed(() => count.value * 2)
  
  // Function to increase the count
  function increment() {
    count.value++
  }

  // Export everything so components can use it
  return { count, doubleCount, increment }
})
