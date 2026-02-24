<script setup>
import { ref } from 'vue'
import { supabase } from '../../utils/supabase'
import { useWindowStore } from '../../stores/windowManager'

const emit = defineEmits(['success'])
const store = useWindowStore()

const currentView = ref('login')
const isLoading = ref(false)

const authData = ref({ email: '', name: '', pin: '', storedPin: '' })
const inputPin = ref('')

const checkEmail = async () => {
  if (!authData.value.email.includes('@')) {
    store.notify('Error', 'Invalid Email Address', 'error')
    return
  }
  isLoading.value = true
  
  const { data, error } = await supabase
    .from('mail_users')
    .select('*')
    .eq('email', authData.value.email)
    .single()

  isLoading.value = false

  if (data) {
    authData.value.name = data.name
    authData.value.storedPin = data.pin 
    store.notify('Identity Found', 'Please enter your access code.', 'info')
  } else {
    currentView.value = 'register'
    store.notify('New User', 'Setup your secure access code.', 'info')
  }
}

const login = () => {
  if (inputPin.value === authData.value.storedPin) {
    // Save to global OS store
    store.currentUser = { email: authData.value.email, name: authData.value.name }
    emit('success')
  } else {
    store.notify('Access Denied', 'Incorrect PIN code.', 'error')
    inputPin.value = ''
  }
}

const register = async () => {
  if (authData.value.pin.length !== 4) {
    store.notify('Error', 'PIN must be 4 digits.', 'error')
    return
  }
  if (!authData.value.name) {
    store.notify('Error', 'Please enter a display name.', 'error')
    return
  }

  isLoading.value = true

  const { error } = await supabase
    .from('mail_users')
    .insert([{
      email: authData.value.email,
      name: authData.value.name,
      pin: authData.value.pin
    }])

  isLoading.value = false

  if (error) {
    store.notify('Error', 'Could not create account.', 'error')
  } else {
    store.currentUser = { email: authData.value.email, name: authData.value.name }
    emit('success')
  }
}
</script>

<template>
  <div class="absolute inset-0 z-50 bg-hacker-black flex items-center justify-center font-mono select-none">
    
    <div class="w-full max-w-md p-8 bg-gray-900 border border-gray-700 shadow-2xl rounded relative z-10">
      
      <div v-if="currentView === 'login'" class="flex flex-col items-center space-y-6">
        <div class="text-center">
          <i class="fa-solid fa-user-shield text-5xl text-gray-600 mb-4"></i>
          <h2 class="text-2xl font-bold text-hacker-green">GelOS LOGIN</h2>
          <p class="text-gray-500 text-xs mt-2">Enter credentials to access desktop.</p>
          <p class="text-gray-500 text-[10px] mt-1">New users: there&apos;s no separate registration screen — just enter your email to get started.</p>
        </div>

        <div class="w-full space-y-4">
          <div v-if="!authData.name" class="space-y-2">
            <label class="text-xs text-blue-400">USER_ID (EMAIL)</label>
            <div class="flex gap-2">
              <input 
                v-model="authData.email" 
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
            <div class="text-xs text-gray-400 mb-2 text-center border-b border-gray-700 pb-2">ID: {{ authData.email }}</div>
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
                LOGIN
              </button>
            </div>
            <button @click="authData.name = ''" class="text-xs text-gray-500 hover:text-white underline w-full text-center mt-2">Change User</button>
          </div>
        </div>
      </div>

      <div v-if="currentView === 'register'" class="flex flex-col items-center space-y-6">
        <div class="text-center">
          <i class="fa-solid fa-user-plus text-5xl text-gray-600 mb-4"></i>
          <h2 class="text-xl font-bold text-blue-400">NEW USER SETUP</h2>
        </div>

        <div class="w-full space-y-4">
          <div class="text-xs text-gray-500 text-center border-b border-gray-700 pb-2">{{ authData.email }}</div>
          
          <div class="space-y-1">
            <label class="text-xs text-gray-400">DISPLAY NAME</label>
            <input v-model="authData.name" type="text" class="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 outline-none focus:border-blue-400 text-white">
          </div>

          <div class="space-y-1">
            <label class="text-xs text-gray-400">SET 4-DIGIT PIN</label>
            <input v-model="authData.pin" type="text" maxlength="4" class="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 outline-none focus:border-blue-400 tracking-widest text-center text-white">
          </div>

          <button @click="register" :disabled="isLoading" class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded text-white font-bold mt-2 transition-colors">
            CREATE ACCOUNT
          </button>
          <button @click="currentView = 'login'; authData.name = ''" class="w-full text-xs text-gray-500 mt-2 hover:text-white">Cancel</button>
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