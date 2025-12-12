import React, { useState, useRef, useEffect } from 'react';
import { useWindowManager } from '../../contexts/WindowManager';

interface WindowFrameProps {
    id: string;
    title: string;
    children: React.ReactNode;
    initialPosition?: { x: number; y: number };
    initialSize?: { width: number; height: number };
    zIndex: number;
    isActive: boolean;
    isMaximized?: boolean;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
    id, title, children, initialPosition = { x: 50, y: 50 }, initialSize = { width: 600, height: 400 }, zIndex, isActive, isMaximized = false
}) => {
    const { closeWindow, minimizeWindow, toggleMaximize, focusWindow } = useWindowManager();
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        focusWindow(id);
        if (isMaximized) return; // Disable drag if maximized
        if ((e.target as HTMLElement).closest('.window-controls')) return;
        if ((e.target as HTMLElement).closest('.resize-handle')) return;

        setIsDragging(true);
        // Calculate offset relative to window top-left
        const rect = windowRef.current?.getBoundingClientRect();
        if (rect) {
            dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    // ... handleResizeStart and useEffect equivalent ...

    const handleResizeStart = (e: React.MouseEvent) => {
        if (isMaximized) return; // Disable resize if maximized
        e.preventDefault();
        e.stopPropagation();
        focusWindow(id);
        setIsResizing(true);
        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            } else if (isResizing) {
                const deltaX = e.clientX - resizeStart.current.x;
                const deltaY = e.clientY - resizeStart.current.y;
                setSize({
                    width: Math.max(200, resizeStart.current.width + deltaX),
                    height: Math.max(150, resizeStart.current.height + deltaY)
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing]);


    return (
        <div
            ref={windowRef}
            className={`retro-window ${isActive ? 'active' : ''} ${isMaximized ? 'maximized' : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                zIndex,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--border-window)',
                backgroundColor: 'var(--window-window)',
                border: '2px solid var(--window-bg)', // Outer border simulation
                paddingBottom: 4, // Space for resize handle
                paddingRight: 4
            }}
            onMouseDown={() => focusWindow(id)}
        >
            <div
                className="title-bar"
                onMouseDown={handleMouseDown}
                style={{
                    backgroundColor: isActive ? 'var(--window-header)' : 'var(--window-header-inactive)',
                    color: '#fff',
                    padding: '2px 4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'default',
                    userSelect: 'none',
                    height: '24px',
                    flexShrink: 0
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 'bold' }}>
                    {/* Icon could go here */}
                    {title}
                </div>
                <div className="window-controls" style={{ display: 'flex', gap: 2 }}>
                    <button onClick={() => minimizeWindow(id)} className="retro-btn" style={{ padding: '0px 4px', minWidth: 20 }}>_</button>
                    <button onClick={() => toggleMaximize(id)} className="retro-btn" style={{ padding: '0px 4px', minWidth: 20 }}>{isMaximized ? '❐' : '□'}</button>
                    <button onClick={() => closeWindow(id)} className="retro-btn" style={{ padding: '0px 4px', minWidth: 20, fontWeight: 'bold' }}>X</button>
                </div>
            </div>

            <div className="window-content" style={{
                flex: 1,
                overflow: 'auto',
                padding: '8px',
                backgroundColor: 'var(--window-bg)',
                border: 'var(--border-lowered)',
                margin: '4px',
                position: 'relative'
            }}>
                {children}
            </div>

            {/* Resize Handle - Hide if maximized */}
            {!isMaximized && (
                <div
                    className="resize-handle"
                    onMouseDown={handleResizeStart}
                    style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 16,
                        height: 16,
                        cursor: 'se-resize',
                        background: 'linear-gradient(135deg, transparent 50%, #808080 50%)',
                        zIndex: 10
                    }}
                />
            )}
        </div>
    );
};
