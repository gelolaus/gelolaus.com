<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { supabase } from '../../utils/supabase' // Kept ONLY for real-time listening
import { useWindowStore } from '../../stores/windowManager'

const store = useWindowStore()
const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)
let subscription = null

// --- REST API CONFIGURATION ---
const BACKEND_URL = 'https://gelolaus-be.vercel.app/api/chats'

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
  try {
    const response = await fetch(BACKEND_URL)
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    messages.value = data
    scrollToBottom()
  } catch (error) {
    console.error("REST GET Error:", error)
    store.notify('API Error', 'Could not fetch messages from Nest.js', 'error')
  }
}

// 🟢 RUBRIC CHECK: HTTP POST METHOD
const sendMessage = async () => {
  if (!newMessage.value.trim() || !store.currentUser) return

  isLoading.value = true
  const msgText = newMessage.value.trim()
  newMessage.value = '' // Clear input instantly

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: store.currentUser.email,
        name: store.currentUser.name,
        message: msgText
      })
    })

    if (!response.ok) throw new Error('POST request failed')
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      const exists = messages.value.find(m => m.id === data[0].id)
      if (!exists) {
        messages.value.push(data[0])
        scrollToBottom()
      }
    }
  } catch (error) {
    store.notify('Error', 'Failed to send message via REST API.', 'error')
    newMessage.value = msgText // Restore input if failed
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (store.currentUser) {
    // Initial data fetch now uses our REST API instead of Supabase SDK
    fetchMessages()
    
    // Real-time listener remains for snappiness, but doesn't handle the initial load
    subscription = supabase
      .channel('public:chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, payload => {
        const exists = messages.value.find(m => m.id === payload.new.id)
        if (!exists) {
          messages.value.push(payload.new)
          scrollToBottom()
        }
      })
      .subscribe()
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
        <i class="fa-solid fa-server text-teal-400"></i>
        <span class="font-bold text-sm tracking-wide">REST_API_CHAT</span>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
        <span class="text-gray-400 font-mono">NEST.JS LIVE</span>
      </div>
    </div>

    <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 relative">
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-10 text-xs font-mono select-none">
        No messages found. Connecting to Nest.js backend...
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
          placeholder="Send via REST POST..." 
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