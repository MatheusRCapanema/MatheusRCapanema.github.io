import React, { useEffect, useState } from 'react';

interface BootScreenProps {
    onComplete: () => void;
}

const BOOT_SEQUENCE = [
    "RETRO-BIOS (C) 2024",
    "Rizzy Systems Inc.",
    "Version 1.0.0-alpha",
    "",
    "CPU: Intel 486DX2-66",
    "Memory Test: ", // Special case for memory counter
    "",
    "Detecting Primary Master ... Maxtor 540MB",
    "Detecting Primary Slave ... None",
    "Detecting Secondary Master ... CD-ROM Drive",
    "",
    "Loading OS ...",
    "Initializing Kernel ...",
    "Mounting File System ...",
    "",
    "System Ready."
];

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [memoryCount, setMemoryCount] = useState(0);


    useEffect(() => {
        if (currentLineIndex >= BOOT_SEQUENCE.length) {
            const timeout = setTimeout(onComplete, 1000);
            return () => clearTimeout(timeout);
        }

        const currentText = BOOT_SEQUENCE[currentLineIndex];

        if (currentText.startsWith("Memory Test:")) {
            // Start memory test
            setLines(prev => [...prev, currentText]);

            let ram = 0;
            const interval = setInterval(() => {
                ram += 1024; // 1MB chunks
                setMemoryCount(ram);
                if (ram >= 65536) { // 64MB
                    clearInterval(interval);
                    setLines(prev => {
                        const newLines = [...prev];
                        newLines[newLines.length - 1] = `Memory Test: ${ram}KB OK`;
                        return newLines;
                    });
                    // Proceed to next line after test
                    setCurrentLineIndex(prev => prev + 1);
                }
            }, 30);

            return () => clearInterval(interval);
        } else {
            // Normal line
            const timeout = setTimeout(() => {
                setLines(prev => [...prev, currentText]);
                setCurrentLineIndex(prev => prev + 1);
            }, Math.random() * 300 + 100);
            return () => clearTimeout(timeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLineIndex, onComplete]);

    return (
        <div style={{
            backgroundColor: '#000000',
            color: '#00FF00', // Green CRT
            fontFamily: "'VT323', monospace",
            fontSize: '24px',
            height: '100vh',
            padding: '40px',
            overflow: 'hidden',
            textShadow: '0 0 5px #00FF00'
        }}>
            {lines.map((line, i) => (
                <div key={i}>
                    {line.startsWith("Memory Test:") && line.includes(memoryCount.toString()) && !line.includes("OK")
                        ? `Memory Test: ${memoryCount}KB`
                        : line}
                </div>
            ))}
            <div className="cursor">_</div>

            <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        .cursor {
          animation: blink 1s infinite;
          display: inline-block;
        }
      `}</style>
        </div>
    );
};
