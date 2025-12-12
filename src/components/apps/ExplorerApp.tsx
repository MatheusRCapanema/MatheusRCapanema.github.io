import React, { useState } from 'react';
import { fileSystem, type FileSystemNode } from '../../utils/fileSystem';
import { useWindowManager } from '../../contexts/WindowManager';
import { NotepadApp } from './NotepadApp';

interface ExplorerAppProps {
    initialPath?: string[];
}

export const ExplorerApp: React.FC<ExplorerAppProps> = ({ initialPath = ['home', 'user', 'documents'] }) => {
    const [currentPath, setCurrentPath] = useState<string[]>(initialPath);
    const { openWindow } = useWindowManager();

    const getCurrentNode = () => {
        let current: FileSystemNode = fileSystem['root'];
        for (const p of currentPath) {
            if (current.children && current.children[p]) {
                current = current.children[p];
            } else {
                return null;
            }
        }
        return current;
    };

    const currentNode = getCurrentNode();

    const handleOpen = (node: FileSystemNode) => {
        if (node.type === 'directory') {
            setCurrentPath([...currentPath, node.name]); // Note: In this simple FS, name matches key often, but logic might vary. 
            // Actually our keys are IDs but children are keyed by name in standard FS. 
            // In our utils/fileSystem, keys are file names.
        } else if (node.type === 'file') {
            openWindow(node.id, node.name, <NotepadApp path={[...currentPath, node.name]} />);
        } else if (node.type === 'pdf') {
            // Open PDF in new window
            openWindow(node.id, node.name, (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#525659' }}>
                    <iframe
                        src={node.content}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={node.name}
                    />
                </div>
            ));
        }
    };

    const handleUp = () => {
        if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
        }
    };

    if (!currentNode || !currentNode.children) return <div>Error: Path not found</div>;

    const items = Object.entries(currentNode.children);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
            {/* Toolbar */}
            <div style={{ padding: '4px', borderBottom: '2px solid #808080', display: 'flex', gap: 4, alignItems: 'center', backgroundColor: '#c0c0c0' }}>
                <button onClick={handleUp} className="retro-btn" disabled={currentPath.length === 0}>Up</button>
                <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #808080', padding: '2px 4px', fontSize: '12px' }}>
                    /{currentPath.join('/')}
                </div>
            </div>

            {/* File Grid */}
            <div style={{ flex: 1, padding: 10, display: 'flex', flexWrap: 'wrap', gap: 20, alignContent: 'flex-start' }}>
                {items.length === 0 && <div style={{ color: '#808080' }}>Empty folder</div>}

                {items.map(([key, node]) => (
                    <div
                        key={node.id}
                        onDoubleClick={() => handleOpen(node)}
                        className="desktop-icons" // Reuse hover styles
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 64,
                            cursor: 'pointer',
                        }}
                    >
                        <img
                            src={
                                node.type === 'directory' ? 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png' :
                                    node.type === 'pdf' ? 'https://win98icons.alexmeub.com/icons/png/chm-2.png' : // Help icon looks like document
                                        'https://win98icons.alexmeub.com/icons/png/notepad-5.png'
                            }
                            style={{
                                width: 32,
                                height: 32,
                                marginBottom: 4,
                                imageRendering: 'pixelated'
                            }}
                            alt={node.type}
                        />
                        <span style={{
                            fontSize: '12px',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            lineHeight: 1.2
                        }}>
                            {node.name}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{ padding: 4, borderTop: '1px solid #808080', fontSize: '11px' }}>
                {items.length} object(s)
            </div>
        </div>
    );
};
