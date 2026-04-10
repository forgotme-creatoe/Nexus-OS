import React, { useState, useEffect } from 'react';
import { FaChrome, FaSlack, FaDiscord, FaFileWord, FaFileExcel, FaEdge, FaYoutube, FaWikipediaW, FaPenNib, FaCode } from 'react-icons/fa';
import { TbBrandVscode, TbBrandZoom, TbBrandSpotify } from 'react-icons/tb';
import { ShoppingBag, Download, Check, Star, Search, Folder as FolderIcon, FileText, ChevronRight, ChevronDown, FilePlus, FolderPlus, HardDrive, Settings, Monitor, Palette, Cpu, Bot, Image as ImageIcon, Bluetooth, Wifi, User, Clock, Gamepad2, Accessibility, Shield, RefreshCw, Volume2, Bell, Moon, Battery, ToggleRight, ToggleLeft, LayoutGrid, Terminal, Activity, AlignLeft, Pin, Clock as ClockIcon } from 'lucide-react';
import { FileNode, SystemSettings, NexusUser } from '../types';

export const AVAILABLE_APPS = [
  // Real Web Apps (Iframe friendly)
  { id: 'excalidraw', name: 'Excalidraw', icon: FaPenNib, color: 'text-purple-400', author: 'Excalidraw', rating: 4.9, type: 'Real Web App', url: 'https://excalidraw.com', banner: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80' },
  { id: 'codepen', name: 'CodePen', icon: FaCode, color: 'text-white', author: 'CodePen', rating: 4.8, type: 'Real Web App', url: 'https://codepen.io/pen/', banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' },
  { id: 'youtube', name: 'YouTube Music', icon: FaYoutube, color: 'text-red-500', author: 'Google', rating: 4.7, type: 'Real Web App', url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1', banner: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80' },
  { id: 'spotify', name: 'Spotify Web', icon: TbBrandSpotify, color: 'text-green-400', author: 'Spotify AB', rating: 4.7, type: 'Real Web App', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M', banner: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80' },
  { id: 'wikipedia', name: 'Wikipedia', icon: FaWikipediaW, color: 'text-slate-300', author: 'Wikimedia', rating: 4.9, type: 'Real Web App', url: 'https://en.wikipedia.org', banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80' },
  
  // System / Mock Apps
  { id: 'store', name: 'App Store', icon: ShoppingBag, color: 'text-blue-400', author: 'Nexus OS', rating: 5.0, type: 'System App' },
  { id: 'files', name: 'Files', icon: FolderIcon, color: 'text-yellow-400', author: 'Nexus OS', rating: 5.0, type: 'System App' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'text-slate-300', author: 'Nexus OS', rating: 5.0, type: 'System App' },
  { id: 'taskmanager', name: 'Task Manager', icon: Activity, color: 'text-blue-400', author: 'Nexus OS', rating: 4.9, type: 'System App' },
  { id: 'browser', name: 'Chrome', icon: FaChrome, color: 'text-blue-400', author: 'Google', rating: 4.8, type: 'System App' },
  { id: 'ps-terminal', name: 'VS Code', icon: TbBrandVscode, color: 'text-blue-500', author: 'Microsoft', rating: 4.9, type: 'System App' },
  { id: 'word', name: 'Word', icon: FaFileWord, color: 'text-blue-600', author: 'Microsoft', rating: 4.6, type: 'System App' },
  { id: 'excel', name: 'Excel', icon: FaFileExcel, color: 'text-green-600', author: 'Microsoft', rating: 4.5, type: 'System App' },
  { id: 'slack', name: 'Slack', icon: FaSlack, color: 'text-purple-400', author: 'Slack Tech', rating: 4.5, type: 'Desktop App' },
  { id: 'discord', name: 'Discord', icon: FaDiscord, color: 'text-indigo-400', author: 'Discord Inc.', rating: 4.8, type: 'Desktop App' },
];

export const BrowserApp = () => {
  const [url, setUrl] = useState('https://duckduckgo.com');
  const [inputUrl, setInputUrl] = useState('https://duckduckgo.com');
  const [history, setHistory] = useState<string[]>(['https://duckduckgo.com']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl.trim();
    
    if (!finalUrl.includes('.') || finalUrl.includes(' ')) {
      // Treat as search query
      finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(finalUrl)}&ia=web`;
    } else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const reload = () => {
    setUrl(url + (url.includes('?') ? '&' : '?') + 'refresh=' + Date.now());
  };

  return (
    <div className="w-full h-full bg-white flex flex-col rounded-b-xl overflow-hidden">
      <div className="h-12 bg-slate-100 flex items-center px-4 gap-3 border-b border-slate-200">
        <div className="flex gap-2 mr-2">
          <button onClick={goBack} disabled={historyIndex === 0} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={goForward} disabled={historyIndex === history.length - 1} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <button onClick={reload} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>
        <form onSubmit={handleNavigate} className="flex-1 flex">
          <input 
            type="text" 
            value={inputUrl} 
            onChange={e => setInputUrl(e.target.value)} 
            placeholder="Search or enter web address"
            className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" 
          />
        </form>
      </div>
      <div className="flex-1 bg-slate-50 relative">
        <iframe src={url} className="w-full h-full border-none" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" title="Browser" />
      </div>
    </div>
  );
};

export const WordApp = () => (
  <div className="w-full h-full bg-[#2B579A] flex flex-col rounded-b-xl overflow-hidden">
    <div className="h-14 flex items-center px-4 text-white font-semibold gap-4 border-b border-white/10">
      <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">W</div>
      <div className="flex gap-4 text-sm font-normal">
        <span className="cursor-pointer hover:underline">File</span>
        <span className="cursor-pointer hover:underline">Home</span>
        <span className="cursor-pointer hover:underline">Insert</span>
        <span className="cursor-pointer hover:underline">Layout</span>
      </div>
    </div>
    <div className="h-12 bg-white/10 flex items-center px-4 gap-4">
       <select className="bg-white text-black text-xs px-2 py-1 rounded outline-none"><option>Arial</option><option>Times New Roman</option></select>
       <select className="bg-white text-black text-xs px-2 py-1 rounded outline-none"><option>12</option><option>14</option><option>16</option></select>
       <div className="flex gap-2">
         <button className="w-6 h-6 bg-white/20 rounded text-white font-bold hover:bg-white/30">B</button>
         <button className="w-6 h-6 bg-white/20 rounded text-white italic hover:bg-white/30">I</button>
         <button className="w-6 h-6 bg-white/20 rounded text-white underline hover:bg-white/30">U</button>
       </div>
    </div>
    <div className="flex-1 bg-slate-200 p-8 overflow-auto flex justify-center">
      <div className="bg-white w-full max-w-3xl min-h-[800px] shadow-2xl p-12 text-black outline-none" contentEditable suppressContentEditableWarning>
        <h1 className="text-3xl font-bold mb-4">Document 1</h1>
        <p>Start typing your document here...</p>
      </div>
    </div>
  </div>
);

export const StoreApp = ({ installedApps, onInstall, openWindow }: { installedApps: string[], onInstall: (id: string) => void, openWindow?: (id: AppId) => void }) => {
  const [installing, setInstalling] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (installing) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            onInstall(installing);
            setInstalling(null);
            return 0;
          }
          return p + Math.floor(Math.random() * 15) + 5;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [installing, onInstall]);

  const handleInstall = (id: string) => {
    if (!installing) {
      setInstalling(id);
    }
  };

  const featuredApp = AVAILABLE_APPS[0]; // Excalidraw

  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col rounded-b-xl overflow-hidden text-white font-sans">
      {/* Store Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#252526]">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-blue-400" size={24} />
          <h2 className="font-semibold text-xl tracking-wide">Microsoft Store</h2>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input type="text" placeholder="Search apps, games, movies..." className="w-full bg-black/40 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Banner */}
        <div className="relative h-64 w-full bg-gradient-to-r from-purple-900 to-indigo-900 overflow-hidden">
          <img src={featuredApp.banner} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent" />
          <div className="absolute bottom-8 left-8 flex items-end gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <featuredApp.icon size={48} className={featuredApp.color} />
            </div>
            <div className="mb-2">
              <h1 className="text-4xl font-bold mb-2">{featuredApp.name}</h1>
              <p className="text-white/70 mb-4">{featuredApp.type} • {featuredApp.author}</p>
              {installedApps.includes(featuredApp.id) ? (
                <button 
                  onClick={() => openWindow && openWindow(featuredApp.id as AppId)}
                  className="px-8 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
                >
                  Open
                </button>
              ) : (
                <button 
                  onClick={() => handleInstall(featuredApp.id)}
                  disabled={installing !== null}
                  className="px-8 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  Get
                </button>
              )}
            </div>
          </div>
        </div>

        {/* App Grid */}
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-6">Top Free Apps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {AVAILABLE_APPS.slice(1).map(app => {
              const isInstalled = installedApps.includes(app.id);
              const isInstalling = installing === app.id;
              
              return (
                <div key={app.id} className="bg-[#252526] border border-white/5 rounded-xl p-4 flex flex-col gap-4 hover:bg-[#2d2d30] transition-colors group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#1e1e1e] flex items-center justify-center shrink-0 shadow-inner border border-white/5">
                      <app.icon size={32} className={app.color} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h4 className="font-semibold text-base truncate">{app.name}</h4>
                      <p className="text-xs text-white/50 truncate">{app.author}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-white/60">{app.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-2">
                    {isInstalling ? (
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>Downloading...</span>
                          <span>{Math.min(progress, 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    ) : isInstalled ? (
                      <button 
                        onClick={() => openWindow && openWindow(app.id as AppId)}
                        className="w-full py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                      >
                        Open
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleInstall(app.id)}
                        disabled={installing !== null}
                        className="w-full py-1.5 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Free
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const FolderTree = ({ 
  folderId, 
  fileSystem, 
  currentFolderId, 
  setCurrentFolderId, 
  level = 0 
}: { 
  folderId: string, 
  fileSystem: FileNode[], 
  currentFolderId: string, 
  setCurrentFolderId: (id: string) => void,
  level?: number
}) => {
  const [expanded, setExpanded] = useState(level === 0 || level === 1);
  const folder = fileSystem.find(f => f.id === folderId);
  const children = fileSystem.filter(f => f.parentId === folderId && f.isFolder);

  if (!folder) return null;

  return (
    <div className="w-full">
      <div 
        className={`flex items-center gap-1 py-1 rounded-md text-sm transition-colors cursor-pointer ${currentFolderId === folder.id ? 'bg-blue-600/20 text-blue-400' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
        style={{ paddingLeft: `${level * 12 + 8}px`, paddingRight: '8px' }}
        onClick={() => setCurrentFolderId(folder.id)}
      >
        <div 
          className="w-4 h-4 flex items-center justify-center hover:bg-white/10 rounded shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {children.length > 0 && (
            <ChevronRight size={14} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          )}
        </div>
        {folderId === 'root' ? (
          <Monitor size={16} className={currentFolderId === folder.id ? 'text-blue-400' : 'text-slate-300'} />
        ) : folderId.includes('drive') ? (
          <HardDrive size={16} className={currentFolderId === folder.id ? 'text-blue-400' : 'text-slate-300'} />
        ) : (
          <FolderIcon size={16} className={currentFolderId === folder.id ? 'text-blue-400' : 'text-blue-300'} />
        )}
        <span className="truncate ml-1">{folder.name}</span>
      </div>
      {expanded && children.map(child => (
        <FolderTree 
          key={child.id} 
          folderId={child.id} 
          fileSystem={fileSystem} 
          currentFolderId={currentFolderId} 
          setCurrentFolderId={setCurrentFolderId} 
          level={level + 1} 
        />
      ))}
    </div>
  );
};

export const FilesApp = ({ 
  fileSystem, 
  onOpenFile, 
  onCreateFile, 
  onCreateFolder,
  onContextMenu
}: { 
  fileSystem: FileNode[], 
  onOpenFile: (file: FileNode) => void,
  onCreateFile: (name: string, parentId: string) => void,
  onCreateFolder: (name: string, parentId: string) => void,
  onContextMenu?: (e: React.MouseEvent, folderId: string) => void
}) => {
  const [currentFolderId, setCurrentFolderId] = useState<string>('c-drive');
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [newName, setNewName] = useState('');
  const [pinnedFolders, setPinnedFolders] = useState<string[]>(['desktop', 'downloads', 'docs']);
  const [recentFolders, setRecentFolders] = useState<string[]>(['c-drive']);

  const currentFolder = fileSystem.find(f => f.id === currentFolderId);
  const contents = fileSystem.filter(f => f.parentId === currentFolderId);

  // Update recent folders when navigating
  useEffect(() => {
    setRecentFolders(prev => {
      const newRecent = [currentFolderId, ...prev.filter(id => id !== currentFolderId)].slice(0, 5);
      return newRecent;
    });
  }, [currentFolderId]);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedFolders(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Build breadcrumbs
  const breadcrumbs = [];
  let curr: FileNode | undefined = currentFolder;
  while (curr) {
    breadcrumbs.unshift(curr);
    curr = fileSystem.find(f => f.id === curr?.parentId);
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    if (isCreating === 'file') {
      onCreateFile(newName, currentFolderId);
    } else {
      onCreateFolder(newName, currentFolderId);
    }
    setIsCreating(null);
    setNewName('');
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] flex rounded-b-xl overflow-hidden text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#252526] border-r border-white/10 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-white/10 shrink-0">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <FolderIcon size={20} className="text-blue-400" />
            File Explorer
          </h2>
        </div>
        
        <div className="p-2 space-y-4">
          {/* Quick Access (Pinned) */}
          <div>
            <div className="px-3 py-1 text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Pin size={12} /> Quick Access
            </div>
            <div className="mt-1 space-y-0.5">
              {pinnedFolders.map(id => {
                const folder = fileSystem.find(f => f.id === id);
                if (!folder) return null;
                return (
                  <div 
                    key={`pin-${id}`}
                    onClick={() => setCurrentFolderId(id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer group ${currentFolderId === id ? 'bg-blue-600/20 text-blue-400' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FolderIcon size={16} className="text-blue-300 shrink-0" /> 
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <button onClick={(e) => togglePin(id, e)} className="opacity-0 group-hover:opacity-100 hover:text-white text-white/50">
                      <Pin size={12} className="fill-current" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent */}
          <div>
            <div className="px-3 py-1 text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <ClockIcon size={12} /> Recent
            </div>
            <div className="mt-1 space-y-0.5">
              {recentFolders.filter(id => !pinnedFolders.includes(id)).slice(0, 3).map(id => {
                const folder = fileSystem.find(f => f.id === id);
                if (!folder) return null;
                return (
                  <div 
                    key={`recent-${id}`}
                    onClick={() => setCurrentFolderId(id)}
                    className={`w-full flex items-center px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${currentFolderId === id ? 'bg-blue-600/20 text-blue-400' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                  >
                    <FolderIcon size={16} className="text-blue-300 shrink-0 mr-2" /> 
                    <span className="truncate">{folder.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* This PC (Tree View) */}
          <div>
            <div className="px-3 py-1 text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2 mb-1">
              <HardDrive size={12} /> Drives
            </div>
            <FolderTree 
              folderId="root" 
              fileSystem={fileSystem} 
              currentFolderId={currentFolderId} 
              setCurrentFolderId={setCurrentFolderId} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e]">
        {/* Top Bar */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#252526]">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                <button 
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className="text-white/70 hover:text-white hover:underline"
                >
                  {crumb.name}
                </button>
                {index < breadcrumbs.length - 1 && <ChevronRight size={14} className="text-white/40" />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCreating('folder')} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors" title="New Folder">
              <FolderPlus size={18} />
            </button>
            <button onClick={() => setIsCreating('file')} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors" title="New File">
              <FilePlus size={18} />
            </button>
          </div>
        </div>

        {/* File Grid */}
        <div 
          className="flex-1 p-6 overflow-y-auto"
          onContextMenu={(e) => onContextMenu?.(e, currentFolderId)}
        >
          <div className={currentFolderId === 'root' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"}>
            {isCreating && (
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-blue-500/50">
                {isCreating === 'folder' ? <FolderIcon size={40} className="text-blue-400" /> : <FileText size={40} className="text-slate-300" />}
                <form onSubmit={handleCreate} className="w-full">
                  <input 
                    autoFocus
                    type="text" 
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onBlur={() => setIsCreating(null)}
                    className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-center text-white outline-none focus:border-blue-500"
                    placeholder="Name..."
                  />
                </form>
              </div>
            )}
            
            {contents.map(file => file.storage ? (
              <div 
                key={file.id}
                onDoubleClick={() => setCurrentFolderId(file.id)}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5 hover:border-white/20"
              >
                <HardDrive size={48} className="text-slate-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="w-full h-2 bg-black/50 rounded-full mt-2 mb-1 overflow-hidden">
                    <div 
                      className={`h-full ${file.storage.used / file.storage.total > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`} 
                      style={{ width: `${(file.storage.used / file.storage.total) * 100}%` }} 
                    />
                  </div>
                  <div className="text-xs text-white/50 truncate">
                    {file.storage.total - file.storage.used} {file.storage.unit} free of {file.storage.total} {file.storage.unit}
                  </div>
                </div>
              </div>
            ) : (
              <div 
                key={file.id}
                onDoubleClick={() => file.isFolder ? setCurrentFolderId(file.id) : onOpenFile(file)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group relative"
              >
                {file.isFolder && (
                  <button 
                    onClick={(e) => togglePin(file.id, e)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-opacity ${pinnedFolders.includes(file.id) ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-white/50'}`}
                    title={pinnedFolders.includes(file.id) ? "Unpin from Quick Access" : "Pin to Quick Access"}
                  >
                    <Pin size={12} className={pinnedFolders.includes(file.id) ? "fill-current" : ""} />
                  </button>
                )}
                {file.isFolder ? (
                  <FolderIcon size={48} className="text-blue-400 group-hover:scale-105 transition-transform" />
                ) : (
                  <FileText size={48} className="text-slate-300 group-hover:scale-105 transition-transform" />
                )}
                <span className="text-sm text-white/90 text-center truncate w-full">{file.name}</span>
              </div>
            ))}

            {contents.length === 0 && !isCreating && (
              <div className="col-span-full flex flex-col items-center justify-center h-48 text-white/40">
                <FolderIcon size={48} className="mb-4 opacity-50" />
                <p>This folder is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TaskManagerApp = ({ windows, closeWindow }: { windows: any[], closeWindow: (id: string) => void }) => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col rounded-b-xl overflow-hidden text-white font-sans">
      <div className="p-4 border-b border-white/10 flex gap-6 bg-[#252526]">
        <span className="font-semibold border-b-2 border-blue-500 pb-1">Processes</span>
        <span className="text-white/50 pb-1">Performance</span>
        <span className="text-white/50 pb-1">App history</span>
        <span className="text-white/50 pb-1">Startup</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/70">
            <tr>
              <th className="pb-2 font-medium w-1/2">Name</th>
              <th className="pb-2 font-medium w-1/6">Status</th>
              <th className="pb-2 font-medium w-1/6">CPU</th>
              <th className="pb-2 font-medium w-1/6">Memory</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {windows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-white/50">No running apps</td>
              </tr>
            )}
            {windows.map(win => {
              const appInfo = AVAILABLE_APPS.find(a => a.id === win.appId);
              const Icon = appInfo?.icon || Activity;
              return (
                <tr key={win.id} className="border-b border-white/5 hover:bg-white/5 group">
                  <td className="py-3 flex items-center gap-3">
                    <Icon size={16} className={appInfo?.color || 'text-white'} />
                    {win.title}
                  </td>
                  <td className="py-3 text-green-400 text-xs">Running</td>
                  <td className="py-3 text-xs">{Math.floor(Math.random() * 5)}.{Math.floor(Math.random() * 9)}%</td>
                  <td className="py-3 text-xs">{Math.floor(Math.random() * 100) + 20} MB</td>
                  <td className="py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => closeWindow(win.id)} className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded text-xs transition-colors">End task</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SettingsApp = ({ 
  settings, 
  setSettings, 
  triggerBgUpload,
  currentUser
}: { 
  settings: SystemSettings, 
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>,
  triggerBgUpload: () => void,
  currentUser?: NexusUser | null
}) => {
  const [activeTab, setActiveTab] = useState('system');

  const [aiSettings, setAiSettings] = useState({
    fileSystem: true,
    terminal: true,
    screenContext: false,
    copilot: true
  });

  const tabs = [
    { id: 'system', icon: Monitor, label: 'System' },
    { id: 'devices', icon: Bluetooth, label: 'Bluetooth & devices' },
    { id: 'network', icon: Wifi, label: 'Network & internet' },
    { id: 'personalization', icon: Palette, label: 'Personalization' },
    { id: 'taskbar', icon: AlignLeft, label: 'Taskbar' },
    { id: 'apps', icon: LayoutGrid, label: 'Apps' },
    { id: 'accounts', icon: User, label: 'Accounts' },
    { id: 'time', icon: Clock, label: 'Time & language' },
    { id: 'gaming', icon: Gamepad2, label: 'Gaming' },
    { id: 'accessibility', icon: Accessibility, label: 'Accessibility' },
    { id: 'privacy', icon: Shield, label: 'Privacy & security' },
    { id: 'update', icon: RefreshCw, label: 'Windows Update' },
    { id: 'ai', icon: Bot, label: 'Nexus AI Features' },
  ];

  const accentColors = [
    { id: 'red', class: 'bg-red-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'green', class: 'bg-green-500' },
    { id: 'purple', class: 'bg-purple-500' },
    { id: 'orange', class: 'bg-orange-500' },
  ];

  const presetBackgrounds = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744626753-eda8151a747b?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2564&auto=format&fit=crop'
  ];

  const SettingRow = ({ icon: Icon, title, subtitle, action, onClick, hasBorder = true }: any) => (
    <div onClick={onClick} className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer ${hasBorder ? 'border-b border-white/5' : ''}`}>
      <Icon size={20} className="text-white/70" />
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{title}</div>
        {subtitle && <div className="text-xs text-white/50">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-3">
        {action}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-[#202020] flex rounded-b-xl overflow-hidden text-white font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-[#202020] border-r border-white/5 flex flex-col py-4">
        <div className="px-4 mb-6 flex items-center gap-3">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-12 h-12 rounded-full shadow-lg border border-white/10" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-lg font-semibold shadow-lg">
              {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <div className="font-semibold text-sm truncate">{currentUser?.displayName || 'Nexus User'}</div>
            <div className="text-xs text-white/50 truncate">{currentUser?.email || 'Local Account'}</div>
          </div>
        </div>
        <div className="relative mb-4 px-4">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-white/40" size={14} />
          <input type="text" placeholder="Find a setting" className="w-full bg-white/5 border border-white/10 rounded-md pl-9 pr-4 py-1.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors relative ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
            >
              {activeTab === tab.id && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-full" />}
              <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-400' : ''} /> 
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#202020] p-8">
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
          <h1 className="text-3xl font-semibold mb-8">{tabs.find(t => t.id === activeTab)?.label}</h1>
          
          {activeTab === 'system' && (
            <div className="space-y-2">
              <div className="flex items-center gap-6 mb-8 p-6 bg-white/5 rounded-xl border border-white/5">
                <Monitor size={48} className="text-blue-400" />
                <div>
                  <h2 className="text-2xl font-semibold">Nexus PC</h2>
                  <p className="text-white/60 text-sm">Nexus Neural Engine v4 • {navigator.hardwareConcurrency || 8} Cores • {navigator.deviceMemory || 8}GB RAM</p>
                  <p className="text-white/40 text-xs mt-1">{navigator.userAgent.split(' ')[0]} Environment</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                <SettingRow icon={Monitor} title="Display" subtitle="Monitors, brightness, night light, display profile" action={<ChevronRight size={16} className="text-white/40" />} />
                <SettingRow icon={Volume2} title="Sound" subtitle="Volume levels, output, input, sound devices" action={<ChevronRight size={16} className="text-white/40" />} />
                <SettingRow icon={Bell} title="Notifications" subtitle="Alerts from apps and system" action={<ChevronRight size={16} className="text-white/40" />} />
                <SettingRow icon={Moon} title="Focus assist" subtitle="Notifications, alerts, and messages" action={<ChevronRight size={16} className="text-white/40" />} />
                <SettingRow icon={Battery} title="Power & battery" subtitle="Sleep, battery usage, saver" action={<ChevronRight size={16} className="text-white/40" />} />
                <SettingRow icon={HardDrive} title="Storage" subtitle="Storage space, drives, configuration rules" action={<ChevronRight size={16} className="text-white/40" />} hasBorder={false} />
              </div>
            </div>
          )}

          {activeTab === 'personalization' && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-6">
                <h3 className="text-lg font-medium mb-4">Background</h3>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-48 h-28 bg-black/50 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                    {settings.backgroundImage ? (
                      <img src={settings.backgroundImage} alt="Current Background" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-white/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/60 mb-3">Personalize your background with a picture, solid color, or slideshow.</p>
                    <button onClick={triggerBgUpload} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md text-sm font-medium transition-colors">
                      Browse photos
                    </button>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium mb-3 text-white/80">Recent images</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {presetBackgrounds.map((bg, i) => (
                    <button 
                      key={i}
                      onClick={() => setSettings(s => ({ ...s, backgroundImage: bg }))}
                      className={`w-24 h-16 shrink-0 rounded-md overflow-hidden border-2 transition-all ${settings.backgroundImage === bg ? 'border-blue-500 scale-105' : 'border-transparent hover:border-white/30'}`}
                    >
                      <img src={bg} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-6">
                <h3 className="text-lg font-medium mb-4">Desktop Widgets</h3>
                
                <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg border border-white/5 mb-4">
                  <div>
                    <span className="text-sm font-medium block">Show Desktop Clock</span>
                    <span className="text-xs text-white/50">Display the time and date on your desktop</span>
                  </div>
                  <div className="cursor-pointer" onClick={() => setSettings(s => ({ ...s, showDesktopClock: s.showDesktopClock === false ? true : false }))}>
                    {settings.showDesktopClock !== false ? <ToggleRight size={32} className="text-blue-400" /> : <ToggleLeft size={32} className="text-white/40" />}
                  </div>
                </div>

                <div className={`flex items-center justify-between bg-black/20 p-4 rounded-lg border border-white/5 ${settings.showDesktopClock === false ? 'opacity-50 pointer-events-none' : ''} mb-4`}>
                  <span className="text-sm font-medium">Clock Size</span>
                  <select 
                    value={settings.desktopClockSize || 'medium'}
                    onChange={(e) => setSettings(s => ({ ...s, desktopClockSize: e.target.value as any }))}
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-md px-3 py-1.5 outline-none focus:border-blue-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className={`flex items-center justify-between bg-black/20 p-4 rounded-lg border border-white/5 ${settings.showDesktopClock === false ? 'opacity-50 pointer-events-none' : ''}`}>
                  <span className="text-sm font-medium">Clock Style</span>
                  <select 
                    value={settings.desktopClockStyle || 'default'}
                    onChange={(e) => setSettings(s => ({ ...s, desktopClockStyle: e.target.value as any }))}
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-md px-3 py-1.5 outline-none focus:border-blue-500"
                  >
                    <option value="default">Default Glass</option>
                    <option value="flip">Retro Flip</option>
                    <option value="futuristic">Futuristic Text</option>
                    <option value="analog">Analog Face</option>
                  </select>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-6">
                <h3 className="text-lg font-medium mb-4">Accent color</h3>
                <p className="text-sm text-white/60 mb-4">Choose your accent color</p>
                <div className="flex gap-4">
                  {accentColors.map(color => (
                    <button 
                      key={color.id}
                      onClick={() => setSettings(s => ({ ...s, accentColor: color.id as any }))}
                      className={`w-12 h-12 rounded-full ${color.class} flex items-center justify-center transition-transform hover:scale-110 ${settings.accentColor === color.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#202020]' : ''}`}
                    >
                      {settings.accentColor === color.id && <Check size={20} className="text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'taskbar' && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-6">
                <h3 className="text-lg font-medium mb-4">Taskbar behaviors</h3>
                <p className="text-sm text-white/60 mb-4">Taskbar alignment, badging, automatically hide, and multiple displays</p>
                <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-sm font-medium">Taskbar alignment</span>
                  <select 
                    value={settings.taskbarPosition}
                    onChange={(e) => setSettings(s => ({ ...s, taskbarPosition: e.target.value as any }))}
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-md px-3 py-1.5 outline-none focus:border-blue-500"
                  >
                    <option value="bottom">Bottom (Windows)</option>
                    <option value="left">Left (Ubuntu)</option>
                    <option value="mac">Center Dock (Mac)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg border border-white/5 mt-4">
                  <span className="text-sm font-medium">Taskbar opacity</span>
                  <div className="flex items-center gap-3 w-48">
                    <span className="text-xs text-white/50">{settings.taskbarOpacity ?? 60}%</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={settings.taskbarOpacity ?? 60}
                      onChange={(e) => setSettings(s => ({ ...s, taskbarOpacity: parseInt(e.target.value) }))}
                      className="flex-1 accent-blue-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Bot size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">Nexus AI Copilot</h3>
                    <p className="text-sm text-white/60">Your everyday AI companion</p>
                  </div>
                  <div className="ml-auto cursor-pointer" onClick={() => setAiSettings(s => ({ ...s, copilot: !s.copilot }))}>
                    {aiSettings.copilot ? <ToggleRight size={32} className="text-blue-400" /> : <ToggleLeft size={32} className="text-white/40" />}
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  Nexus AI is deeply integrated into the OS. It can read your screen, manage your files, and write code for you.
                </p>
                <div className={`space-y-2 ${!aiSettings.copilot ? 'opacity-50 pointer-events-none' : ''}`}>
                  <SettingRow 
                    icon={FolderIcon} 
                    title="File System Access" 
                    subtitle="Allow AI to read and write files" 
                    action={
                      <div className="cursor-pointer" onClick={() => setAiSettings(s => ({ ...s, fileSystem: !s.fileSystem }))}>
                        {aiSettings.fileSystem ? <ToggleRight size={28} className="text-blue-400" /> : <ToggleLeft size={28} className="text-white/40" />}
                      </div>
                    } 
                  />
                  <SettingRow 
                    icon={Terminal} 
                    title="Terminal Execution" 
                    subtitle="Allow AI to run commands" 
                    action={
                      <div className="cursor-pointer" onClick={() => setAiSettings(s => ({ ...s, terminal: !s.terminal }))}>
                        {aiSettings.terminal ? <ToggleRight size={28} className="text-blue-400" /> : <ToggleLeft size={28} className="text-white/40" />}
                      </div>
                    } 
                  />
                  <SettingRow 
                    icon={Monitor} 
                    title="Screen Context" 
                    subtitle="Allow AI to see active windows" 
                    action={
                      <div className="cursor-pointer" onClick={() => setAiSettings(s => ({ ...s, screenContext: !s.screenContext }))}>
                        {aiSettings.screenContext ? <ToggleRight size={28} className="text-blue-400" /> : <ToggleLeft size={28} className="text-white/40" />}
                      </div>
                    } 
                    hasBorder={false} 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-6">
                <div className="flex items-center gap-6 mb-6">
                  {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="w-24 h-24 rounded-full shadow-lg border border-white/10" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-semibold shadow-lg">
                      {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold">{currentUser?.displayName || 'Nexus User'}</h2>
                    <p className="text-white/60">{currentUser?.email || 'Not signed in'}</p>
                    <p className="text-xs text-blue-400 mt-1">Administrator</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <SettingRow icon={User} title="Your info" subtitle="Accounts used by email, calendar, and contacts" action={<ChevronRight size={16} className="text-white/40" />} />
                  <SettingRow icon={Shield} title="Sign-in options" subtitle="Security keys, passwords, and dynamic lock" action={<ChevronRight size={16} className="text-white/40" />} />
                  <SettingRow icon={FolderIcon} title="Sync your settings" subtitle="Passwords, language preferences, and more" action={<ChevronRight size={16} className="text-white/40" />} hasBorder={false} />
                </div>
              </div>
            </div>
          )}

          {/* Mock content for other tabs */}
          {['devices', 'network', 'apps', 'time', 'gaming', 'accessibility', 'privacy', 'update'].includes(activeTab) && (
            <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden flex flex-col items-center justify-center py-20 text-white/50">
              <Settings size={48} className="mb-4 opacity-50" />
              <p>These settings are managed by your host operating system.</p>
              <p className="text-sm mt-2">Nexus OS Prototype Environment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
