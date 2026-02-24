<script setup>
import { ref, watch, onMounted } from 'vue'

// This holds the text
const content = ref('')

// When the app opens, check if we have saved notes and load them
onMounted(() => {
  const savedNotes = localStorage.getItem('gelos-notepad')
  if (savedNotes) {
    content.value = savedNotes
  }
})

// Watch for ANY changes to the text area. 
// If the user types a letter, instantly save it.
watch(content, (newVal) => {
  localStorage.setItem('gelos-notepad', newVal)
})

const clearNotes = () => {
  if (confirm('Are you sure you want to clear your notes?')) {
    content.value = ''
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-900 font-mono text-gray-200 select-none">
    
    <div class="bg-gray-800 p-2 border-b border-gray-700 flex justify-between items-center text-xs">
      <span class="text-yellow-500 font-bold flex items-center gap-2">
        <i class="fa-solid fa-file-lines"></i> local_notes.txt
      </span>
      <button @click="clearNotes" class="text-gray-400 hover:text-red-400 transition-colors">
        <i class="fa-solid fa-eraser"></i> Clear
      </button>
    </div>
    
    <textarea 
      v-model="content" 
      class="flex-1 bg-transparent p-4 outline-none resize-none text-yellow-400 text-sm leading-relaxed placeholder-gray-700"
      placeholder="Type your notes here... Auto-saving enabled."
      spellcheck="false"
    ></textarea>
    
    <div class="bg-black px-3 py-1 text-[10px] text-gray-600 border-t border-gray-800 flex justify-between">
      <span>CHARS: {{ content.length }}</span>
      <span v-if="content.length > 0" class="text-hacker-green">SAVED TO DISK</span>
      <span v-else>READY</span>
    </div>

  </div>
</template>

<style scoped>
/* Custom scrollbar for the textarea to match the hacker theme */
textarea::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-track {
  background: #111827; 
}
textarea::-webkit-scrollbar-thumb {
  background: #374151; 
  border-radius: 4px;
}
textarea::-webkit-scrollbar-thumb:hover {
  background: #4b5563; 
}
</style>