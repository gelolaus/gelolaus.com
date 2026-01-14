import { fileSystem } from './fileSystem'

// Helper function to navigate paths in our virtual file system
// Works like the 'cd' command - handles things like ".." and absolute paths
export function resolvePath(currentPath, targetPath) {
    
    // If path starts with /, start from root. Otherwise start from current location
    let pathStack = targetPath.startsWith('/') ? ['root'] : [...currentPath];
    
    // Split the path into parts (like "documents/folder")
    const segments = targetPath.split('/').filter(seg => seg !== '' && seg !== '.');

    // Process each part of the path
    for (const segment of segments) {
        if (segment === '..') {
            // ".." means go up one folder
            if (pathStack.length > 1) pathStack.pop();
        } else {
            // Add this folder to our path
            pathStack.push(segment);
        }
    }

    // Now find this location in our file system
    let currentNode = fileSystem.root;
    
    // Walk through the path (skip first element since it's 'root')
    for (let i = 1; i < pathStack.length; i++) {
        const folderName = pathStack[i];
        
        // Try to find the next folder
        if (currentNode.type === 'directory' && currentNode.children && currentNode.children[folderName]) {
            currentNode = currentNode.children[folderName];
        } else {
            // Path doesn't exist
            return { error: `cd: ${targetPath}: No such file or directory` };
        }
    }

    // Success! Return the node we found and the full path
    return { 
        node: currentNode, 
        path: pathStack 
    };
}
