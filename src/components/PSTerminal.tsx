import React, { useState } from 'react';
import { Terminal, Folder, FileCode2, ChevronDown, Play, Plus, X, Edit2 } from 'lucide-react';
import { Tab } from '../types';

interface PSTerminalProps {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  terminalOutput: string[];
  setTerminalOutput: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PSTerminal: React.FC<PSTerminalProps> = ({ tabs, setTabs, activeTabId, setActiveTabId, terminalOutput, setTerminalOutput }) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [terminalInput, setTerminalInput] = useState('');

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleAddTab = () => {
    const newTab: Tab = { id: Date.now().toString(), name: 'untitled.ts', content: '', group: 'New Group' };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const saveTabName = (id: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, name: editName } : t));
    setEditingTabId(null);
  };

  const saveGroupName = (id: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, group: editGroupName } : t));
    setEditingGroup(null);
  };

  const updateContent = (content: string) => {
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, content } : t));
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const newOutput = [...terminalOutput, terminalInput];
    
    // Simple command handling
    if (terminalInput.trim() === 'clear') {
      setTerminalOutput([]);
    } else if (terminalInput.trim() === 'help') {
      setTerminalOutput([...newOutput, 'Available commands: clear, help, echo, date']);
    } else if (terminalInput.trim().startsWith('echo ')) {
      setTerminalOutput([...newOutput, terminalInput.substring(5)]);
    } else if (terminalInput.trim() === 'date') {
      setTerminalOutput([...newOutput, new Date().toString()]);
    } else {
      setTerminalOutput([...newOutput, `bash: ${terminalInput}: command not found`]);
    }
    
    setTerminalInput('');
  };

  return (
    <div className="flex-1 flex overflow-hidden rounded-b-xl">
      {/* Sidebar */}
      <div className="w-56 bg-black/40 border-r border-white/10 flex flex-col backdrop-blur-md">
        <div className="p-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest flex justify-between items-center">
          <span>Explorer</span>
          <button onClick={handleAddTab} className="hover:text-white"><Plus size={12} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="flex items-center gap-2 text-xs text-white/80 hover:bg-white/10 p-1.5 rounded cursor-pointer transition-colors">
            <ChevronDown size={14} />
            <Folder size={14} className="text-red-400" />
            <span className="font-medium">AI_OS_Workspace</span>
          </div>
          <div className="pl-5 space-y-1 mt-1">
            {tabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group flex items-center justify-between text-xs p-1.5 rounded cursor-pointer transition-colors ${activeTabId === tab.id ? 'bg-red-500/20 text-red-300' : 'text-white/60 hover:bg-white/10 hover:text-white/90'}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileCode2 size={14} className="shrink-0" />
                  {editingTabId === tab.id ? (
                    <input 
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onBlur={() => saveTabName(tab.id)}
                      onKeyDown={e => e.key === 'Enter' && saveTabName(tab.id)}
                      className="bg-black/50 text-white px-1 outline-none w-full"
                    />
                  ) : (
                    <span className="truncate">{tab.name}</span>
                  )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); setEditingTabId(tab.id); setEditName(tab.name); }} className="opacity-0 group-hover:opacity-100 hover:text-white shrink-0">
                  <Edit2 size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        {/* Tabs Bar */}
        <div className="h-10 bg-black/40 border-b border-white/10 flex items-center px-2 gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-md text-xs cursor-pointer border-t-2 transition-all ${
                activeTabId === tab.id 
                  ? 'bg-[#0d1117] border-red-500 text-white' 
                  : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {tab.group && (
                <div className="flex items-center gap-1">
                  {editingGroup === tab.id ? (
                    <input 
                      autoFocus
                      value={editGroupName}
                      onChange={e => setEditGroupName(e.target.value)}
                      onBlur={() => saveGroupName(tab.id)}
                      onKeyDown={e => e.key === 'Enter' && saveGroupName(tab.id)}
                      className="bg-black/50 text-white px-1 outline-none w-16 text-[9px]"
                    />
                  ) : (
                    <span 
                      onDoubleClick={(e) => { e.stopPropagation(); setEditingGroup(tab.id); setEditGroupName(tab.group || ''); }}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 hover:bg-white/20"
                    >
                      {tab.group}
                    </span>
                  )}
                </div>
              )}
              {tab.name}
              <button onClick={(e) => handleCloseTab(e, tab.id)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded transition-opacity"><X size={12} /></button>
            </div>
          ))}
          <button onClick={handleAddTab} className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md ml-1 transition-colors"><Plus size={14} /></button>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed text-white/90">
          <textarea 
            value={activeTab?.content || ''}
            onChange={(e) => updateContent(e.target.value)}
            className="w-full h-full bg-transparent outline-none resize-none"
            spellCheck={false}
          />
        </div>

        {/* Integrated Terminal */}
        <div className="h-48 bg-black/60 border-t border-white/10 flex flex-col backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-[10px] font-semibold tracking-widest text-white/50">
            <div className="flex gap-4">
              <button className="hover:text-white border-b border-red-500 text-white pb-1">TERMINAL</button>
              <button className="hover:text-white pb-1">OUTPUT</button>
              <button className="hover:text-white pb-1">DEBUG CONSOLE</button>
            </div>
            <div className="flex gap-2">
              <button className="hover:text-white"><Play size={12} /></button>
            </div>
          </div>
          <div className="flex-1 p-3 font-mono text-xs overflow-auto space-y-1.5">
            {terminalOutput.map((line, i) => (
              <div key={i} className="flex gap-2">
                {i > 1 && !line.startsWith('bash:') && !line.startsWith('Available') && !line.startsWith('Nexus') && !line.startsWith('Ready') && !line.match(/^[a-zA-Z]{3} [a-zA-Z]{3} \d{2}/) && line !== terminalOutput[i-1] ? (
                  <span className="text-red-400 shrink-0">admin@nexus:~$</span>
                ) : null}
                <span className="text-white/80">{line}</span>
              </div>
            ))}
            <form onSubmit={handleTerminalSubmit} className="flex gap-2 items-center">
              <span className="text-red-400 shrink-0">admin@nexus:~$</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white/80"
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
