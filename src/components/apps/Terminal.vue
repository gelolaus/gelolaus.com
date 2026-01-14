<script setup>
    import { ref, onMounted, nextTick } from 'vue'
    import DOMPurify from 'dompurify'
    import { useShell } from '@/composables/useShell'
    
    // Get all the terminal logic from the useShell composable
    const { history, currentPath, commandHistory, execute, formatPath } = useShell()
    
    // Track what user is typing
    const input = ref('')
    
    // Reference to the input field so we can focus it
    const inputRef = ref(null)
    
    // Track position in command history (for up/down arrows)
    const historyIndex = ref(-1)

    // Auto-scroll to bottom when new output appears
    const scrollToBottom = async () => {
        await nextTick()
        const container = document.getElementById('terminal-container')
        if(container) container.scrollTop = container.scrollHeight
    }

    // When user presses Enter, run the command
    const handleEnter = () => {
        const cmd = input.value
        execute(cmd)
        input.value = ''
        historyIndex.value = commandHistory.value.length
        scrollToBottom()
    }

    // Handle up/down arrows to cycle through command history
    const handleKey = (e) => {
        if (e.key === 'ArrowUp') {
            // Go to previous command
            if (historyIndex.value > 0) {
                historyIndex.value--
                input.value = commandHistory.value[historyIndex.value]
            }
        } else if (e.key === 'ArrowDown') {
            // Go to next command
            if (historyIndex.value < commandHistory.value.length - 1) {
                historyIndex.value++
                input.value = commandHistory.value[historyIndex.value]
            } else {
                historyIndex.value = commandHistory.value.length
                input.value = ''
            }
        }
    }

    // Clean HTML to prevent security issues
    const sanitize = (html) => {
        return DOMPurify.sanitize(html)
    }
    
    // Focus the input when terminal opens
    onMounted(() => {
        inputRef.value?.focus()
    })
</script>
    
<template>
    <div id="terminal-container" class="h-full bg-hacker-black p-4 font-mono text-sm overflow-y-auto" @click="inputRef?.focus()">
        
        <div v-for="(line, i) in history" :key="i" :class="['mb-1', line.color]">
            <span v-if="line.isHtml" v-html="sanitize(line.text)"></span>
            <span v-else>{{ line.text }}</span>
        </div>

        <div class="flex items-center">
            <span class="text-hacker-green mr-2">
                root@gelo:{{ formatPath() }}$
            </span>
            <input 
                ref="inputRef"
                v-model="input"
                @keydown.enter="handleEnter"
                @keydown.up="handleKey"
                @keydown.down="handleKey"
                type="text" 
                class="bg-transparent border-none outline-none text-white flex-1 font-mono"
                autocomplete="off"
            />
        </div>
    </div>
</template>