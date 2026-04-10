import React, { useState, useEffect, useRef } from 'react';
import { Power, Lock, ArrowRight, Home, Terminal, Folder, Image as ImageIcon, LayoutGrid, Bot, X, Minus, Square, ShoppingBag, Settings, RefreshCw, Palette, LogOut, Plus, ChevronRight, FileText, FileSpreadsheet, Wifi, Volume2, Battery, Bluetooth, Moon, Plane, Sun } from 'lucide-react';
import { FaChrome, FaGoogle } from 'react-icons/fa';
import { PSTerminal } from './components/PSTerminal';
import { AIPanel } from './components/AIPanel';
import { BrowserApp, WordApp, StoreApp, FilesApp, SettingsApp, TaskManagerApp, AVAILABLE_APPS } from './components/Apps';
import { AppId, WindowState, Tab, Message, FileNode, SystemSettings, NexusUser } from './types';
import { auth, signInWithGoogle, logOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [currentUser, setCurrentUser] = useState<NexusUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [time, setTime] = useState(new Date());
  const [bgMedia, setBgMedia] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  
  const [settings, setSettings] = useState<SystemSettings>({
    accentColor: 'red',
    taskbarPosition: 'left',
    taskbarOpacity: 60,
    backgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    showDesktopClock: true,
    desktopClockSize: 'medium',
    desktopClockPosition: { x: window.innerWidth ? window.innerWidth - 320 : 800, y: 32 }
  });

  const [installedApps, setInstalledApps] = useState<string[]>(['browser', 'ps-terminal', 'files', 'store', 'settings']);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowStartPos = useRef({ x: 0, y: 0 });

  const [draggingClock, setDraggingClock] = useState(false);
  const clockDragStartPos = useRef({ x: 0, y: 0 });
  const clockStartPos = useRef({ x: 0, y: 0 });

  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', name: 'main.ts', content: 'console.log("Hello Nexus OS");', group: 'Core' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Nexus OS PS+- Terminal initialized.', 'Ready for input...']);
  
  // Virtual File System State
  const [fileSystem, setFileSystem] = useState<FileNode[]>([
    { id: 'root', name: 'This PC', isFolder: true, parentId: null },
    { id: 'c-drive', name: 'Local Disk (C:)', isFolder: true, parentId: 'root', storage: { used: 120, total: 500, unit: 'GB' } },
    { id: 'd-drive', name: 'Data (D:)', isFolder: true, parentId: 'root', storage: { used: 850, total: 1000, unit: 'GB' } },
    { id: 'e-drive', name: 'Games (E:)', isFolder: true, parentId: 'root', storage: { used: 1800, total: 2000, unit: 'GB' } },
    { id: 'f-drive', name: 'Backup (F:)', isFolder: true, parentId: 'root', storage: { used: 450, total: 4000, unit: 'GB' } },
    { id: 'desktop', name: 'Desktop', isFolder: true, parentId: 'c-drive' },
    { id: 'docs', name: 'Documents', isFolder: true, parentId: 'c-drive' },
    { id: 'downloads', name: 'Downloads', isFolder: true, parentId: 'c-drive' },
    { id: 'readme', name: 'README.txt', isFolder: false, parentId: 'desktop', content: 'Welcome to Nexus OS!\n\nYou can use the AI panel to generate code, or explore the file system.' }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am Nexus AI. I can help you code, open apps, and manage your system. Try asking me to "open the browser", "write a python script", or "create a file called notes.txt".' }
  ]);

  const [contextMenu, setContextMenu] = useState<{x: number, y: number, show: boolean, type: 'desktop' | 'taskbar' | 'app' | 'clock' | 'window' | 'files', targetId?: string}>({ x: 0, y: 0, show: false, type: 'desktop' });
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [desktopDragStart, setDesktopDragStart] = useState<{x: number, y: number} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
        setIsLocked(false);
      } else {
        setCurrentUser(null);
        setIsLocked(true);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingWindow) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
        
        setWindows(prev => prev.map(w => {
          if (w.id === draggingWindow && !w.isMaximized) {
            return {
              ...w,
              x: windowStartPos.current.x + deltaX,
              y: windowStartPos.current.y + deltaY
            };
          }
          return w;
        }));
      }

      if (draggingClock) {
        const deltaX = e.clientX - clockDragStartPos.current.x;
        const deltaY = e.clientY - clockDragStartPos.current.y;
        setSettings(s => ({
          ...s,
          desktopClockPosition: {
            x: clockStartPos.current.x + deltaX,
            y: clockStartPos.current.y + deltaY
          }
        }));
      }
    };

    const handleMouseUp = () => {
      setDraggingWindow(null);
      setDraggingClock(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingWindow, draggingClock]);

  const handleWindowDragStart = (e: React.MouseEvent, id: string, currentX: number, currentY: number) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    setDraggingWindow(id);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    windowStartPos.current = { x: currentX, y: currentY };
    focusWindow(id);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Failed to sign in", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsLocked(true);
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgMedia(url);
      setIsVideo(file.type.startsWith('video/'));
    }
  };

  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setDesktopDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDesktopMouseUp = (e: React.MouseEvent) => {
    if (desktopDragStart) {
      const deltaY = desktopDragStart.y - e.clientY;
      if (deltaY > 100) {
        setIsTaskViewOpen(true);
      }
      setDesktopDragStart(null);
    }
  };

  const handleDesktopTouchStart = (e: React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      setDesktopDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleDesktopTouchEnd = (e: React.TouchEvent) => {
    if (desktopDragStart) {
      const deltaY = desktopDragStart.y - e.changedTouches[0].clientY;
      if (deltaY > 100) {
        setIsTaskViewOpen(true);
      }
      setDesktopDragStart(null);
    }
  };

  const handleDesktopWheel = (e: React.WheelEvent) => {
    if (e.target === e.currentTarget && e.deltaY > 50) {
      setIsTaskViewOpen(true);
    }
  };

  const handleClockMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingClock(true);
    clockDragStartPos.current = { x: e.clientX, y: e.clientY };
    clockStartPos.current = settings.desktopClockPosition || { x: window.innerWidth - 320, y: 32 };
  };

  const renderClock = () => {
    const style = settings.desktopClockStyle || 'default';
    const size = settings.desktopClockSize || 'medium';
    
    const scale = size === 'small' ? 'scale-75' : size === 'large' ? 'scale-150' : 'scale-100';

    if (style === 'flip') {
      const hours = time.getHours() % 12 || 12;
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
      return (
        <div className={`flex gap-2 items-center bg-[#0a0a0a] p-6 rounded-3xl shadow-2xl border border-white/5 ${scale} origin-top-left`}>
          <div className="relative bg-[#1a1a1a] text-[#a0a0a0] text-8xl font-bold px-6 py-8 rounded-2xl overflow-hidden shadow-inner">
            <div className="absolute inset-x-0 top-1/2 h-1 bg-[#0a0a0a] z-10 -translate-y-1/2"></div>
            {hours.toString().padStart(2, '0')}
            <div className="absolute bottom-2 left-3 text-xl font-bold text-[#606060] z-20">{ampm}</div>
          </div>
          <div className="relative bg-[#1a1a1a] text-[#a0a0a0] text-8xl font-bold px-6 py-8 rounded-2xl overflow-hidden shadow-inner">
            <div className="absolute inset-x-0 top-1/2 h-1 bg-[#0a0a0a] z-10 -translate-y-1/2"></div>
            {minutes}
          </div>
        </div>
      );
    }

    if (style === 'futuristic') {
      return (
        <div className={`flex flex-col items-center justify-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${scale} origin-top-left`}>
          <div className="text-6xl font-bold tracking-[0.3em] uppercase" style={{ fontFamily: 'monospace, sans-serif' }}>
            {time.toLocaleDateString([], { weekday: 'long' })}
          </div>
          <div className="text-2xl tracking-[0.2em] mt-4 uppercase font-light">
            {time.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-xl tracking-[0.2em] mt-2 font-light">
            - {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
          </div>
        </div>
      );
    }

    if (style === 'analog') {
      const secondsDegrees = time.getSeconds() * 6;
      const minsDegrees = time.getMinutes() * 6 + time.getSeconds() * 0.1;
      const hourDegrees = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
      return (
        <div className={`relative w-64 h-64 rounded-full border-8 border-[#1a2b3c] bg-[#0f1f2f] shadow-2xl flex items-center justify-center ${scale} origin-top-left`}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="w-1 h-4 bg-[#4a5b6c] mt-2 rounded-full"></div>
              <div className="absolute top-8 text-white/80 font-semibold text-xl" style={{ transform: `rotate(-${i * 30}deg)` }}>
                {i === 0 ? 12 : i}
              </div>
            </div>
          ))}
          <div className="absolute w-2 h-16 bg-white rounded-full origin-bottom bottom-1/2 shadow-lg" style={{ transform: `rotate(${hourDegrees}deg)` }}></div>
          <div className="absolute w-1.5 h-24 bg-white/90 rounded-full origin-bottom bottom-1/2 shadow-lg" style={{ transform: `rotate(${minsDegrees}deg)` }}></div>
          <div className="absolute w-0.5 h-28 bg-orange-500 rounded-full origin-bottom bottom-1/2 shadow-lg" style={{ transform: `rotate(${secondsDegrees}deg)` }}></div>
          <div className="absolute w-4 h-4 bg-[#0f1f2f] rounded-full z-10 border-4 border-orange-500"></div>
        </div>
      );
    }

    // Default
    return (
      <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl ${
        size === 'small' ? 'p-4' : 
        size === 'large' ? 'p-10' : 'p-6'
      }`}>
        <h2 className={`font-light tracking-tighter ${
          size === 'small' ? 'text-3xl' : 
          size === 'large' ? 'text-7xl' : 'text-5xl'
        }`}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h2>
        <p className={`text-white/50 mt-2 ${
          size === 'small' ? 'text-sm' : 
          size === 'large' ? 'text-xl' : 'text-base'
        }`}>{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
    );
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const menuWidth = 260;
    const menuHeight = 280;
    const x = Math.min(e.pageX, window.innerWidth - menuWidth);
    const y = Math.min(e.pageY, window.innerHeight - menuHeight);
    setContextMenu({ x, y, show: true, type: 'desktop' });
  };

  const handleTaskbarContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 260;
    const menuHeight = 280;
    const x = Math.min(e.pageX, window.innerWidth - menuWidth);
    const y = Math.min(e.pageY, window.innerHeight - menuHeight);
    setContextMenu({ x, y, show: true, type: 'taskbar' });
  };

  const handleAppContextMenu = (e: React.MouseEvent, appId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 260;
    const menuHeight = 180;
    const x = Math.min(e.pageX, window.innerWidth - menuWidth);
    const y = Math.min(e.pageY, window.innerHeight - menuHeight);
    setContextMenu({ x, y, show: true, type: 'app', targetId: appId });
  };

  const closeContextMenu = () => {
    if (contextMenu.show) setContextMenu(prev => ({ ...prev, show: false }));
    if (isQuickSettingsOpen) setIsQuickSettingsOpen(false);
  };

  const triggerBgUpload = () => {
    fileInputRef.current?.click();
  };

  const getAppTitle = (appId: AppId) => {
    const appInfo = AVAILABLE_APPS.find(a => a.id === appId);
    if (appInfo) return appInfo.name;
    switch(appId) {
      case 'ps-terminal': return 'PS+- Terminal Workspace';
      case 'browser': return 'Nexus Browser';
      case 'files': return 'File Explorer';
      case 'store': return 'Microsoft Store';
      case 'settings': return 'Settings';
      case 'taskmanager': return 'Task Manager';
      default: return 'Application';
    }
  };

  const openWindow = (appId: AppId) => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        return prev.map(w => w.appId === appId ? { ...w, isOpen: true, isMinimized: false, zIndex: Date.now() } : w);
      }
      const offset = prev.length * 30;
      return [...prev, { 
        id: Date.now().toString(), 
        appId, 
        title: getAppTitle(appId), 
        isOpen: true, 
        isMinimized: false, 
        isMaximized: false, 
        zIndex: Date.now(),
        x: 80 + offset,
        y: 40 + offset
      }];
    });
    setIsAppDrawerOpen(false);
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false, zIndex: Date.now() } : w));
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const minimizeAllWindows = () => {
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: Date.now(), isMinimized: false } : w));
  };

  const handleOpenFile = (file: FileNode) => {
    setTabs(prev => {
      const existing = prev.find(t => t.name === file.name);
      if (existing) {
        setActiveTabId(existing.id);
        return prev;
      }
      const newTab = { id: Date.now().toString(), name: file.name, content: file.content || '', group: 'Files' };
      setActiveTabId(newTab.id);
      return [...prev, newTab];
    });
    openWindow('ps-terminal');
  };

  const handleCreateFile = (name: string, parentId: string) => {
    setFileSystem(prev => [...prev, { id: Date.now().toString(), name, isFolder: false, parentId, content: '' }]);
  };

  const handleCreateFolder = (name: string, parentId: string) => {
    setFileSystem(prev => [...prev, { id: Date.now().toString(), name, isFolder: true, parentId }]);
  };

  const handleAICommand = (cmdStr: string) => {
    const parts = cmdStr.split(':').map(s => s.trim());
    const action = parts[0];
    
    if (action === 'OPEN_APP') {
      const appId = parts[1] as AppId;
      openWindow(appId);
    } else if (action === 'WRITE_CODE') {
      const rest = cmdStr.substring(cmdStr.indexOf(':') + 1).trim();
      const [filename, ...codeParts] = rest.split('|');
      const code = codeParts.join('|').trim();
      
      setTabs(prev => {
        const existing = prev.find(t => t.name === filename.trim());
        if (existing) {
          return prev.map(t => t.name === filename.trim() ? { ...t, content: code } : t);
        } else {
          const newTab = { id: Date.now().toString(), name: filename.trim(), content: code, group: 'AI Generated' };
          setActiveTabId(newTab.id);
          return [...prev, newTab];
        }
      });
      openWindow('ps-terminal');
    } else if (action === 'CREATE_FILE') {
      const rest = cmdStr.substring(cmdStr.indexOf(':') + 1).trim();
      const [filename, ...contentParts] = rest.split('|');
      const content = contentParts.join('|').trim();
      
      setFileSystem(prev => [...prev, {
        id: Date.now().toString(),
        name: filename.trim(),
        isFolder: false,
        parentId: 'root',
        content: content
      }]);
      openWindow('files');
    }
  };

  const renderWindowContent = (appId: AppId) => {
    const appInfo = AVAILABLE_APPS.find(a => a.id === appId);
    
    if (appInfo && appInfo.url) {
      return (
        <div className="w-full h-full bg-white rounded-b-xl overflow-hidden relative">
          <iframe src={appInfo.url} className="w-full h-full border-none" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" title={appInfo.name} />
        </div>
      );
    }

    switch(appId) {
      case 'ps-terminal': return <PSTerminal tabs={tabs} setTabs={setTabs} activeTabId={activeTabId} setActiveTabId={setActiveTabId} terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput} />;
      case 'browser': return <BrowserApp />;
      case 'word': return <WordApp />;
      case 'store': return <StoreApp installedApps={installedApps} onInstall={(id) => setInstalledApps(prev => [...prev, id])} openWindow={openWindow} />;
      case 'files': return <FilesApp fileSystem={fileSystem} onOpenFile={handleOpenFile} onCreateFile={handleCreateFile} onCreateFolder={handleCreateFolder} onContextMenu={(e, folderId) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.pageX, y: e.pageY, show: true, type: 'files', targetId: folderId });
      }} />;
      case 'settings': return <SettingsApp settings={settings} setSettings={setSettings} triggerBgUpload={triggerBgUpload} currentUser={currentUser} />;
      case 'taskmanager': return <TaskManagerApp windows={windows} closeWindow={closeWindow} />;
      default: return (
        <div className="p-8 text-white/50 text-center flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] rounded-b-xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            {appInfo?.icon && <appInfo.icon size={32} className={appInfo.color} />}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{appInfo?.name || 'Application'}</h3>
          <p className="max-w-xs">Because Nexus OS runs in your web browser, it cannot execute native desktop applications directly.</p>
        </div>
      );
    }
  };

  // Dynamic Styles based on Settings
  const getAccentColor = () => {
    switch (settings.accentColor) {
      case 'blue': return { bg: 'bg-blue-600', hover: 'hover:bg-blue-500', text: 'text-blue-400', shadow: 'shadow-blue-500/30', border: 'border-blue-500/50', gradient: 'from-blue-600 to-blue-400' };
      case 'green': return { bg: 'bg-green-600', hover: 'hover:bg-green-500', text: 'text-green-400', shadow: 'shadow-green-500/30', border: 'border-green-500/50', gradient: 'from-green-600 to-green-400' };
      case 'purple': return { bg: 'bg-purple-600', hover: 'hover:bg-purple-500', text: 'text-purple-400', shadow: 'shadow-purple-500/30', border: 'border-purple-500/50', gradient: 'from-purple-600 to-purple-400' };
      case 'orange': return { bg: 'bg-orange-600', hover: 'hover:bg-orange-500', text: 'text-orange-400', shadow: 'shadow-orange-500/30', border: 'border-orange-500/50', gradient: 'from-orange-600 to-orange-400' };
      case 'red':
      default: return { bg: 'bg-red-600', hover: 'hover:bg-red-500', text: 'text-red-400', shadow: 'shadow-red-500/30', border: 'border-red-500/50', gradient: 'from-red-600 to-red-400' };
    }
  };
  const accent = getAccentColor();

  const getBgGradient = () => {
    switch (settings.accentColor) {
      case 'blue': return 'from-blue-950 via-black to-blue-900';
      case 'green': return 'from-green-950 via-black to-green-900';
      case 'purple': return 'from-purple-950 via-black to-purple-900';
      case 'orange': return 'from-orange-950 via-black to-orange-900';
      case 'red':
      default: return 'from-red-950 via-black to-red-900';
    }
  };

  const getTaskbarClasses = () => {
    switch (settings.taskbarPosition) {
      case 'bottom':
        return 'absolute bottom-0 left-0 right-0 h-14 backdrop-blur-2xl border-t border-white/10 z-50 flex flex-row items-center px-4 justify-between';
      case 'mac':
        return 'absolute bottom-4 left-1/2 -translate-x-1/2 h-16 rounded-2xl backdrop-blur-2xl border border-white/10 z-50 flex flex-row items-center px-6 justify-between gap-8 shadow-2xl';
      case 'left':
      default:
        return 'absolute left-0 top-0 bottom-0 w-14 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col items-center py-4 justify-between';
    }
  };

  const getDesktopStyle = () => {
    switch (settings.taskbarPosition) {
      case 'bottom': return { top: 0, left: 0, right: 0, bottom: '3.5rem' };
      case 'mac': return { top: 0, left: 0, right: 0, bottom: '5rem' };
      case 'left':
      default: return { top: 0, right: 0, bottom: 0, left: '3.5rem' };
    }
  };

  const getTooltipClasses = () => {
    switch (settings.taskbarPosition) {
      case 'bottom':
      case 'mac':
        return 'absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-white/10';
      case 'left':
      default:
        return 'absolute left-14 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-white/10';
    }
  };

  const getSeparatorClasses = () => {
    switch (settings.taskbarPosition) {
      case 'bottom':
      case 'mac':
        return 'w-[1px] h-8 bg-white/10 mx-1';
      case 'left':
      default:
        return 'w-8 h-[1px] bg-white/10 my-1';
    }
  };

  const getQuickSettingsPosition = () => {
    switch (settings.taskbarPosition) {
      case 'left': return 'left-16 bottom-4';
      case 'mac': return 'bottom-24 right-4';
      case 'bottom':
      default: return 'bottom-16 right-4';
    }
  };

  const flexDir = (settings.taskbarPosition === 'left') ? 'flex-col' : 'flex-row';
  const isVerticalTaskbar = settings.taskbarPosition === 'left';

  if (!isAuthReady) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLocked || !currentUser) {
    return (
      <div className="w-screen h-screen relative overflow-hidden flex flex-col items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          {bgMedia ? (
            isVideo ? (
              <video src={bgMedia} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
            ) : (
              <img src={bgMedia} className="w-full h-full object-cover opacity-60" alt="bg" />
            )
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getBgGradient()} opacity-80`} />
          )}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
        
        <div className="z-10 flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-8xl font-light text-white tracking-tighter mb-2">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <p className="text-xl text-white/70 font-medium tracking-wide">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center gap-6 w-96">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${accent.gradient} flex items-center justify-center shadow-lg ${accent.shadow}`}>
              <Lock size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Nexus OS</h2>
            <p className="text-white/60 text-sm text-center mb-2">Sign in to access your workspace, files, and personalized settings.</p>
            
            <button 
              onClick={handleGoogleSignIn}
              className={`w-full bg-white text-black hover:bg-gray-200 rounded-xl px-4 py-3 font-medium transition-colors flex items-center justify-center gap-3`}
            >
              <FaGoogle size={18} />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-black font-sans text-white" onClick={closeContextMenu}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {bgMedia ? (
          isVideo ? (
            <video src={bgMedia} autoPlay loop muted className="w-full h-full object-cover" />
          ) : (
            <img src={bgMedia} className="w-full h-full object-cover" alt="bg" />
          )
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getBgGradient()}`} />
        )}
      </div>

      {/* Desktop Area */}
      <div 
        className="absolute z-10" 
        style={getDesktopStyle()} 
        onContextMenu={handleDesktopContextMenu}
        onMouseDown={handleDesktopMouseDown}
        onMouseUp={handleDesktopMouseUp}
        onTouchStart={handleDesktopTouchStart}
        onTouchEnd={handleDesktopTouchEnd}
        onWheel={handleDesktopWheel}
      >
        {/* Desktop Widgets */}
        {settings.showDesktopClock !== false && (
          <div 
            className={`absolute flex flex-col gap-4 z-0 cursor-move ${draggingClock ? 'opacity-80 scale-105 transition-none' : 'transition-transform'}`}
            style={{ 
              left: settings.desktopClockPosition?.x ?? (window.innerWidth - 320), 
              top: settings.desktopClockPosition?.y ?? 32 
            }}
            onMouseDown={handleClockMouseDown}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setContextMenu({ x: e.pageX, y: e.pageY, show: true, type: 'clock' });
            }}
          >
            {renderClock()}
          </div>
        )}

        {/* Windows */}
        {windows.map(win => {
          const appInfo = AVAILABLE_APPS.find(a => a.id === win.appId);
          const Icon = appInfo?.icon || Terminal;
          const iconColor = appInfo?.color || 'text-white';

          const isDraggingThis = draggingWindow === win.id;
          const baseClasses = `absolute bg-black/80 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden ${isDraggingThis ? 'transition-none' : 'transition-all duration-300'}`;
          const normalClasses = "w-[800px] h-[600px] rounded-xl";
          const maximizedClasses = "inset-0 w-full h-full rounded-none";
          const minimizedClasses = "opacity-0 pointer-events-none scale-95 translate-y-10";
          
          const windowClasses = `${baseClasses} ${win.isMaximized ? maximizedClasses : normalClasses} ${win.isMinimized ? minimizedClasses : 'opacity-100 scale-100'}`;

          const style: React.CSSProperties = { zIndex: win.zIndex };
          if (!win.isMaximized) {
            style.left = win.x ?? 80;
            style.top = win.y ?? 40;
          }

          return (
            <div 
              key={win.id}
              onMouseDown={() => focusWindow(win.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContextMenu({ x: e.pageX, y: e.pageY, show: true, type: 'window', targetId: win.id });
              }}
              className={windowClasses}
              style={style}
            >
              {/* Window Header */}
              <div 
                className={`h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 select-none ${!win.isMaximized ? 'cursor-grab active:cursor-grabbing' : ''}`}
                onDoubleClick={() => toggleMaximizeWindow(win.id)}
                onMouseDown={(e) => !win.isMaximized && handleWindowDragStart(e, win.id, win.x ?? 80, win.y ?? 40)}
              >
                <div className="flex items-center gap-3">
                  {win.appId === 'store' ? <ShoppingBag size={14} className="text-blue-400" /> : 
                   win.appId === 'files' ? <Folder size={14} className="text-blue-400" /> :
                   win.appId === 'settings' ? <Settings size={14} className="text-slate-300" /> :
                   <Icon size={14} className={iconColor} />}
                  <span className="text-xs font-medium text-white/80">{win.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }} className="text-white/40 hover:text-white p-1 rounded hover:bg-white/10"><Minus size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); toggleMaximizeWindow(win.id); }} className="text-white/40 hover:text-white p-1 rounded hover:bg-white/10"><Square size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} className="text-white/40 hover:text-red-400 p-1 rounded hover:bg-red-500/20"><X size={14} /></button>
                </div>
              </div>
              {/* Window Content */}
              {renderWindowContent(win.appId)}
            </div>
          );
        })}
      </div>

      {/* Task View / Overview Mode */}
      {isTaskViewOpen && (
        <div 
          className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-200" 
          onClick={() => setIsTaskViewOpen(false)}
        >
          <div className="text-white text-3xl mb-12 font-light tracking-wide">Recent Apps</div>
          <div className="flex gap-8 overflow-x-auto max-w-full px-12 pb-8 snap-x items-center custom-scrollbar">
            {windows.length === 0 ? (
              <div className="text-white/50 text-lg">No recent apps</div>
            ) : (
              windows.map(win => {
                const appInfo = AVAILABLE_APPS.find(a => a.id === win.appId);
                const Icon = appInfo?.icon || LayoutGrid;
                return (
                  <div 
                    key={win.id} 
                    className="snap-center shrink-0 w-72 h-[26rem] bg-[#202020]/80 rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden hover:-translate-y-4 transition-transform cursor-pointer group relative"
                    onClick={(e) => { e.stopPropagation(); focusWindow(win.id); setIsTaskViewOpen(false); }}
                  >
                    <div className="h-14 bg-black/60 flex items-center px-4 gap-3 border-b border-white/10">
                      <Icon size={24} className={appInfo?.color || 'text-white'} />
                      <span className="text-white font-medium truncate text-lg">{win.title}</span>
                      <button 
                        className="ml-auto w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                        onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                      <Icon size={80} className={`${appInfo?.color || 'text-white'} opacity-40 group-hover:scale-110 transition-transform duration-500`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className={getTaskbarClasses()} onContextMenu={handleTaskbarContextMenu} style={{ backgroundColor: `rgba(0, 0, 0, ${(settings.taskbarOpacity ?? 60) / 100})` }}>
        <div className={`flex ${flexDir} gap-4 items-center`}>
          <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all group relative">
            <Home size={20} />
            <span className={getTooltipClasses()}>Home</span>
          </button>
          
          <div className={getSeparatorClasses()} />

          {Array.from(new Set(['browser', 'ps-terminal', 'files', 'store', 'settings', ...windows.map(w => w.appId)])).map(appId => {
            const appInfo = AVAILABLE_APPS.find(a => a.id === appId);
            if (!appInfo) return null;
            const Icon = appInfo.icon;
            const isOpen = windows.some(w => w.appId === appId);
            const isActive = windows.some(w => w.appId === appId && !w.isMinimized && w.zIndex === Math.max(...windows.map(w => w.zIndex), 0));
            
            const handleTaskbarClick = () => {
              const win = windows.find(w => w.appId === appId);
              if (win) {
                const isTopmost = win.zIndex === Math.max(...windows.map(w => w.zIndex));
                if (win.isMinimized) {
                  focusWindow(win.id);
                } else if (isTopmost) {
                  minimizeWindow(win.id);
                } else {
                  focusWindow(win.id);
                }
              } else {
                openWindow(appId as AppId);
              }
            };

            return (
              <button key={appId} onClick={handleTaskbarClick} onContextMenu={(e) => handleAppContextMenu(e, appId)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
                <Icon size={22} className={appInfo.color + " drop-shadow-md"} />
                <span className={getTooltipClasses()}>{appInfo.name}</span>
                {isOpen && (
                  <div className={`absolute ${settings.taskbarPosition === 'left' ? 'left-0 top-1/2 -translate-y-1/2 w-1 h-4' : 'bottom-0 left-1/2 -translate-x-1/2 w-4 h-1'} bg-white/70 rounded-full`} />
                )}
              </button>
            );
          })}

          <div className={getSeparatorClasses()} />

          <button onClick={() => setIsAppDrawerOpen(!isAppDrawerOpen)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${isAppDrawerOpen ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>
            <LayoutGrid size={20} />
            <span className={getTooltipClasses()}>App Drawer</span>
          </button>
        </div>

        <div className={`flex ${flexDir} gap-4 items-center`}>
          <button onClick={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)} className={`${isVerticalTaskbar ? 'w-10 py-3 flex-col gap-1.5' : 'h-10 px-3 flex-row gap-2'} rounded-xl flex items-center justify-center transition-all group relative ${isQuickSettingsOpen ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>
            <Wifi size={isVerticalTaskbar ? 14 : 16} />
            <Volume2 size={isVerticalTaskbar ? 14 : 16} />
            <Battery size={isVerticalTaskbar ? 14 : 16} />
            <span className={getTooltipClasses()}>Quick Settings</span>
          </button>

          <input type="file" ref={fileInputRef} onChange={handleBgUpload} accept="image/*,video/*" className="hidden" />
          <button onClick={triggerBgUpload} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all group relative hidden md:flex">
            <ImageIcon size={18} />
            <span className={getTooltipClasses()}>Personalize BG</span>
          </button>

          <button onClick={() => setIsAIPanelOpen(!isAIPanelOpen)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg group relative ${isAIPanelOpen ? `${accent.bg} text-white ${accent.shadow}` : `${accent.bg}/80 ${accent.hover} text-white/90 hover:text-white`}`}>
            <Bot size={20} />
            <span className={getTooltipClasses()}>Nexus AI</span>
          </button>

          <button onClick={handleSignOut} className={`w-10 h-10 rounded-xl hover:bg-red-500/20 flex items-center justify-center text-white/50 hover:text-red-400 transition-all ${settings.taskbarPosition === 'left' ? 'mt-2' : 'ml-2'}`}>
            <Power size={18} />
            <span className={getTooltipClasses()}>Sign Out</span>
          </button>
        </div>
      </div>

      {/* App Drawer Overlay */}
      {isAppDrawerOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-40 flex flex-col items-center justify-center" onClick={() => setIsAppDrawerOpen(false)} onContextMenu={handleDesktopContextMenu}>
          <div className="w-full max-w-4xl p-8" onClick={e => e.stopPropagation()}>
            <div className="relative mb-12">
              <input type="text" placeholder="Search apps, files, or ask Nexus AI..." className={`w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-lg text-white placeholder:text-white/40 outline-none focus:${accent.border} focus:bg-white/15 transition-all shadow-2xl`} autoFocus />
            </div>
            
            <div className="grid grid-cols-6 gap-8">
              {AVAILABLE_APPS.filter(app => installedApps.includes(app.id)).map((app, i) => (
                <div key={i} onClick={() => openWindow(app.id as AppId)} className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all shadow-lg">
                    <app.icon size={32} className={app.color} />
                  </div>
                  <span className="text-xs text-white/70 group-hover:text-white font-medium text-center">{app.name}</span>
                </div>
              ))}
              {fileSystem.filter(f => f.parentId === 'desktop').map((file, i) => (
                <div key={`desktop-${file.id}`} onClick={() => {
                   openWindow('files');
                   setIsAppDrawerOpen(false);
                }} className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all shadow-lg">
                    {file.isFolder ? <Folder size={32} className="text-blue-400" /> : <FileText size={32} className="text-slate-300" />}
                  </div>
                  <span className="text-xs text-white/70 group-hover:text-white font-medium text-center truncate w-full px-1">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Panel */}
      {isAIPanelOpen && (
        <AIPanel messages={messages} setMessages={setMessages} onClose={() => setIsAIPanelOpen(false)} onCommand={handleAICommand} />
      )}

      {/* Quick Settings Panel */}
      {isQuickSettingsOpen && (
        <div 
          className={`absolute ${getQuickSettingsPosition()} bg-[#202020]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-200 text-white ${isVerticalTaskbar ? 'w-80 flex flex-col' : 'flex flex-row gap-8 items-center'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`grid ${isVerticalTaskbar ? 'grid-cols-3 gap-3 mb-4' : 'grid-cols-2 gap-3'}`}>
            <div className="flex flex-col items-center gap-1">
              <button className="w-16 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"><Wifi size={18} /></button>
              <span className="text-[10px] text-white/70">Wi-Fi</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button className="w-16 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"><Bluetooth size={18} /></button>
              <span className="text-[10px] text-white/70">Bluetooth</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button className="w-16 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"><Plane size={18} /></button>
              <span className="text-[10px] text-white/70">Airplane</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button className="w-16 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"><Moon size={18} /></button>
              <span className="text-[10px] text-white/70">Night light</span>
            </div>
          </div>
          
          {!isVerticalTaskbar && <div className="w-[1px] h-20 bg-white/10" />}

          <div className={`space-y-4 ${isVerticalTaskbar ? '' : 'w-64'}`}>
            <div className="flex items-center gap-3">
              <Sun size={16} className="text-white/70" />
              <input type="range" className="flex-1 accent-blue-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" defaultValue={80} />
            </div>
            <div className="flex items-center gap-3">
              <Volume2 size={16} className="text-white/70" />
              <input type="range" className="flex-1 accent-blue-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" defaultValue={50} />
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="absolute z-[9999] w-64 bg-[#202020]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl py-2 text-sm text-white animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {contextMenu.type === 'desktop' && (
            <>
              <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={closeContextMenu}>
                <LayoutGrid size={16} className="text-white/70"/> View
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={closeContextMenu}>
                <RefreshCw size={16} className="text-white/70"/> Refresh
              </button>
              
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              
              <div className="relative group">
                <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <Plus size={16} className="text-white/70"/> New
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                </button>
                <div className={`absolute top-0 ${contextMenu.x > window.innerWidth - 300 ? 'right-full mr-1' : 'left-full ml-1'} hidden group-hover:block w-56 bg-[#202020]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl py-2 text-sm text-white`}>
                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { handleCreateFolder('New Folder', 'root'); openWindow('files'); closeContextMenu(); }}>
                    <Folder size={16} className="text-blue-400"/> Folder
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { handleCreateFile('New Text Document.txt', 'root'); openWindow('files'); closeContextMenu(); }}>
                    <FileText size={16} className="text-white/70"/> Text Document
                  </button>
                  {installedApps.includes('word') && (
                    <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { handleCreateFile('New Word Document.docx', 'root'); openWindow('files'); closeContextMenu(); }}>
                      <FileText size={16} className="text-blue-500"/> Word Document
                    </button>
                  )}
                  {installedApps.includes('excel') && (
                    <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { handleCreateFile('New Excel Document.xlsx', 'root'); openWindow('files'); closeContextMenu(); }}>
                      <FileSpreadsheet size={16} className="text-green-500"/> Excel Document
                    </button>
                  )}
                </div>
              </div>

              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              
              <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { openWindow('ps-terminal'); closeContextMenu(); }}>
                <Terminal size={16} className="text-white/70"/> Open in Terminal
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { openWindow('settings'); closeContextMenu(); }}>
                <Palette size={16} className="text-white/70"/> Personalize
              </button>
            </>
          )}

          {contextMenu.type === 'taskbar' && (
            <div className="py-1">
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors text-white/50" disabled>
                Toolbars <ChevronRight size={14} className="ml-auto" />
              </button>
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors text-white/50" disabled>
                Search <ChevronRight size={14} className="ml-auto" />
              </button>
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { minimizeAllWindows(); closeContextMenu(); }}>
                Show the desktop
              </button>
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { openWindow('taskmanager'); closeContextMenu(); }}>
                Task Manager
              </button>
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors text-white/50" disabled>
                Lock the taskbar
              </button>
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { openWindow('settings'); closeContextMenu(); }}>
                <Settings size={14} className="text-white/70"/> Taskbar settings
              </button>
            </div>
          )}

          {contextMenu.type === 'app' && (
            <div className="py-1">
              <div className="px-4 py-2 border-b border-white/10 mb-1">
                <span className="font-semibold text-white/90">{AVAILABLE_APPS.find(a => a.id === contextMenu.targetId)?.name}</span>
              </div>
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { openWindow(contextMenu.targetId as AppId); closeContextMenu(); }}>
                <LayoutGrid size={14} className="text-white/70"/> Open new window
              </button>
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors text-white/50" disabled>
                Pin to taskbar
              </button>
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              {windows.some(w => w.appId === contextMenu.targetId) && (
                <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => { 
                  windows.filter(w => w.appId === contextMenu.targetId).forEach(w => closeWindow(w.id)); 
                  closeContextMenu(); 
                }}>
                  <X size={14} /> Close window
                </button>
              )}
            </div>
          )}

          {contextMenu.type === 'clock' && (
            <div className="py-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Clock Size</div>
              <button className="w-full text-left px-4 py-2 hover:bg-blue-500 flex items-center gap-3 transition-colors" onClick={() => { setSettings(s => ({ ...s, desktopClockSize: 'small' })); closeContextMenu(); }}>Small</button>
              <button className="w-full text-left px-4 py-2 hover:bg-blue-500 flex items-center gap-3 transition-colors" onClick={() => { setSettings(s => ({ ...s, desktopClockSize: 'medium' })); closeContextMenu(); }}>Medium</button>
              <button className="w-full text-left px-4 py-2 hover:bg-blue-500 flex items-center gap-3 transition-colors" onClick={() => { setSettings(s => ({ ...s, desktopClockSize: 'large' })); closeContextMenu(); }}>Large</button>
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              <button className="w-full text-left px-4 py-2 hover:bg-red-500 flex items-center gap-3 transition-colors text-red-400 hover:text-white" onClick={() => { setSettings(s => ({ ...s, showDesktopClock: false })); closeContextMenu(); }}>Remove Clock</button>
            </div>
          )}
          {contextMenu.type === 'window' && (
            <div className="py-1">
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { closeContextMenu(); }}>
                <RefreshCw size={14} className="text-white/70"/> Refresh
              </button>
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { toggleMaximizeWindow(contextMenu.targetId!); closeContextMenu(); }}>
                <Square size={14} className="text-white/70"/> Maximize / Restore
              </button>
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { minimizeWindow(contextMenu.targetId!); closeContextMenu(); }}>
                <Minus size={14} className="text-white/70"/> Minimize
              </button>
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              <button className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-3 transition-colors text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => { closeWindow(contextMenu.targetId!); closeContextMenu(); }}>
                <X size={14} /> Close
              </button>
            </div>
          )}
          {contextMenu.type === 'files' && (
            <div className="py-1">
              <div className="relative group">
                <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <Plus size={16} className="text-white/70"/> New
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                </button>
                <div className={`absolute top-0 ${contextMenu.x > window.innerWidth - 300 ? 'right-full mr-1' : 'left-full ml-1'} hidden group-hover:block w-56 bg-[#202020]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl py-2 text-sm text-white`}>
                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { handleCreateFolder('New Folder', contextMenu.targetId!); closeContextMenu(); }}>
                    <Folder size={16} className="text-blue-400"/> Folder
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { handleCreateFile('New Text Document.txt', contextMenu.targetId!); closeContextMenu(); }}>
                    <FileText size={16} className="text-white/70"/> Text Document
                  </button>
                  {installedApps.includes('word') && (
                    <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { handleCreateFile('New Word Document.docx', contextMenu.targetId!); closeContextMenu(); }}>
                      <FileText size={16} className="text-blue-500"/> Word Document
                    </button>
                  )}
                  {installedApps.includes('excel') && (
                    <button className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors" onClick={() => { handleCreateFile('New Excel Document.xlsx', contextMenu.targetId!); closeContextMenu(); }}>
                      <FileSpreadsheet size={16} className="text-green-500"/> Excel Document
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
