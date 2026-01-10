<script setup>
    import { ref, onMounted, nextTick } from 'vue'
    import { useWindowStore } from '@/stores/windowManager'
    import { resolvePath } from '@/utils/pathResolver'
    import { commands } from '@/utils/commandOutputs'
    
    const store = useWindowStore()
    
    // --- CONFIG ---
    const welcomeLines = [
        { text: "Welcome to GelOS v2.0. Type 'help'.", color: "text-gray-400" }
    ]
    
    // --- STATE ---
    const history = ref([...welcomeLines]) 
    const currentPath = ref(['root']) 
    const input = ref('')
    const inputRef = ref(null)
    
    // For history navigation (Arrow Up/Down)
    const cmdHistory = ref([])
    const historyIndex = ref(-1)
    
    // --- HELPERS ---
    const scrollToBottom = async () => {
        await nextTick()
        const container = document.getElementById('terminal-container')
        if(container) container.scrollTop = container.scrollHeight
    }
    
    // --- COMMAND HANDLER ---
    const handleEnter = () => {
        const rawCmd = input.value.trim()
        if (!rawCmd) return
    
        // 1. Save to command history
        cmdHistory.value.push(rawCmd)
        historyIndex.value = cmdHistory.value.length
        
        // 2. Display the user's command line
        const pathStr = currentPath.value.length === 1 ? '~' : '~/' + currentPath.value.slice(1).join('/')
        history.value.push({ 
            text: `root@gelo:${pathStr}$ ${rawCmd}`, 
            color: "text-white font-bold" 
        })
    
        // 3. Parse Command
        const args = rawCmd.split(' ')
        const cmd = args[0].toLowerCase()
        const target = args[1]
    
        // 4. Execute Logic
        if (commands[cmd]) {
            // Simple text commands (help, whoami, etc.)
            history.value.push({ text: commands[cmd], isHtml: true })
        } 
        else if (cmd === 'clear') {
            history.value = [...welcomeLines]
        }
        else if (cmd === 'matrix') {
            store.toggleMatrix()
            const status = store.isMatrixActive ? "Enabled... Wake up, Neo!" : "Disabled... Hello, Gelo!"
            history.value.push({ 
                text: `Matrix Protocol ${status}`, 
                color: "text-hacker-green font-bold" 
            })
        }
        else if (cmd === 'ls') {
            const { node } = resolvePath(currentPath.value, '.')
            
            if (node && node.children) {
                let output = '<div class="grid grid-cols-2 md:grid-cols-4 gap-2">'
                for (const [name, item] of Object.entries(node.children)) {
                    let color = 'text-gray-300'
                    let icon = ''
                    // Styling based on file type
                    if (item.type === 'directory') { color = 'text-blue-400 font-bold'; icon = '/' }
                    else if (item.type === 'shortcut') { color = 'text-hacker-green'; icon = '*' }
                    else if (item.type === 'pdf') { color = 'text-red-400'; icon = '' }
                    else if (item.type === 'img') { color = 'text-purple-400'; icon = '' }
                    
                    output += `<span class="${color}">${name}${icon}</span>`
                }
                output += '</div>'
                history.value.push({ text: output, isHtml: true })
            }
        }
        else if (cmd === 'cd') {
            if (!target) {
                currentPath.value = ['root'] 
            } else {
                const result = resolvePath(currentPath.value, target)
                if (result.error) {
                    history.value.push({ text: result.error, color: 'text-red-500' })
                } else if (result.node.type !== 'directory') {
                    history.value.push({ text: `cd: ${target}: Not a directory`, color: 'text-red-500' })
                } else {
                    currentPath.value = result.path 
                }
            }
        }
        else if (cmd === 'open') {
            if (!target) {
                history.value.push({ text: "usage: open [filename]", color: 'text-yellow-500' })
            } else {
                const result = resolvePath(currentPath.value, target)
                if (result.error) {
                    history.value.push({ text: result.error, color: 'text-red-500' })
                } else {
                    const file = result.node
                    
                    if (file.type === 'shortcut') {
                        history.value.push({ text: `Launching ${target}...`, color: 'text-gray-400' })
                        store.openWindow(file.windowId)
                    } 
                    else if (file.type === 'directory') {
                        history.value.push({ text: `open: ${target}: Is a directory`, color: 'text-red-500' })
                    }
                    else if (file.type === 'pdf') {
                        history.value.push({ text: `Opening PDF: ${target}...`, color: 'text-gray-400' })
                        store.openWindow('pdf', { 
                            title: target, 
                            filePath: file.path 
                        })
                    }
                    else if (file.type === 'img') {
                        history.value.push({ text: `Opening Image: ${target}...`, color: 'text-gray-400' })
                        store.openWindow('image', { 
                            title: target, 
                            filePath: file.path 
                        })
                    }
                    else {
                        history.value.push({ text: `Cannot open file type: ${file.type}`, color: 'text-red-500' })
                    }
                }
            }
        }
        else {
            history.value.push({ text: `Command not found: ${cmd}`, color: 'text-red-500' })
        }
    
        // 5. Cleanup
        input.value = ''
        scrollToBottom()
    }
    
    // --- KEYBOARD SHORTCUTS ---
    const handleKey = (e) => {
        if (e.key === 'ArrowUp') {
            if (historyIndex.value > 0) {
                historyIndex.value--
                input.value = cmdHistory.value[historyIndex.value]
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex.value < cmdHistory.value.length - 1) {
                historyIndex.value++
                input.value = cmdHistory.value[historyIndex.value]
            } else {
                historyIndex.value = cmdHistory.value.length
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
                    root@gelo:{{ currentPath.length === 1 ? '~' : '~/' + currentPath.slice(1).join('/') }}$
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