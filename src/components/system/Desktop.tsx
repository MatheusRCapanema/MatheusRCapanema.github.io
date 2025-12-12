import React, { useState } from 'react';
import { Taskbar } from './Taskbar';
import { useWindowManager } from '../../contexts/WindowManager';
import { WindowFrame } from './WindowFrame';
import { TerminalApp } from '../apps/TerminalApp';
import { BrowserApp } from '../apps/BrowserApp';
import { ExplorerApp } from '../apps/ExplorerApp';
import { SqlApp } from '../apps/SqlApp';

const WALLPAPERS = {
    'Classic Teal': 'var(--desktop-bg)',
    'Matrix': 'url("https://media.giphy.com/media/u0d7cTJv9tCS5pCkYt/giphy.gif") center/cover no-repeat',
    'Stars': 'url("https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif") center/cover no-repeat', // Or a better stars gif
    'Windows 98': 'var(--desktop-bg)', // Fallback
    'Black': '#000000'
};

const DesktopIcon: React.FC<{ label: string; iconUrl: string; onOpen: () => void }> = ({ label, iconUrl, onOpen }) => (
    <div
        onClick={onOpen}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 80,
            color: '#fff',
            textShadow: '1px 1px 0 #000',
            marginBottom: 20,
            cursor: 'pointer'
        }}
    >
        <img src={iconUrl} alt={label} style={{ width: 32, height: 32, marginBottom: 4, imageRendering: 'pixelated' }} />
        <span style={{ textAlign: 'center', fontSize: '14px', backgroundColor: 'transparent', padding: '0 2px' }}>{label}</span>
    </div>
);

export const Desktop: React.FC = () => {
    const { windows, openWindow } = useWindowManager();
    const [wallpaper, setWallpaper] = useState(WALLPAPERS['Classic Teal']);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean }>({ x: 0, y: 0, isOpen: false });

    const handleOpenApp = (appName: string) => {
        let component = <div style={{ padding: 20 }}>Welcome to {appName}!</div>;

        if (appName === 'Terminal') {
            component = <TerminalApp />;
        } else if (appName === 'My Documents') {
            component = <ExplorerApp initialPath={['home', 'user', 'documents']} />;
        } else if (appName === 'My PC') {
            component = <ExplorerApp initialPath={[]} />;
        } else if (appName === 'Internet') {
            component = <BrowserApp />;
        } else if (appName === 'SQL Database') {
            component = <SqlApp />;
        }

        openWindow(appName, appName, component);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, isOpen: true });
    };

    const closeContextMenu = () => {
        if (contextMenu.isOpen) setContextMenu({ ...contextMenu, isOpen: false });
    };

    const handleSetWallpaper = (key: string) => {
        setWallpaper(WALLPAPERS[key as keyof typeof WALLPAPERS]);
        closeContextMenu();
    };


    return (
        <div
            className="desktop-container"
            onClick={closeContextMenu}
            onContextMenu={handleContextMenu}
            style={{
                height: '100vh',
                width: '100vw',
                background: wallpaper,
                backgroundColor: !wallpaper.includes('url') ? wallpaper : 'var(--desktop-bg)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <div className="desktop-icons" style={{ padding: 10, display: 'flex', flexDirection: 'column', flexWrap: 'wrap', height: 'calc(100% - 40px)', alignContent: 'flex-start', position: 'relative', zIndex: 0 }}>
                <DesktopIcon
                    label="My PC"
                    iconUrl="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png"
                    onOpen={() => handleOpenApp('My PC')}
                />
                <DesktopIcon
                    label="My Documents"
                    iconUrl="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png"
                    onOpen={() => handleOpenApp('My Documents')}
                />
                <DesktopIcon
                    label="SQL Database"
                    iconUrl="https://win98icons.alexmeub.com/icons/png/settings_gear-0.png"
                    onOpen={() => handleOpenApp('SQL Database')}
                />
                <DesktopIcon
                    label="Terminal"
                    iconUrl="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png"
                    onOpen={() => handleOpenApp('Terminal')}
                />
                <DesktopIcon
                    label="Internet"
                    iconUrl="https://win98icons.alexmeub.com/icons/png/msie1-0.png"
                    onOpen={() => handleOpenApp('Internet')}
                />
            </div>

            {windows.map(win => (
                !win.isMinimized && (
                    <WindowFrame
                        key={win.id}
                        id={win.id}
                        title={win.title}
                        zIndex={win.zIndex}
                        isActive={true}
                        isMaximized={win.isMaximized}
                    >
                        {win.component}
                    </WindowFrame>
                )
            ))}

            {contextMenu.isOpen && (
                <div style={{
                    position: 'absolute',
                    top: contextMenu.y,
                    left: contextMenu.x,
                    zIndex: 9999,
                    backgroundColor: 'var(--window-bg)',
                    border: '2px solid',
                    borderColor: '#dfdfdf #000 #000 #dfdfdf',
                    width: '150px',
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                    <div className="menu-item" style={{ padding: '4px 8px', borderBottom: '1px solid #808080', color: '#808080' }}>
                        Active Desktop
                    </div>
                    <div className="menu-item" style={{ padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleSetWallpaper('Classic Teal')}>
                        Reset Wallpaper
                    </div>
                    <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '2px 0' }} />
                    <div className="menu-item" style={{ padding: '4px 8px', fontWeight: 'bold' }}>Wallpapers:</div>
                    <div className="menu-item hover-item" style={{ padding: '4px 16px', cursor: 'pointer' }} onClick={() => handleSetWallpaper('Matrix')}>
                        Matrix
                    </div>
                    <div className="menu-item hover-item" style={{ padding: '4px 16px', cursor: 'pointer' }} onClick={() => handleSetWallpaper('Stars')}>
                        Stars
                    </div>
                    <div className="menu-item hover-item" style={{ padding: '4px 16px', cursor: 'pointer' }} onClick={() => handleSetWallpaper('Black')}>
                        Black
                    </div>
                    <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '2px 0' }} />
                    <div className="menu-item hover-item" style={{ padding: '4px 8px', cursor: 'pointer' }} onClick={() => window.location.reload()}>
                        Refresh
                    </div>
                </div>
            )}

            <Taskbar />
        </div>
    );
};
