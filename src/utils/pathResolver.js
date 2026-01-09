import { fileSystem } from './fileSystem'

// Helper function to find a file or folder in our system
// currentPath = Array of where we are now (e.g. ['root', 'documents'])
// targetPath = String of where we want to go (e.g. '../desktop')
export function resolvePath(currentPath, targetPath) {
    
    // Check if it's an absolute path (starts with /)
    // If yes, reset to root. If no, keep our current position.
    let pathStack = targetPath.startsWith('/') ? ['root'] : [...currentPath];
    
    // Split the path by '/' and remove empty parts or dots
    const segments = targetPath.split('/').filter(seg => seg !== '' && seg !== '.');

    // Loop through the parts to handle ".." (going back)
    for (const segment of segments) {
        if (segment === '..') {
            // Only go back if we are not already at the root
            if (pathStack.length > 1) pathStack.pop();
        } else {
            // Otherwise, add the folder to our path
            pathStack.push(segment);
        }
    }

    // Now verify if this path actually exists in our data
    let currentNode = fileSystem.root;
    
    // Start loop at 1 because 0 is always 'root'
    for (let i = 1; i < pathStack.length; i++) {
        const folderName = pathStack[i];
        
        // Check if the next folder exists inside children
        if (currentNode.type === 'directory' && currentNode.children && currentNode.children[folderName]) {
            currentNode = currentNode.children[folderName];
        } else {
            // If the folder is missing, stop and return error
            return { error: `cd: ${targetPath}: No such file or directory` };
        }
    }

    // Found it! Return the node and the new path array
    return { 
        node: currentNode, 
        path: pathStack 
    };
}