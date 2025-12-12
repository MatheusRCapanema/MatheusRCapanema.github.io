import React, { useState } from 'react';

const FAVORITES = [
    { name: 'X Tweet Analyzer', url: 'https://x-tweet-analyser.streamlit.app/?embed=true' },
    { name: 'Vocacional', url: 'https://vocacional-beta.vercel.app/' },
    { name: 'My GitHub', url: 'https://github.com/MatheusRCapanema' },
    { name: 'Google', url: 'https://www.google.com/webhp?igu=1' }
];

export const BrowserApp: React.FC = () => {
    const [url, setUrl] = useState('https://vocacional-beta.vercel.app/');
    const [currentUrl, setCurrentUrl] = useState('https://vocacional-beta.vercel.app/');
    const [history, setHistory] = useState<string[]>(['https://vocacional-beta.vercel.app/']);
    const [historyIndex, setHistoryIndex] = useState(0);

    const handleNavigate = (newUrl: string) => {
        let finalUrl = newUrl;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }
        setCurrentUrl(finalUrl);
        setUrl(finalUrl);

        // Add to history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(finalUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCurrentUrl(history[newIndex]);
            setUrl(history[newIndex]);
        }
    };

    const handleForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCurrentUrl(history[newIndex]);
            setUrl(history[newIndex]);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', fontFamily: 'sans-serif' }}>
            {/* Toolbar */}
            <div style={{ padding: '4px', borderBottom: '2px solid #808080', display: 'flex', gap: 4, alignItems: 'center' }}>
                <button onClick={handleBack} disabled={historyIndex === 0} className="retro-btn">Back</button>
                <button onClick={handleForward} disabled={historyIndex === history.length - 1} className="retro-btn">Forward</button>
                <button onClick={() => handleNavigate(url)} className="retro-btn">Reload</button>
                <button onClick={() => handleNavigate(FAVORITES[0].url)} className="retro-btn">Home</button>

                <div style={{ width: 2, borderLeft: '1px solid #808080', borderRight: '1px solid #fff', height: 20, margin: '0 4px' }} />

                <span>Location:</span>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavigate(url)}
                    style={{ flex: 1, padding: '2px 4px', boxShadow: 'inset 2px 2px #000', border: 'none' }}
                />
                <button onClick={() => handleNavigate(url)} className="retro-btn">Go</button>
            </div>

            {/* Favorites Bar */}
            <div style={{ padding: '4px', borderBottom: '2px solid #808080', display: 'flex', gap: 8, fontSize: '12px' }}>
                <strong>Bookmarks:</strong>
                {FAVORITES.map(fav => (
                    <span
                        key={fav.name}
                        onClick={() => handleNavigate(fav.url)}
                        style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
                    >
                        {fav.name}
                    </span>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, backgroundColor: '#fff', position: 'relative' }}>
                <iframe
                    src={currentUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Retro Browser"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
                {/* Helper overlay for X-Frame-Options issues */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffe0',
                    borderTop: '1px solid #000',
                    padding: 4,
                    fontSize: '11px',
                    textAlign: 'center',
                    opacity: 0.8
                }}>
                    Note: Some modern websites (like Google) block embedding. If you see a blank page, that's why!
                </div>
            </div>
        </div>
    );
};
