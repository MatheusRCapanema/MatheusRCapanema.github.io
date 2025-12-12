import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface WindowState {
    id: string;
    title: string;
    component: ReactNode;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
}

interface WindowManagerContextProps {
    windows: WindowState[];
    openWindow: (id: string, title: string, component: ReactNode) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    toggleMaximize: (id: string) => void;
    focusWindow: (id: string) => void;
    registerWindow: (id: string, title: string, component: ReactNode) => void;
}

const WindowManagerContext = createContext<WindowManagerContextProps | undefined>(undefined);

export const WindowManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [activeZIndex, setActiveZIndex] = useState(10);

    const focusWindow = (id: string) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, zIndex: activeZIndex + 1, isMinimized: false } : w
        ));
        setActiveZIndex(prev => prev + 1);
    };

    const openWindow = (id: string, title: string, component: ReactNode) => {
        setWindows(prev => {
            const existing = prev.find(w => w.id === id);
            if (existing) {
                // Bring to front and open
                return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: activeZIndex + 1 } : w);
            }
            return [...prev, { id, title, component, isOpen: true, isMinimized: false, isMaximized: false, zIndex: activeZIndex + 1 }];
        });
        setActiveZIndex(prev => prev + 1);
    };

    const closeWindow = (id: string) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    };

    const minimizeWindow = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    };

    const toggleMaximize = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    };

    const registerWindow = (id: string, title: string, component: ReactNode) => {
        openWindow(id, title, component);
    };

    return (
        <WindowManagerContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, toggleMaximize, focusWindow, registerWindow }}>
            {children}
        </WindowManagerContext.Provider>
    );
};

export const useWindowManager = () => {
    const context = useContext(WindowManagerContext);
    if (!context) {
        throw new Error('useWindowManager must be used within a WindowManagerProvider');
    }
    return context;
};
