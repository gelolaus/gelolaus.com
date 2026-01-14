<script setup>
    import { ref, onMounted } from 'vue'
    import { useWindowStore } from '@/stores/windowManager'
    
    const store = useWindowStore()
    
    // Track what URL the user wants to visit
    const urlInput = ref(store.windows.browser.url) 
    
    // The actual URL loaded in the iframe
    const iframeSrc = ref('')
    
    // Show a loading indicator while page loads
    const isLoading = ref(false)
    
    // Navigate to a URL
    const navigate = () => {
        let target = urlInput.value.trim()
        
        // Add https:// if user didn't type it
        if (!target.startsWith('http') && !target.startsWith('file')) {
            target = 'https://' + target
        }
        
        // Update the address bar and load the page
        urlInput.value = target
        isLoading.value = true
        iframeSrc.value = target
        
        // Hide loading indicator after a delay
        setTimeout(() => {
            isLoading.value = false
        }, 1500)
    }
    
    // Load the default URL when component mounts
    onMounted(() => {
        navigate()
    })
    </script>
    
    <template>
        <div class="flex flex-col h-full">
            <div class="h-10 bg-gray-800 flex items-center px-2 border-b border-gray-600 gap-2 shrink-0">
                
                <div class="flex-1 flex items-center">
                    <input 
                        v-model="urlInput"
                        @keydown.enter="navigate"
                        type="text" 
                        class="w-full h-6 bg-black/50 border border-gray-600 rounded px-2 text-xs text-hacker-green font-mono focus:outline-none focus:border-hacker-green placeholder-gray-600"
                        placeholder="https://..."
                    >
                    
                    <button 
                        @click="navigate" 
                        class="ml-2 px-2 h-6 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
                    >
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
    
            <div class="flex-1 bg-white relative overflow-hidden">
                <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-xs z-10">
                    Loading...
                </div>
                
                <iframe 
                    :src="iframeSrc" 
                    class="w-full h-full border-none"
                ></iframe>
            </div>
        </div>
    </template>