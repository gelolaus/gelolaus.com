<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { supabase } from '@/utils/supabase'
import { useWindowStore } from '@/stores/windowManager'

const store = useWindowStore()
const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)
let subscription = null

// Helper to grab only the first name
const getFirstName = (fullName) => {
  if (!fullName) return 'User'
  return fullName.split(' ')[0]
}

// Auto-scroll to the newest message
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(100) 

  if (!error && data) {
    messages.value = data
    scrollToBottom()
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !store.currentUser) return

  isLoading.value = true
  const msgText = newMessage.value.trim()
  newMessage.value = '' // Clear input instantly

  // We add .select() to get the generated ID back immediately
  const { data, error } = await supabase
    .from('chats')
    .insert([{
      email: store.currentUser.email,
      name: store.currentUser.name,
      message: msgText
    }])
    .select()

  isLoading.value = false

  if (error) {
    store.notify('Error', 'Failed to send message.', 'error')
    newMessage.value = msgText // Restore input if failed
  } else if (data && data.length > 0) {
    // OPTIMISTIC UPDATE: Instantly show your own message
    const exists = messages.value.find(m => m.id === data[0].id)
    if (!exists) {
      messages.value.push(data[0])
      scrollToBottom()
    }
  }
}

onMounted(() => {
  if (store.currentUser) {
    fetchMessages()
    
    // Subscribe to real-time database changes
    subscription = supabase
      .channel('public:chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, payload => {
        
        console.log('Real-time message received:', payload.new) // DEBUGGING
        
        // Only push if it doesn't already exist (prevents duplicates from our optimistic update)
        const exists = messages.value.find(m => m.id === payload.new.id)
        if (!exists) {
          messages.value.push(payload.new)
          scrollToBottom()
        }
      })
      .subscribe((status) => {
        console.log('Supabase Realtime Status:', status) // DEBUGGING
      })
  }
})

onUnmounted(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})
</script>

<template>
  <div class="h-full bg-gray-900 flex flex-col font-sans text-gray-200 overflow-hidden">
    
    <div class="bg-gray-800 p-3 border-b border-gray-700 flex items-center justify-between shadow-sm z-10 shrink-0 select-none">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-comments text-teal-400"></i>
        <span class="font-bold text-sm tracking-wide">GLOBAL_CHAT</span>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="w-2 h-2 rounded-full bg-hacker-green animate-pulse"></span>
        <span class="text-gray-400 font-mono">LIVE</span>
      </div>
    </div>

    <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 relative">
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-10 text-xs font-mono select-none">
        No messages found. Be the first to say hello!
      </div>
      
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        class="flex flex-col w-full animate-fade-in"
      >
        <div 
          class="flex flex-col max-w-[80%]"
          :class="msg.email === store.currentUser?.email ? 'self-end items-end' : 'self-start items-start'"
        >
          <span class="text-[10px] text-gray-500 mb-1 px-1 font-mono select-none">
            {{ msg.email === store.currentUser?.email ? 'You' : getFirstName(msg.name) }}
          </span>
          
          <div 
            class="px-3 py-2 rounded-xl text-sm break-words shadow-sm"
            :class="msg.email === store.currentUser?.email 
              ? 'bg-teal-600 text-white rounded-tr-sm' 
              : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-sm'"
          >
            {{ msg.message }}
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 bg-gray-800 border-t border-gray-700 shrink-0">
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="Broadcast to global channel..." 
          class="flex-1 bg-black/50 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-teal-400 outline-none transition-colors"
          :disabled="isLoading || !store.currentUser"
        >
        <button 
          type="submit"
          :disabled="isLoading || !newMessage.trim() || !store.currentUser" 
          class="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded transition-colors flex items-center justify-center"
        >
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
    
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>