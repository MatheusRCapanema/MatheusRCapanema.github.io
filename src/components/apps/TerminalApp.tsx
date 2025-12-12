import React, { useState, useRef, useEffect } from 'react';
import { getNode, resolvePath } from '../../utils/fileSystem';

interface TerminalLine {
    type: 'input' | 'output';
    content: string;
    path?: string;
}

export const TerminalApp: React.FC = () => {
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'output', content: 'RetroOS Terminal v1.0.0' },
        { type: 'output', content: "Type 'help' for available commands." }
    ]);
    const [input, setInput] = useState('');
    const [currentPath, setCurrentPath] = useState<string[]>(['home', 'user']);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Auto-focus input on click anywhere in terminal
    const handleFocus = () => inputRef.current?.focus();

    const handleCommand = (cmdStr: string) => {
        const trimmed = cmdStr.trim();
        if (!trimmed) return;

        const parts = trimmed.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        let output = '';

        switch (cmd) {
            case 'help':
                output = "Available commands:\n  ls     - List directory contents\n  cd     - Change directory\n  cat    - Read file content\n  clear  - Clear terminal\n  pwd    - Print working directory\n  whoami - Current user";
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'pwd':
                output = '/' + currentPath.join('/');
                break;
            case 'whoami':
                output = 'guest';
                break;
            case 'ls': {
                const node = getNode(currentPath);
                if (node && node.type === 'directory' && node.children) {
                    const items = Object.keys(node.children).map(name => {
                        const child = node.children![name];
                        return child.type === 'directory' ? `${name}/` : name;
                    });
                    output = items.join('  ');
                } else {
                    output = "Error: Cannot list contents.";
                }
                break;
            }
            case 'cd': {
                const target = args[0];
                if (!target) {
                    setCurrentPath(['home', 'user']);
                } else {
                    const newPath = resolvePath(currentPath, target);
                    const node = getNode(newPath);
                    if (node && node.type === 'directory') {
                        setCurrentPath(newPath);
                    } else {
                        output = `cd: ${target}: No such directory`;
                    }
                }
                break;
            }
            case 'cat': {
                const target = args[0];
                if (!target) {
                    output = "Usage: cat <filename>";
                } else {
                    // Resolve path relative to current or absolute
                    const targetPath = resolvePath(currentPath, target);
                    const node = getNode(targetPath);
                    if (node && node.type === 'file') {
                        output = node.content || '';
                    } else {
                        output = `cat: ${target}: No such file`;
                    }
                }
                break;
            }
            default:
                output = `Command not found: ${cmd}`;
        }

        setHistory(prev => [
            ...prev,
            { type: 'input', content: cmdStr, path: '/' + currentPath.join('/') },
            ...(output ? [{ type: 'output', content: output }] : [])
        ] as TerminalLine[]);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div
            className="terminal"
            onClick={handleFocus}
            style={{
                height: '100%',
                backgroundColor: '#000',
                color: '#0f0',
                fontFamily: "'VT323', monospace",
                fontSize: '18px',
                padding: '10px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {history.map((line, i) => (
                <div key={i} style={{ marginBottom: 4, whiteSpace: 'pre-wrap' }}>
                    {line.type === 'input' && <span style={{ color: '#fff' }}>{line.path} $ </span>}
                    {line.content}
                </div>
            ))}
            <div style={{ display: 'flex' }}>
                <span style={{ color: '#fff' }}>{'/' + currentPath.join('/')} $ </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#0f0',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        outline: 'none',
                        flex: 1,
                        marginLeft: 8
                    }}
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};
