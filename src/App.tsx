import { useState } from 'react';
import { BootScreen } from './components/system/BootScreen';
import { Desktop } from './components/system/Desktop';
import { WindowManagerProvider } from './contexts/WindowManager';

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <WindowManagerProvider>
      <div className="app-container">
        {!booted ? (
          <BootScreen onComplete={() => setBooted(true)} />
        ) : (
          <Desktop />
        )}
      </div>
    </WindowManagerProvider>
  );
}

export default App;
