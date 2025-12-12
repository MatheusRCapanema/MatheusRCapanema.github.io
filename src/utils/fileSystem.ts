export type FileType = 'file' | 'directory' | 'pdf';

export interface FileSystemNode {
    id: string;
    name: string;
    type: FileType;
    content?: string; // For text files or PDF url
    children?: { [key: string]: FileSystemNode };
    parentId?: string;
}

export const fileSystem: { [key: string]: FileSystemNode } = {
    'root': {
        id: 'root',
        name: 'root',
        type: 'directory',
        children: {
            'home': {
                id: 'home',
                name: 'home',
                type: 'directory',
                parentId: 'root',
                children: {
                    'user': {
                        id: 'user',
                        name: 'user',
                        type: 'directory',
                        parentId: 'home',
                        children: {
                            'documents': {
                                id: 'documents',
                                name: 'My Documents',
                                type: 'directory',
                                parentId: 'user',
                                children: {
                                    'Matheus - PT.pdf': {
                                        id: 'cv_pt',
                                        name: 'Matheus - PT.pdf',
                                        type: 'pdf',
                                        content: '/Matheus%20-%20PT.pdf', // Public URL
                                        parentId: 'documents'
                                    },
                                    'Matheus - EN.pdf': {
                                        id: 'cv_en',
                                        name: 'Matheus - EN.pdf',
                                        type: 'pdf',
                                        content: '/Matheus%20-%20EN.pdf', // Public URL
                                        parentId: 'documents'
                                    },
                                }
                            }
                        }
                    }
                }
            },
            'readme.txt': {
                id: 'readme',
                name: 'readme.txt',
                type: 'file',
                content: 'Welcome to RetroOS v1.0!\n\nUse the File Explorer to navigate.\nDouble click icons to open.',
                parentId: 'root'
            }
        }
    }
};

export const getNode = (path: string[]): FileSystemNode | null => {
    let current = fileSystem['root'];

    // If path is empty or just ['root'], return the root node
    if (path.length === 0 || (path.length === 1 && path[0] === 'root')) {
        return current;
    }

    const start = path[0] === 'root' ? 1 : 0;

    for (let i = start; i < path.length; i++) {
        const p = path[i];
        if (!current.children || !current.children[p]) return null;
        current = current.children[p];
    }
    return current;
};

export const resolvePath = (currentPath: string[], targetPath: string): string[] => {
    if (targetPath.startsWith('/')) {
        const parts = targetPath.split('/').filter(p => p);
        return parts.length > 0 ? parts : ['root'];
    }
    const newPath = [...currentPath];
    const parts = targetPath.split('/');
    for (const part of parts) {
        if (part === '..') {
            if (newPath.length > 1) { // Don't pop root
                newPath.pop();
            }
        } else if (part === '.' || part === '') {
            continue;
        } else {
            newPath.push(part);
        }
    }
    return newPath;
};
