<script setup>
import { ref } from 'vue'

const method = ref('GET')
const url = ref('https://jsonplaceholder.typicode.com/posts/1')
const payload = ref('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}')
const responseStatus = ref(null)
const responseData = ref(null)
const isLoading = ref(false)

const sendRequest = async () => {
  if (!url.value) return
  isLoading.value = true
  responseStatus.value = null
  responseData.value = null

  try {
    const options = {
      method: method.value,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    }

    // Only attach body if it's not a GET request
    if (method.value !== 'GET' && method.value !== 'HEAD') {
      try {
        JSON.parse(payload.value) // Validate JSON
        options.body = payload.value
      } catch (e) {
        responseStatus.value = '400 Bad Request'
        responseData.value = 'Invalid JSON in Payload.'
        isLoading.value = false
        return
      }
    }

    const res = await fetch(url.value, options)
    responseStatus.value = `${res.status} ${res.statusText}`
    
    // Check if the response is JSON
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await res.json()
      responseData.value = JSON.stringify(data, null, 2)
    } else {
      const text = await res.text()
      responseData.value = text
    }
  } catch (err) {
    responseStatus.value = 'Network Error'
    responseData.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-full bg-[#1e1e1e] flex flex-col font-mono text-gray-200 overflow-hidden">
    
    <div class="p-4 border-b border-gray-700 bg-[#252526] shrink-0">
      <h2 class="text-xs text-orange-400 font-bold mb-3 uppercase flex items-center gap-2">
        <i class="fa-solid fa-network-wired"></i> HTTP Request
      </h2>
      
      <div class="flex gap-2 mb-3">
        <select v-model="method" class="bg-[#3c3c3c] border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-orange-500 cursor-pointer">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input 
          v-model="url" 
          type="text" 
          class="flex-1 bg-[#3c3c3c] border border-gray-600 rounded px-3 py-1 text-sm text-white outline-none focus:border-orange-500 transition-colors"
          placeholder="https://api.example.com/v1/data"
          @keydown.enter="sendRequest"
        >
        <button 
          @click="sendRequest"
          :disabled="isLoading"
          class="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-4 py-1 rounded text-sm font-bold transition-colors"
        >
          {{ isLoading ? 'SENDING...' : 'SEND' }}
        </button>
      </div>

      <div v-if="method !== 'GET'" class="flex flex-col">
        <span class="text-[10px] text-gray-400 mb-1">JSON Payload:</span>
        <textarea 
          v-model="payload"
          class="w-full h-24 bg-[#1e1e1e] border border-gray-600 rounded p-2 text-xs text-hacker-green font-mono outline-none focus:border-orange-500 resize-none"
        ></textarea>
      </div>
    </div>

    <div class="flex-1 flex flex-col p-4 bg-[#1e1e1e] overflow-hidden">
      <div class="flex justify-between items-center mb-2 shrink-0">
        <span class="text-xs text-blue-400 font-bold uppercase">Response</span>
        <span v-if="responseStatus" class="text-xs font-bold px-2 py-1 rounded" :class="responseStatus.startsWith('2') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'">
          Status: {{ responseStatus }}
        </span>
      </div>
      
      <div class="flex-1 bg-[#1e1e1e] border border-gray-700 rounded overflow-auto custom-scrollbar relative">
        <div v-if="!responseData && !isLoading" class="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
          Hit Send to execute request
        </div>
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center text-orange-400 text-xs animate-pulse">
          Awaiting response...
        </div>
        <pre v-if="responseData" class="p-3 text-sm text-blue-300">{{ responseData }}</pre>
      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4B5563; 
}
</style>