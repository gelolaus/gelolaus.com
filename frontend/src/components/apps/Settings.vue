<script setup>
    import { useWindowStore } from '../../stores/windowManager'
    
    const store = useWindowStore()
    
    const toggleSetting = (setting) => {
      if (setting === 'crt') {
        store.toggleCRT()
      } else if (setting === 'sound') {
        store.toggleSound()
      }
    }

    const handleFileUpload = (e) => {
      const file = e.target.files[0]
      if (!file) return

      // Limit to 2MB to keep localStorage safe
      if (file.size > 2 * 1024 * 1024) {
        store.notify('Error', 'Image too large. Keep it under 2MB.', 'error')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        store.setWallpaper(event.target.result)
        store.notify('Success', 'Wallpaper updated.', 'success')
      }
      reader.readAsDataURL(file)
    }
</script>
    
<template>
  <div class="h-full bg-gray-900 text-gray-200 p-6 font-mono overflow-y-auto select-none">
    
    <h1 class="text-2xl font-bold text-hacker-green mb-6 border-b border-gray-700 pb-2">
      <i class="fa-solid fa-gears mr-2"></i>System Settings
    </h1>

    <div class="mb-8">
      <h2 class="text-xl text-purple-400 mb-4 font-bold flex items-center gap-2">
        <i class="fa-solid fa-palette"></i> Personalization
      </h2>
      
      <div class="bg-white/5 p-4 rounded border border-gray-800">
        <div class="flex flex-col gap-4">
          <div>
            <div class="font-bold text-gray-300 text-sm mb-1">Desktop Wallpaper</div>
            <div class="text-[10px] text-gray-500 mb-3">Upload a custom background (Max 2MB)</div>
          </div>

          <div class="flex gap-2">
            <label class="flex-1">
              <div class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded cursor-pointer text-center transition-colors">
                <i class="fa-solid fa-upload mr-2"></i> UPLOAD IMAGE
              </div>
              <input type="file" class="hidden" accept="image/*" @change="handleFileUpload">
            </label>

            <button 
              v-if="store.wallpaper"
              @click="store.removeWallpaper"
              class="bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs font-bold py-2 px-4 rounded border border-red-500/30 transition-colors"
            >
              <i class="fa-solid fa-trash-can mr-2"></i> REMOVE
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl text-blue-400 mb-4 font-bold flex items-center gap-2">
        <i class="fa-solid fa-eye"></i> Display & Visuals
      </h2>

      <div 
        @click="toggleSetting('crt')"
        class="flex items-center justify-between bg-white/5 p-4 rounded cursor-pointer hover:bg-white/10 transition-colors"
      >
        <div>
          <div class="font-bold text-gray-300">CRT Scanlines</div>
          <div class="text-xs text-gray-400">Retro monitor flicker effect</div>
        </div>
        
        <div 
          class="w-12 h-6 rounded-full transition-colors relative"
          :class="store.isCRTActive ? 'bg-hacker-green' : 'bg-gray-600'"
        >
          <div 
            class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
            :class="store.isCRTActive ? 'left-7' : 'left-1'"
          ></div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl text-yellow-500 mb-4 font-bold flex items-center gap-2">
        <i class="fa-solid fa-volume-high"></i> Audio
      </h2>
      
      <div 
        @click="toggleSetting('sound')"
        class="flex items-center justify-between bg-white/5 p-4 rounded cursor-pointer hover:bg-white/10 transition-colors"
      >
        <div>
          <div class="font-bold text-gray-300">System Sounds</div>
          <div class="text-xs text-gray-400">Keyboard clicks and interface boops</div>
        </div>
        
        <div 
          class="w-12 h-6 rounded-full transition-colors relative"
          :class="store.soundEnabled ? 'bg-hacker-green' : 'bg-gray-600'"
        >
          <div 
            class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
            :class="store.soundEnabled ? 'left-7' : 'left-1'"
          ></div>
        </div>
      </div>
    </div>

    <div class="text-center mt-10 text-gray-600 text-xs">
      GelOS v3.0 - Build 2026
    </div>

  </div>
</template>