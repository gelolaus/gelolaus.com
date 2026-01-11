<script setup>
    import { ref, onMounted, nextTick } from 'vue'
    import { useShell } from '@/composables/useShell'
    
    const { history, currentPath, commandHistory, execute, formatPath } = useShell()
    
    const input = ref('')
    const inputRef = ref(null)
    const historyIndex = ref(-1)

    const scrollToBottom = async () => {
        await nextTick()
        const container = document.getElementById('terminal-container')
        if(container) container.scrollTop = container.scrollHeight
    }

    const handleEnter = () => {
        const cmd = input.value
        execute(cmd)
        input.value = ''
        historyIndex.value = commandHistory.value.length
        scrollToBottom()
    }

    const handleKey = (e) => {
        if (e.key === 'ArrowUp') {
            if (historyIndex.value > 0) {
                historyIndex.value--
                input.value = commandHistory.value[historyIndex.value]
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex.value < commandHistory.value.length - 1) {
                historyIndex.value++
                input.value = commandHistory.value[historyIndex.value]
            } else {
                historyIndex.value = commandHistory.value.length
                input.value = ''
            }
        }
    }
    
    onMounted(() => {
        inputRef.value?.focus()
    })
</script>
    
<template>
    <div id="terminal-container" class="h-full bg-hacker-black p-4 font-mono text-sm overflow-y-auto" @click="inputRef?.focus()">
        
        <div v-for="(line, i) in history" :key="i" :class="['mb-1', line.color]">
            <span v-if="line.isHtml" v-html="line.text"></span>
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