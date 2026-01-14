import { ref } from 'vue'
import { fileSystem } from '@/utils/fileSystem'
import { commands } from '@/utils/commandOutputs'
import { resolvePath } from '@/utils/pathResolver'
import { useWindowStore } from '@/stores/windowManager'

// Composable for handling terminal commands
export function useShell() {
    const store = useWindowStore()
    
    // Terminal output history (what you see in the terminal)
    const history = ref([
        { text: "Welcome to GelOS v2.0. Type 'help'.", color: "text-gray-400" }
    ])
    
    // Where we are in the file system
    const currentPath = ref(['root'])
    
    // Commands the user has typed (for up/down arrow history)
    const commandHistory = ref([])
    const historyIndex = ref(-1)

    // Save a command to history
    const addToHistory = (cmd) => {
        commandHistory.value.push(cmd)
        historyIndex.value = commandHistory.value.length
    }

    // Format the path to look nice (~ for root, ~/folder for deeper)
    const formatPath = () => {
        return currentPath.value.length === 1 ? '~' : '~/' + currentPath.value.slice(1).join('/')
    }

    // Run a command the user typed
    const execute = (rawCmd) => {
        if (!rawCmd) return

        addToHistory(rawCmd)
        
        // Show what the user typed
        history.value.push({ 
            text: `root@gelo:${formatPath()}$ ${rawCmd}`, 
            color: "text-white font-bold" 
        })

        // Parse the command
        const args = rawCmd.trim().split(' ')
        const cmd = args[0].toLowerCase()
        const target = args[1]

        // Check if it's a simple command like 'whoami' or 'help'
        if (commands[cmd]) {
            history.value.push({ text: commands[cmd], isHtml: true })
            return
        }

        // Handle special commands
        switch (cmd) {
            case 'clear':
                // Clear all output
                history.value = []
                break

            case 'matrix':
                // Toggle Matrix effect
                store.toggleMatrix()
                const status = store.isMatrixActive ? "Enabled... Wake up, Neo!" : "Disabled... Hello, Gelo!"
                history.value.push({ 
                    text: `Matrix Protocol ${status}`, 
                    color: "text-hacker-green font-bold" 
                })
                break

            case 'ls':
                // List files
                handleLs()
                break

            case 'cd':
                // Change directory
                handleCd(target)
                break

            case 'open':
                // Open a file
                handleOpen(target)
                break

            default:
                // Command not found
                history.value.push({ text: `Command not found: ${cmd}`, color: 'text-red-500' })
        }
    }

    // List files in current directory
    const handleLs = () => {
        const { node } = resolvePath(currentPath.value, '.')
        
        if (node && node.children) {
            let output = '<div class="grid grid-cols-2 md:grid-cols-4 gap-2">'
            
            // Show each file with appropriate color
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

    // Change to a different directory
    const handleCd = (target) => {
        if (!target) {
            // No argument means go to root
            currentPath.value = ['root'] 
            return
        }
        
        // Try to navigate to the target
        const result = resolvePath(currentPath.value, target)
        if (result.error) {
            history.value.push({ text: result.error, color: 'text-red-500' })
        } else if (result.node.type !== 'directory') {
            history.value.push({ text: `cd: ${target}: Not a directory`, color: 'text-red-500' })
        } else {
            // Success! Update our current path
            currentPath.value = result.path 
        }
    }

    // Open a file or shortcut
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
        
        // Handle different file types
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

    // Return everything components need
    return {
        history,
        currentPath,
        commandHistory,
        execute,
        formatPath
    }
}
