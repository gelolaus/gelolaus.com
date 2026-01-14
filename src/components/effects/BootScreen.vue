<script setup>
    import { ref, onMounted } from 'vue'
    import { fileSystem } from '@/utils/fileSystem' 
    
    // Tell parent when boot is complete
    const emit = defineEmits(['complete'])
    
    // Boot log messages to display
    const logs = ref([])
    
    // Reference to the container for auto-scrolling
    const containerRef = ref(null)
    
    // Get file names to show during "loading" phase
    const getAssetLogs = () => {
        const assets = []
        try {
            const docs = fileSystem?.root?.children?.documents?.children || {}
            const pics = fileSystem?.root?.children?.pictures?.children || {}
    
            // Add each file to the boot log
            for (const name of Object.keys(docs)) assets.push(`   - /root/documents/${name}`)
            for (const name of Object.keys(pics)) assets.push(`   - /root/pictures/${name}`)
        } catch (e) {
            console.warn("Could not load file system for boot logs:", e)
        }
        return assets
    }
    
    // Run the fake boot sequence
    const runBootSequence = async () => {
        // All the boot messages to show
        const initialLogs = [
            "Initializing GELOS-KERNEL v2.0...",
            "Loading BIOS settings... [OK]",
            "Verifying CPU microcode... [OK]",
            "[OK] CPU: Intel Core i9-14900K detected (24 Cores).",
            "[OK] Memory: 64GB DDR5 RAM verified.",
            "Mounting root filesystem (/) read-only...",
            "Checking integrity of filesystem...",
            "[OK] /dev/nvme0n1p2: clean, 1204422/6291456 files, 332912/25165824 blocks",
            "Remounting root filesystem read-write... [OK]",
            "Loading kernel modules...",
            "   - crypto_user.ko",
            "   - networking.ko",
            "[OK] Interfaces: eth0, wlan0 initialized.",
            "Starting system message bus...",
            "Starting Network Manager...",
            "[OK] Connection established. IP: 192.168.1.104",
            "Loading Portfolio Assets..."
        ]
    
        // Show initial boot messages
        for (let text of initialLogs) {
            logs.value.push(text)
            await autoScrollAndDelay()
        }
    
        // Show file loading messages (faster)
        const assetLogs = getAssetLogs()
        for (let text of assetLogs) {
            logs.value.push(text)
            await autoScrollAndDelay(true) // Fast mode
        }
    
        // Finish up
        logs.value.push("Starting Graphical User Interface (X11)...")
        await autoScrollAndDelay()
        logs.value.push("Welcome, User.")
        
        // Wait a bit then tell parent we're done
        await new Promise(r => setTimeout(r, 800))
        emit('complete')
    }
    
    // Helper to scroll and wait between messages
    const autoScrollAndDelay = async (isFast = false) => {
        // Auto-scroll to bottom
        setTimeout(() => {
            if (containerRef.value) {
                containerRef.value.scrollTop = containerRef.value.scrollHeight
            }
        }, 10)
        
        // Wait a bit (faster if loading files)
        const delay = isFast ? Math.random() * 20 + 5 : Math.random() * 100 + 50
        await new Promise(r => setTimeout(r, delay))
    }
    
    // Start boot sequence when component loads
    onMounted(() => {
        runBootSequence()
    })
</script>
    
<template>
    <div class="fixed inset-0 bg-black z-50 flex flex-col p-10 font-mono text-sm overflow-hidden select-none">
        <div ref="containerRef" class="flex-1 overflow-y-auto space-y-1">
            <div v-for="(log, i) in logs" :key="i" class="text-gray-400">
                <span v-if="log.includes('[OK]')">
                    <span v-html="log.replace('[OK]', '<span class=\'text-hacker-green font-bold\'>[OK]</span>')"></span>
                </span>
                <span v-else>{{ log }}</span>
            </div>
            <div class="animate-pulse text-hacker-green">_</div>
        </div>
    </div>
</template>