import React, { useState, useEffect, useRef } from 'react';
import { initDatabase, runQuery } from '../../utils/sqlData';

interface TerminalLine {
    type: 'input' | 'output' | 'error';
    content: string | any[];
}

const PREDEFINED_QUERIES = [
    { label: 'Show Experience', query: "SELECT * FROM experience" },
    { label: 'Show Skills', query: "SELECT * FROM skills" },
    { label: 'Show Projects', query: "SELECT * FROM projects" },
    { label: 'Show Education', query: "SELECT * FROM education" },
    { label: 'My Best Skills', query: "SELECT * FROM skills WHERE category IN ('AI', 'Data')" },
];

export const SqlApp: React.FC = () => {
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'output', content: 'SQL Terminal v1.0 connected.' },
        { type: 'output', content: 'Type SQL commands or use the Quick Actions sidebar.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        initDatabase();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const executeQuery = (sql: string) => {
        const result = runQuery(sql);

        if (result && result.error) {
            setHistory(prev => [...prev,
            { type: 'input', content: sql },
            { type: 'error', content: `Error: ${result.error}` }
            ]);
        } else {
            setHistory(prev => [...prev,
            { type: 'input', content: sql },
            { type: 'output', content: result }
            ]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isTyping) {
            executeQuery(input);
            setInput('');
        }
    };

    const runAutoQuery = async (sql: string) => {
        if (isTyping) return;
        setIsTyping(true);
        setInput('');

        // Typing effect
        for (let i = 0; i < sql.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 30));
            setInput(prev => prev + sql[i]);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        executeQuery(sql);
        setInput('');
        setIsTyping(false);
        inputRef.current?.focus();
    };

    const formatTable = (data: any[]) => {
        if (!Array.isArray(data) || data.length === 0) return 'No results.';
        if (typeof data[0] !== 'object') return String(data);

        const keys = Object.keys(data[0]);
        const header = keys.map(k => k.toUpperCase()).join(' | ');
        const separator = keys.map(k => '-'.repeat(k.length)).join('-+-');

        const rows = data.map(row => {
            return keys.map(k => String(row[k])).join(' | ');
        });

        return [header, separator, ...rows].join('\n');
    };

    return (
        <div style={{ display: 'flex', height: '100%', fontFamily: "'VT323', monospace", backgroundColor: '#2b2b2b' }}>
            {/* Sidebar */}
            <div style={{
                width: '180px',
                backgroundColor: '#1a1a1a',
                borderRight: '1px solid #444',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <div style={{ color: '#0f0', marginBottom: '10px', fontSize: '18px', textAlign: 'center' }}>QUICK ACTIONS</div>
                {PREDEFINED_QUERIES.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => runAutoQuery(q.query)}
                        disabled={isTyping}
                        className="retro-btn"
                        style={{
                            textAlign: 'left',
                            fontSize: '14px',
                            cursor: isTyping ? 'wait' : 'pointer',
                            backgroundColor: '#333',
                            color: '#fff',
                            border: '1px solid #555'
                        }}
                    >
                        {q.label}
                    </button>
                ))}
            </div>

            {/* Terminal Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', overflow: 'hidden', backgroundColor: '#000' }}>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', color: '#0f0', fontSize: '16px' }}>
                    {history.map((line, i) => (
                        <div key={i} style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}>
                            {line.type === 'input' && <span style={{ color: '#fff' }}>guest@portfolio:~$ {line.content}</span>}
                            {line.type === 'error' && <span style={{ color: '#f00' }}>{String(line.content)}</span>}
                            {line.type === 'output' && (
                                typeof line.content === 'string' ? line.content :
                                    <div style={{
                                        border: '1px solid #333',
                                        padding: '8px',
                                        backgroundColor: '#111',
                                        fontFamily: 'monospace',
                                        marginTop: '4px'
                                    }}>
                                        {/* Simple JSON dump for now, specialized table format would be better but expensive to render perfectly in text */}
                                        {/* Using a simple pre-wrap for the table formatter */}
                                        {formatTable(line.content as any[])}
                                    </div>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '8px' }}>
                    <span style={{ color: '#0f0', marginRight: '8px' }}>sql&gt;</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isTyping}
                        autoFocus
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontFamily: 'inherit',
                            fontSize: '18px',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
