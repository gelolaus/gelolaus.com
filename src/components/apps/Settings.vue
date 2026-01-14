<script setup>
    import { useWindowStore } from '@/stores/windowManager'
    
    // We grab the store so we can change the global settings
    const store = useWindowStore()
    
    // This function handles the toggle clicks
    // It's a bit cleaner than writing the logic inside the template
    const toggleSetting = (setting) => {
      if (setting === 'matrix') {
        store.toggleMatrix()
      } else if (setting === 'crt') {
        // We haven't built this in the store yet, but we will next!
        store.toggleCRT()
      } else if (setting === 'sound') {
        // Same here, coming in the next step
        store.toggleSound()
      }
    }
    </script>
    
    <template>
      <div class="h-full bg-gray-900 text-gray-200 p-6 font-mono overflow-y-auto select-none">
        
        <h1 class="text-2xl font-bold text-hacker-green mb-6 border-b border-gray-700 pb-2">
          <i class="fa-solid fa-gears mr-2"></i>System Settings
        </h1>
    
        <div class="mb-8">
          <h2 class="text-xl text-blue-400 mb-4 font-bold flex items-center gap-2">
            <i class="fa-solid fa-eye"></i> Display & Visuals
          </h2>
          
          <div 
            @click="toggleSetting('matrix')"
            class="flex items-center justify-between bg-white/5 p-4 rounded mb-2 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div>
              <div class="font-bold text-hacker-green">Matrix Rain</div>
              <div class="text-xs text-gray-400">Enable the falling code effect on the desktop</div>
            </div>
            
            <div 
              class="w-12 h-6 rounded-full transition-colors relative"
              :class="store.isMatrixActive ? 'bg-hacker-green' : 'bg-gray-600'"
            >
              <div 
                class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
                :class="store.isMatrixActive ? 'left-7' : 'left-1'"
              ></div>
            </div>
          </div>
    
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