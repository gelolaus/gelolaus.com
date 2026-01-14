import { fileSystem } from './fileSystem'

export function resolvePath(currentPath, targetPath) {
    
    let pathStack = targetPath.startsWith('/') ? ['root'] : [...currentPath];
    
    const segments = targetPath.split('/').filter(seg => seg !== '' && seg !== '.');

    for (const segment of segments) {
        if (segment === '..') {
            if (pathStack.length > 1) pathStack.pop();
        } else {
            pathStack.push(segment);
        }
    }

    let currentNode = fileSystem.root;
    
    for (let i = 1; i < pathStack.length; i++) {
        const folderName = pathStack[i];
        
        if (currentNode.type === 'directory' && currentNode.children && currentNode.children[folderName]) {
            currentNode = currentNode.children[folderName];
        } else {
            return { error: `cd: ${targetPath}: No such file or directory` };
        }
    }

    return { 
        node: currentNode, 
        path: pathStack 
    };
}