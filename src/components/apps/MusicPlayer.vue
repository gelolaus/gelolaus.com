<script setup>
import { ref, computed } from 'vue'
import { useWindowStore } from '@/stores/windowManager'

const store = useWindowStore()

// Default to the Lofi stream
const currentVideoId = ref('jfKfPfyJRdk')
const customUrl = ref('')

// The pre-defined playlist
const playlist = [
  { title: 'Endless Lofi Radio', id: 'jfKfPfyJRdk' },
  { title: "You'll Be in My Heart - NIKI", id: 'Bl0Gtp5FMd4' },
  { title: 'Pure Imagination - Timothée Chalamet', id: 'b4wHnf9VTRk' },
  { title: 'Breaking Free - High School Musical', id: 'y1ygm_1fUuk' },
  { title: 'Happiness - Rex Orange County', id: 'dstuitW8PWM' },
  { title: 'The Most Beautiful Thing - Bruno Major', id: '1nml-_YE2OU' }
]

// Function to extract the 11-character YouTube video ID from various link formats
const extractYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

const playCustom = () => {
  const id = extractYouTubeId(customUrl.value)
  if (id) {
    currentVideoId.value = id
    customUrl.value = '' // Clear input after successful load
  } else {
    store.notify('Error', 'Invalid YouTube URL detected.', 'error')
  }
}

const playTrack = (id) => {
  currentVideoId.value = id
}

// Compute the current playing title for the UI
const currentTrackTitle = computed(() => {
  const track = playlist.find(t => t.id === currentVideoId.value)
  return track ? track.title : 'Custom Transmission'
})
</script>

<template>
  <div class="h-full bg-gray-900 flex flex-col font-mono text-gray-200 select-none overflow-hidden">
    <div class="bg-gray-800 p-2 border-b border-gray-700 flex justify-between items-center text-xs">
      <span class="text-purple-400 font-bold flex items-center gap-2">
        <i class="fa-solid fa-compact-disc animate-spin-slow"></i> media_player.exe
      </span>
      <div class="flex gap-1 items-center text-[10px]">
        <span class="w-2 h-2 rounded-full bg-hacker-green animate-pulse"></span>
        <span class="text-gray-500">PLAYING</span>
      </div>
    </div>
    
    <div class="bg-black p-2 relative" style="height: 50%;">
      <div class="w-full h-full border border-gray-800 rounded overflow-hidden">
        <iframe 
          class="w-full h-full pointer-events-auto"
          :src="`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=0&controls=1&modestbranding=1`" 
          title="Media Player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    </div>
    
    <div class="flex-1 flex flex-col p-2 gap-2 overflow-y-auto bg-gray-900/50">
      
      <div class="bg-gray-800 border border-gray-700 p-2 rounded text-xs flex items-center justify-between">
        <div class="truncate text-hacker-green font-bold">
          <i class="fa-solid fa-volume-high mr-2 text-gray-400"></i>
          {{ currentTrackTitle }}
        </div>
      </div>

      <div class="flex gap-2">
        <input 
          v-model="customUrl" 
          @keydown.enter="playCustom"
          type="text" 
          placeholder="Paste YouTube URL..." 
          class="flex-1 bg-black/50 border border-gray-700 rounded px-2 py-1 text-xs outline-none focus:border-purple-400 placeholder-gray-600"
        >
        <button 
          @click="playCustom"
          class="bg-purple-600 hover:bg-purple-500 text-white px-3 rounded text-xs transition-colors font-bold"
        >
          LOAD
        </button>
      </div>

      <div class="mt-2 flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        <div class="text-[10px] text-gray-500 font-bold mb-1 border-b border-gray-800 pb-1">DATABASE_PLAYLIST</div>
        
        <button 
          v-for="track in playlist" 
          :key="track.id"
          @click="playTrack(track.id)"
          class="w-full text-left p-2 text-xs rounded border border-transparent transition-all truncate"
          :class="currentVideoId === track.id ? 'bg-purple-900/40 border-purple-500/50 text-purple-300' : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'"
        >
          <i class="fa-solid fa-play mr-2 text-[10px]" :class="currentVideoId === track.id ? 'text-purple-400' : 'text-gray-600'"></i> 
          {{ track.title }}
        </button>
      </div>
    </div>
    
    <div class="bg-black px-3 py-1 text-[10px] text-gray-600 border-t border-gray-800 flex justify-between shrink-0">
      <span>ID: {{ currentVideoId }}</span>
      <span class="text-purple-400">AUDIO_SUBSYSTEM_ONLINE</span>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}

/* Custom scrollbar to fit the theme */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563; 
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280; 
}
</style>