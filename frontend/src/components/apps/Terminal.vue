<script setup>
    import { ref, onMounted, nextTick } from 'vue'
    import DOMPurify from 'dompurify'
    import { useShell } from '../../composables/useShell'
    import { useBreakpoints } from '../../composables/useBreakpoints'
    
    const { history, currentPath, commandHistory, execute, formatPath, handleTab } = useShell()
    const { isMobile } = useBreakpoints()
    
    const input = ref('')
    const inputRef = ref(null)
    const historyIndex = ref(-1)

    const scrollToBottom = async () => {
        await nextTick()
        const container = document.getElementById('terminal-container')
        if(container) container.scrollTop = container.scrollHeight
    }

    const onTab = () => {
        input.value = handleTab(input.value)
        scrollToBottom()
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

    // Mobile specific shortcut handler
    const handleShortcut = (key) => {
        if (key === 'Tab') onTab()
        else if (key === 'Up') {
            if (historyIndex.value > 0) {
                historyIndex.value--
                input.value = commandHistory.value[historyIndex.value]
            }
        } else if (key === 'Down') {
            if (historyIndex.value < commandHistory.value.length - 1) {
                historyIndex.value++
                input.value = commandHistory.value[historyIndex.value]
            } else {
                historyIndex.value = commandHistory.value.length
                input.value = ''
            }
        } else if (key === 'Ctrl+C') {
            execute('^C')
            input.value = ''
        }
        inputRef.value?.focus()
    }

    const sanitize = (html) => DOMPurify.sanitize(html)
    
    onMounted(() => {
        inputRef.value?.focus()
    })
</script>
    
<template>
    <div class="h-full flex flex-col bg-hacker-black overflow-hidden font-mono selection:bg-hacker-green/30">
        <div 
            id="terminal-container" 
            class="flex-1 p-4 text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700" 
            @click="inputRef?.focus()"
        >
            <div v-for="(line, i) in history" :key="i" :class="['mb-1 leading-relaxed', line.color]">
                <span v-if="line.isHtml" v-html="sanitize(line.text)"></span>
                <span v-else class="whitespace-pre-wrap">{{ line.text }}</span>
            </div>

            <div class="flex items-center">
                <span class="text-hacker-green mr-2 shrink-0">
                    root@gelo:{{ formatPath() }}$
                </span>
                <input 
                    ref="inputRef"
                    v-model="input"
                    @keydown.enter="handleEnter"
                    @keydown.tab.prevent="onTab"
                    @keydown.up.prevent="handleKey"
                    @keydown.down.prevent="handleKey"
                    type="text" 
                    class="bg-transparent border-none outline-none text-white flex-1 font-mono min-w-0"
                    autocomplete="off"
                    spellcheck="false"
                    autofocus
                />
            </div>
        </div>

        <div v-if="isMobile" class="flex gap-2 p-2 bg-gray-900 border-t border-gray-800 overflow-x-auto shrink-0 no-scrollbar">
            <button v-for="key in ['Tab', 'Up', 'Down', 'Ctrl+C', '/']" :key="key"
                    @click="handleShortcut(key)"
                    class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-[10px] text-gray-300 font-bold active:bg-hacker-green active:text-black transition-colors whitespace-nowrap">
                {{ key }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>