<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../utils/supabase'
import { useWindowStore } from '../../stores/windowManager'

const store = useWindowStore()

// --- STATE MANAGEMENT ---
const currentView = ref('inbox')
const isLoading = ref(false)
const messages = ref([])
const selectedMessage = ref(null)
const composeForm = ref({ message: '' })

// Automatically fetch messages on mount since we are already logged in
onMounted(() => {
  if (store.currentUser) {
    fetchMessages()
  }
})

const fetchMessages = async () => {
  isLoading.value = true
  currentView.value = 'inbox'
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('email', store.currentUser.email) // Pulling from Global OS State
    .order('created_at', { ascending: false })

  if (error) {
    store.notify('Error', 'Failed to retrieve logs.', 'error')
  } else {
    messages.value = data
  }
  isLoading.value = false
}

const openMessage = (msg) => {
  selectedMessage.value = msg
  currentView.value = 'read'
}

const sendMessage = async () => {
  if (!composeForm.value.message) return

  isLoading.value = true
  
  const { error } = await supabase
    .from('messages')
    .insert([{
      email: store.currentUser.email,
      name: store.currentUser.name,
      message: composeForm.value.message
    }])

  isLoading.value = false

  if (error) {
    store.notify('Error', 'Transmission failed.', 'error')
  } else {
    store.notify('Sent', 'Message uploaded to server.', 'success')
    composeForm.value = { message: '' }
    fetchMessages() 
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="h-full bg-gray-900 flex flex-col font-mono text-gray-200 select-none overflow-hidden">
    
    <div class="bg-gray-800 p-2 border-b border-gray-700 flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-envelope text-blue-400"></i>
        <span class="font-bold tracking-wider">Gelo's Secure-ish Mail Client</span>
      </div>
      </div>

    <div v-if="currentView === 'inbox'" class="flex-1 flex flex-col">
      <div class="p-2 bg-gray-800/50 flex justify-between items-center border-b border-gray-700">
        <h3 class="text-sm font-bold text-gray-300">INBOX_LOGS</h3>
        <button @click="currentView = 'compose'" class="bg-hacker-green text-black text-xs font-bold px-3 py-1 rounded hover:bg-green-400 transition-colors">
          <i class="fa-solid fa-plus mr-1"></i> NEW MESSAGE
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        <div v-if="messages.length === 0" class="text-center text-gray-600 mt-10">
          <i class="fa-regular fa-folder-open text-3xl mb-2"></i>
          <p class="text-xs">NO TRANSMISSIONS FOUND</p>
        </div>

        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          @click="openMessage(msg)"
          class="p-3 rounded cursor-pointer border border-gray-700 hover:bg-white/5 transition-colors group relative"
          :class="msg.reply ? 'border-l-4 border-l-hacker-green' : 'border-l-4 border-l-gray-600'"
        >
          <div class="flex justify-between items-start">
            <span class="font-bold text-sm text-blue-300 truncate w-2/3">{{ msg.message }}</span>
            <span class="text-[10px] text-gray-500">{{ formatDate(msg.created_at) }}</span>
          </div>
          <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-500">To: @gelolaus</span>
            <span v-if="msg.reply" class="text-[10px] bg-hacker-green text-black px-1 rounded font-bold">REPLIED</span>
            <span v-else class="text-[10px] text-gray-600">SENT</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'read'" class="flex-1 flex flex-col p-4 overflow-y-auto">
      <button @click="currentView = 'inbox'" class="self-start text-xs text-gray-400 hover:text-white mb-4 transition-colors">
        <i class="fa-solid fa-arrow-left"></i> BACK TO LOGS
      </button>

      <div class="bg-black/30 p-4 rounded border border-gray-700 mb-6">
        <div class="text-xs text-gray-500 mb-1">SENT TRANSMISSION</div>
        <p class="text-gray-300 whitespace-pre-wrap font-sans">{{ selectedMessage.message }}</p>
        <div class="text-[10px] text-gray-600 mt-2 text-right">{{ formatDate(selectedMessage.created_at) }}</div>
      </div>

      <div v-if="selectedMessage.reply" class="bg-blue-900/20 p-4 rounded border border-blue-500/30 ml-4 animate-fade-in">
        <div class="flex items-center gap-2 mb-2 border-b border-blue-500/20 pb-2">
          <i class="fa-solid fa-user-astronaut text-blue-400"></i>
          <span class="text-xs font-bold text-blue-400">GELO'S REPLY</span>
        </div>
        <p class="text-gray-200 whitespace-pre-wrap font-sans">{{ selectedMessage.reply }}</p>
      </div>

      <div v-else class="text-center text-gray-600 text-xs mt-4 italic">
        -- Awaiting response from @gelolaus --
      </div>
    </div>

    <div v-if="currentView === 'compose'" class="flex-1 flex flex-col p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-hacker-green font-bold">NEW_TRANSMISSION</h3>
        <button @click="currentView = 'inbox'" class="text-xs text-gray-500 hover:text-white">CANCEL</button>
      </div>

      <div class="bg-black/40 border border-gray-700 rounded flex-1 flex flex-col overflow-hidden">
        <div class="border-b border-gray-700 p-2 flex gap-2 items-center text-sm">
           <span class="text-gray-500 w-12 text-right">To:</span>
           <span class="text-blue-300">hello@gelolaus.com</span>
        </div>
        <textarea 
          v-model="composeForm.message" 
          class="flex-1 bg-transparent p-4 outline-none text-gray-300 resize-none font-sans placeholder-gray-600"
          placeholder="Type your message..."
        ></textarea>
        <div class="bg-gray-800 p-2 text-right">
          <button @click="sendMessage" :disabled="isLoading" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded text-sm font-bold transition-colors">
            <i class="fa-solid fa-paper-plane mr-2"></i> SEND
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>