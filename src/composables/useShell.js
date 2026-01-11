import { ref } from 'vue'
import { fileSystem } from '@/utils/fileSystem'
import { commands } from '@/utils/commandOutputs'
import { resolvePath } from '@/utils/pathResolver'
import { useWindowStore } from '@/stores/windowManager'

export function useShell() {
    const store = useWindowStore()
    
    const history = ref([
        { text: "Welcome to GelOS v2.0. Type 'help'.", color: "text-gray-400" }
    ])
    const currentPath = ref(['root'])
    const commandHistory = ref([])
    const historyIndex = ref(-1)

    const addToHistory = (cmd) => {
        commandHistory.value.push(cmd)
        historyIndex.value = commandHistory.value.length
    }

    const formatPath = () => {
        return currentPath.value.length === 1 ? '~' : '~/' + currentPath.value.slice(1).join('/')
    }

    const execute = (rawCmd) => {
        if (!rawCmd) return

        addToHistory(rawCmd)
        
        history.value.push({ 
            text: `root@gelo:${formatPath()}$ ${rawCmd}`, 
            color: "text-white font-bold" 
        })

        const args = rawCmd.trim().split(' ')
        const cmd = args[0].toLowerCase()
        const target = args[1]

        if (commands[cmd]) {
            history.value.push({ text: commands[cmd], isHtml: true })
            return
        }

        switch (cmd) {
            case 'clear':
                history.value = []
                break

            case 'matrix':
                store.toggleMatrix()
                const status = store.isMatrixActive ? "Enabled... Wake up, Neo!" : "Disabled... Hello, Gelo!"
                history.value.push({ 
                    text: `Matrix Protocol ${status}`, 
                    color: "text-hacker-green font-bold" 
                })
                break

            case 'ls':
                handleLs()
                break

            case 'cd':
                handleCd(target)
                break

            case 'open':
                handleOpen(target)
                break

            default:
                history.value.push({ text: `Command not found: ${cmd}`, color: 'text-red-500' })
        }
    }

    const handleLs = () => {
        const { node } = resolvePath(currentPath.value, '.')
        
        if (node && node.children) {
            let output = '<div class="grid grid-cols-2 md:grid-cols-4 gap-2">'
            for (const [name, item] of Object.entries(node.children)) {
                let color = 'text-gray-300'
                let icon = ''
                
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

    const handleCd = (target) => {
        if (!target) {
            currentPath.value = ['root'] 
            return
        }
        const result = resolvePath(currentPath.value, target)
        if (result.error) {
            history.value.push({ text: result.error, color: 'text-red-500' })
        } else if (result.node.type !== 'directory') {
            history.value.push({ text: `cd: ${target}: Not a directory`, color: 'text-red-500' })
        } else {
            currentPath.value = result.path 
        }
    }

    const handleOpen = (target) => {
        if (!target) {
            history.value.push({ text: "usage: open [filename]", color: 'text-yellow-500' })
            return
        }

        const result = resolvePath(currentPath.value, target)
        if (result.error) {
            history.value.push({ text: result.error, color: 'text-red-500' })
            return
        }

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
            store.openWindow('pdf', { title: target, filePath: file.path })
        }
        else if (file.type === 'img') {
            history.value.push({ text: `Opening Image: ${target}...`, color: 'text-gray-400' })
            store.openWindow('image', { title: target, filePath: file.path })
        }
        else {
            history.value.push({ text: `Cannot open file type: ${file.type}`, color: 'text-red-500' })
        }
    }

    return {
        history,
        currentPath,
        commandHistory,
        execute,
        formatPath
    }
}