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
        { text: "Welcome to GelOS v3.0. Type 'help'.", color: "text-gray-400" }
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

    // --- TAB AUTOCOMPLETE LOGIC ---
    
    // Helper to find the longest common prefix among autocomplete matches
    const getCommonPrefix = (words) => {
        if (!words || words.length === 0) return ''
        let prefix = words[0]
        for (let i = 1; i < words.length; i++) {
            while (words[i].toLowerCase().indexOf(prefix.toLowerCase()) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1)
                if (prefix === '') return ''
            }
        }
        // Return correctly cased prefix based on the actual file system
        return words[0].substring(0, prefix.length)
    }

    const handleTab = (currentInput) => {
        if (!currentInput) return currentInput

        // Get the last word they are typing (e.g., "cd doc" -> "doc", "cd ../p" -> "../p")
        const args = currentInput.split(' ')
        const lastToken = args[args.length - 1]

        // Separate the path part from the partial word
        const lastSlashIndex = lastToken.lastIndexOf('/')
        let dirPath = '.'
        let partialName = lastToken

        if (lastSlashIndex !== -1) {
            dirPath = lastToken.substring(0, lastSlashIndex)
            if (dirPath === '') dirPath = '/' // Handle absolute root correctly
            partialName = lastToken.substring(lastSlashIndex + 1)
        }

        // Resolve the directory they are trying to autocomplete inside
        const result = resolvePath(currentPath.value, dirPath)
        
        // If directory doesn't exist, just return what they typed
        if (result.error || !result.node || result.node.type !== 'directory' || !result.node.children) {
            return currentInput
        }

        // Find matches in that directory
        const matches = Object.keys(result.node.children).filter(name => 
            name.toLowerCase().startsWith(partialName.toLowerCase())
        )

        if (matches.length === 1) {
            // Exactly one match! Auto-complete it fully.
            const match = matches[0]
            const isDir = result.node.children[match].type === 'directory'
            
            // Slice off what they already typed and append the correct match
            const baseInput = currentInput.substring(0, currentInput.length - partialName.length)
            return baseInput + match + (isDir ? '/' : '')
            
        } else if (matches.length > 1) {
            // Multiple matches! Find how much we can safely autocomplete for them
            const commonPrefix = getCommonPrefix(matches)
            let newInput = currentInput
            
            if (commonPrefix.length > partialName.length) {
                const baseInput = currentInput.substring(0, currentInput.length - partialName.length)
                newInput = baseInput + commonPrefix
            }

            // Print the input line and the available options, mimicking real bash
            history.value.push({ 
                text: `root@gelo:${formatPath()}$ ${currentInput}`, 
                color: "text-white font-bold" 
            })
            
            let output = '<div class="grid grid-cols-2 md:grid-cols-4 gap-2">'
            for (const match of matches) {
                const item = result.node.children[match]
                let color = 'text-gray-300'
                let icon = ''
                if (item.type === 'directory') { color = 'text-blue-400 font-bold'; icon = '/' }
                else if (item.type === 'shortcut') { color = 'text-hacker-green'; icon = '*' }
                else if (item.type === 'pdf') { color = 'text-red-400'; icon = '' }
                else if (item.type === 'img') { color = 'text-purple-400'; icon = '' }
                output += `<span class="${color}">${match}${icon}</span>`
            }
            output += '</div>'
            history.value.push({ text: output, isHtml: true })
            
            return newInput
        }

        return currentInput
    }

    // --- COMMAND EXECUTION ---

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

            case 'sudo':
                if (target === 'su') {
                    history.value.push({ text: "[sudo] password for root: ********", color: "text-gray-400" })
                    history.value.push({ text: "ACCESS GRANTED. GOD MODE INITIATED.", color: "text-red-500 font-bold animate-pulse" })
                    store.notify('SECURITY OVERRIDE', 'Root Access Granted', 'error')
                    if (!store.isMatrixActive) store.toggleMatrix()
                } else {
                    history.value.push({ text: `gelo is not in the sudoers file. This incident will be reported.`, color: "text-red-500" })
                }
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
        formatPath,
        handleTab // Export the new tab function
    }
}