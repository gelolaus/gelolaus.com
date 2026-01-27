<script setup>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useWindowStore } from '@/stores/windowManager'

const store = useWindowStore()

const form = ref({
  name: '',
  email: '',
  message: ''
})

const isSending = ref(false)

const sendMessage = async () => {
  if (!form.value.message || !form.value.email) {
    store.notify('Error', 'Please fill in all fields.', 'error')
    return
  }

  isSending.value = true

  // Send data to Supabase 'messages' table
  const { error } = await supabase
    .from('messages')
    .insert([
      { 
        name: form.value.name, 
        email: form.value.email, 
        message: form.value.message 
      }
    ])

  isSending.value = false

  if (error) {
    console.error('Supabase Error:', error)
    store.notify('Transmission Failed', 'Could not connect to server.', 'error')
  } else {
    store.notify('Success', 'Message sent to server.', 'success')
    // Clear form
    form.value = { name: '', email: '', message: '' }
    // Optional: Close window automatically
    setTimeout(() => store.closeWindow('mail'), 1500)
  }
}
</script>

<template>
  <div class="h-full bg-gray-900 flex flex-col font-sans text-gray-200">
    <div class="bg-gray-800 p-2 border-b border-gray-700 flex items-center gap-4 text-xs">
      <button 
        @click="sendMessage" 
        :disabled="isSending"
        class="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50"
      >
        <i class="fa-solid fa-paper-plane"></i>
        {{ isSending ? 'Sending...' : 'Send' }}
      </button>
      <button class="text-gray-400 hover:text-white transition-colors" @click="form = { name: '', email: '', message: '' }">
        <i class="fa-solid fa-trash"></i> Discard
      </button>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
      
      <div class="grid grid-cols-[60px_1fr] gap-2 items-center text-sm border-b border-gray-700 pb-2">
        <span class="text-gray-500 text-right">To:</span>
        <div class="bg-gray-800/50 px-2 py-1 rounded text-hacker-green font-mono">hello@gelolaus.com</div>
      </div>

      <div class="grid grid-cols-[60px_1fr] gap-2 items-center text-sm border-b border-gray-700 pb-2">
        <span class="text-gray-500 text-right">From:</span>
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="your@email.com"
          class="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
        >
      </div>

      <div class="grid grid-cols-[60px_1fr] gap-2 items-center text-sm border-b border-gray-700 pb-2">
        <span class="text-gray-500 text-right">Name:</span>
        <input 
          v-model="form.name" 
          type="text" 
          placeholder="Your Name"
          class="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
        >
      </div>

      <textarea 
        v-model="form.message" 
        class="flex-1 bg-transparent border-none outline-none text-gray-200 resize-none font-mono text-sm p-2 leading-relaxed placeholder-gray-700"
        placeholder="Type your message here..."
      ></textarea>
    </div>
    
    <div class="h-6 bg-gray-800 border-t border-gray-700 flex items-center px-3 text-[10px] text-gray-500 justify-between">
      <span>SECURE CONNECTION ESTABLISHED</span>
      <span v-if="isSending" class="text-hacker-green animate-pulse">TRANSMITTING DATA...</span>
    </div>
  </div>
</template>