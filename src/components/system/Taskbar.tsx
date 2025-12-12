import React, { useState, useEffect } from 'react';

export const Taskbar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [isStartOpen, setIsStartOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="taskbar" style={{
            height: '40px',
            backgroundColor: 'var(--window-bg)',
            borderTop: '2px solid #fff',
            display: 'flex',
            alignItems: 'center',
            padding: '2px 4px',
            justifyContent: 'space-between',
            boxShadow: 'inset 0 1px 0 #fff'
        }}>
            <div style={{ display: 'flex', gap: 4, position: 'relative' }}>
                {isStartOpen && (
                    <div className="start-menu" style={{
                        position: 'absolute',
                        bottom: '32px',
                        left: '0',
                        width: '200px',
                        backgroundColor: 'var(--window-bg)',
                        boxShadow: 'var(--border-window)',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 9999,
                    }}>
                        <div style={{
                            background: 'linear-gradient(to bottom, #000080, #1084d0)',
                            color: 'white',
                            width: '24px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            paddingBottom: 8
                        }}>
                            <span style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap'
                            }}>RetroOS</span>
                        </div>
                        <div style={{ paddingLeft: 28, paddingRight: 4, paddingBottom: 4, paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div className="start-item" style={{ padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => window.location.reload()}>
                                <img src="https://win98icons.alexmeub.com/icons/png/shut_down_cool-4.png" width={24} height={24} />
                                <span>Shut Down...</span>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    className={`retro-btn ${isStartOpen ? 'active' : ''}`}
                    onClick={() => setIsStartOpen(!isStartOpen)}
                    style={{
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}
                >
                    <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" alt="start" style={{ width: 16, height: 16 }} />
                    Start
                </button>
                <div style={{ width: 2, borderLeft: '1px solid #808080', borderRight: '1px solid #fff', margin: '0 4px' }} />
                {/* Taskbar Items will go here */}
            </div>

            <div className="tray" style={{
                border: 'var(--border-lowered)',
                padding: '2px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '12px'
            }}>
                <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div >
    );
};
