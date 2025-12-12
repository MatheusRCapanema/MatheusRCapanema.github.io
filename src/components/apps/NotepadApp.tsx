import React, { useEffect, useState } from 'react';
import { getNode } from '../../utils/fileSystem';

export const NotepadApp: React.FC<{ path: string[] }> = ({ path }) => {
    const [content, setContent] = useState('Loading...');

    useEffect(() => {
        const node = getNode(path);
        if (node && node.type === 'file') {
            setContent(node.content || '');
        } else {
            setContent('Error: File not found.');
        }
    }, [path]);

    return (
        <div style={{
            height: '100%',
            backgroundColor: '#fff',
            color: '#000',
            fontFamily: "'Courier New', monospace",
            padding: '8px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
        }}>
            {content}
        </div>
    );
};
