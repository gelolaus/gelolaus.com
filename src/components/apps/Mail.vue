<script setup>
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useWindowStore } from '@/stores/windowManager'

const store = useWindowStore()

// --- STATE MANAGEMENT ---
// Views: 'login' | 'register' | 'inbox' | 'compose' | 'read'
const currentView = ref('login')
const isLoading = ref(false)

// --- DATA ---
const currentUser = ref({ email: '', name: '', pin: '', storedPin: '' })
const inputPin = ref('')
const messages = ref([])
const selectedMessage = ref(null)

// Form for composing
const composeForm = ref({ message: '' })

// --- ACTIONS: AUTH ---

const checkEmail = async () => {
  if (!currentUser.value.email.includes('@')) {
    store.notify('Error', 'Invalid Email Address', 'error')
    return
  }
  
  isLoading.value = true
  
  // Check if user exists in Supabase
  const { data, error } = await supabase
    .from('mail_users')
    .select('*')
    .eq('email', currentUser.value.email)
    .single()

  isLoading.value = false

  if (data) {
    // User found, ask for PIN
    currentUser.value.name = data.name
    // Store the real PIN temporarily to check against input
    currentUser.value.storedPin = data.pin 
    store.notify('Identity Found', 'Please enter your access code.', 'info')
  } else {
    // User not found, go to register
    currentView.value = 'register'
    store.notify('New User', 'Setup your secure access code.', 'info')
  }
}

const login = () => {
  if (inputPin.value === currentUser.value.storedPin) {
    store.notify('Access Granted', `Welcome back, ${currentUser.value.name}`, 'success')
    fetchMessages()
  } else {
    store.notify('Access Denied', 'Incorrect PIN code.', 'error')
    inputPin.value = ''
  }
}

const register = async () => {
  if (currentUser.value.pin.length !== 4) {
    store.notify('Error', 'PIN must be 4 digits.', 'error')
    return
  }
  if (!currentUser.value.name) {
    store.notify('Error', 'Please enter a display name.', 'error')
    return
  }

  isLoading.value = true

  // Create user in DB
  const { error } = await supabase
    .from('mail_users')
    .insert([{
      email: currentUser.value.email,
      name: currentUser.value.name,
      pin: currentUser.value.pin
    }])

  isLoading.value = false

  if (error) {
    console.error(error)
    store.notify('Error', 'Could not create account.', 'error')
  } else {
    store.notify('Success', 'Account established.', 'success')
    fetchMessages()
  }
}

// --- ACTIONS: MESSAGING ---

const fetchMessages = async () => {
  isLoading.value = true
  currentView.value = 'inbox'
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('email', currentUser.value.email)
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
      email: currentUser.value.email,
      name: currentUser.value.name,
      message: composeForm.value.message
    }])

  isLoading.value = false

  if (error) {
    store.notify('Error', 'Transmission failed.', 'error')
  } else {
    store.notify('Sent', 'Message uploaded to server.', 'success')
    composeForm.value = { message: '' }
    fetchMessages() // Go back to inbox
  }
}

// --- HELPERS ---
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const logout = () => {
  currentUser.value = { email: '', name: '', pin: '', storedPin: '' }
  inputPin.value = ''
  messages.value = []
  currentView.value = 'login'
}
</script>

<template>
  <div class="h-full bg-gray-900 flex flex-col font-mono text-gray-200 select-none overflow-hidden">
    
    <div class="bg-gray-800 p-2 border-b border-gray-700 flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-envelope text-blue-400"></i>
        <span class="font-bold tracking-wider">Gelo's Secure-ish Mail Client</span>
      </div>
      <button v-if="currentView !== 'login' && currentView !== 'register'" @click="logout" class="text-red-400 hover:text-white transition-colors">
        <i class="fa-solid fa-power-off"></i> LOGOUT
      </button>
    </div>

    <div v-if="currentView === 'login'" class="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
      <div class="text-center">
        <i class="fa-solid fa-user-shield text-5xl text-gray-600 mb-4"></i>
        <h2 class="text-xl font-bold text-hacker-green">IDENTITY VERIFICATION</h2>
        <p class="text-gray-500 text-xs mt-2">Enter credentials to access encrypted network.</p>
      </div>

      <div class="w-full max-w-xs space-y-4">
        <div v-if="!currentUser.name" class="space-y-2">
          <label class="text-xs text-blue-400">USER_ID (EMAIL)</label>
          <div class="flex gap-2">
            <input 
              v-model="currentUser.email" 
              @keydown.enter="checkEmail"
              type="email" 
              class="flex-1 bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-hacker-green outline-none"
              placeholder="e.g. hello@gelolaus.com"
            >
            <button @click="checkEmail" :disabled="isLoading" class="bg-blue-600 hover:bg-blue-500 px-3 rounded text-white transition-colors">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div v-else class="space-y-2 animate-fade-in">
          <div class="text-xs text-gray-400 mb-2 text-center border-b border-gray-700 pb-2">ID: {{ currentUser.email }}</div>
          <label class="text-xs text-blue-400">ACCESS CODE (PIN)</label>
          <div class="flex gap-2">
            <input 
              v-model="inputPin" 
              @keydown.enter="login"
              type="password" 
              maxlength="4"
              class="flex-1 bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-hacker-green outline-none tracking-widest text-center"
              placeholder="••••"
            >
            <button @click="login" class="bg-hacker-green text-black font-bold px-3 rounded hover:bg-green-400 transition-colors">
              UNLOCK
            </button>
          </div>
          <button @click="currentUser.name = ''" class="text-xs text-gray-500 hover:text-white underline w-full text-center mt-2">Change User</button>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'register'" class="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
       <div class="text-center">
        <i class="fa-solid fa-user-plus text-5xl text-gray-600 mb-4"></i>
        <h2 class="text-xl font-bold text-blue-400">NEW USER REGISTRATION</h2>
      </div>

      <div class="w-full max-w-xs space-y-4">
        <div class="text-xs text-gray-500 text-center border-b border-gray-700 pb-2">{{ currentUser.email }}</div>
        
        <div class="space-y-1">
          <label class="text-xs text-gray-400">DISPLAY NAME</label>
          <input v-model="currentUser.name" type="text" class="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 outline-none focus:border-blue-400 text-white">
        </div>

        <div class="space-y-1">
          <label class="text-xs text-gray-400">SET 4-DIGIT PIN</label>
          <input v-model="currentUser.pin" type="text" maxlength="4" class="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 outline-none focus:border-blue-400 tracking-widest text-center text-white">
        </div>

        <button @click="register" :disabled="isLoading" class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded text-white font-bold mt-2 transition-colors">
          CREATE IDENTITY
        </button>
         <button @click="currentView = 'login'; currentUser.name = ''" class="w-full text-xs text-gray-500 mt-2 hover:text-white">Cancel</button>
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