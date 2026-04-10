import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, ChevronRight, X, Grip } from 'lucide-react';
import { Message } from '../types';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AIPanelProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({ messages, setMessages, onClose, onCommand }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [panelSize, setPanelSize] = useState({ width: 360, height: 550 });
  const [panelPos, setPanelPos] = useState({ x: window.innerWidth - 360 - 52, y: window.innerHeight - 550 - 20 });
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Resize state
  const isResizing = useRef(false);
  const startResizePos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  // Drag state
  const isDragging = useRef(false);
  const startDragPos = useRef({ x: 0, y: 0 });
  const startPanelPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current) {
        const deltaX = startResizePos.current.x - e.clientX;
        const deltaY = startResizePos.current.y - e.clientY;
        
        setPanelSize({
          width: Math.max(300, Math.min(800, startSize.current.width + deltaX)),
          height: Math.max(400, Math.min(window.innerHeight - 100, startSize.current.height + deltaY))
        });
        
        // Adjust position so it resizes from the top-left while anchored
        setPanelPos(prev => ({
          x: startPanelPos.current.x - deltaX,
          y: startPanelPos.current.y - deltaY
        }));
      } else if (isDragging.current) {
        const deltaX = e.clientX - startDragPos.current.x;
        const deltaY = e.clientY - startDragPos.current.y;
        
        setPanelPos({
          x: Math.max(0, Math.min(window.innerWidth - panelSize.width, startPanelPos.current.x + deltaX)),
          y: Math.max(0, Math.min(window.innerHeight - panelSize.height, startPanelPos.current.y + deltaY))
        });
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      isDragging.current = false;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [panelSize.width, panelSize.height]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    startResizePos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...panelSize };
    startPanelPos.current = { ...panelPos };
    document.body.style.cursor = 'nwse-resize';
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    isDragging.current = true;
    startDragPos.current = { x: e.clientX, y: e.clientY };
    startPanelPos.current = { ...panelPos };
    document.body.style.cursor = 'grabbing';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: `You are Nexus AI, an integrated local AI of a futuristic operating system.
CRITICAL INSTRUCTIONS:
1. Keep responses EXTREMELY short and concise (1-2 sentences max).
2. Do not use filler words, pleasantries, or messy formatting.
3. Use bullet points only if absolutely necessary.
4. You can control the OS by outputting special command tags in your response.
To open an app, output: [CMD: OPEN_APP: app_id] (Available apps: browser, word, excel, ps-terminal, files, settings, store)
To write or edit code in the PS+- Terminal, output: [CMD: WRITE_CODE: filename | code_content]
Always explain what you are doing briefly alongside the command tags.`
        }
      });
      
      const responseText = response.text || '';
      
      // Parse commands
      const cmdRegex = /\[CMD:\s*(.*?)\]/g;
      let match;
      while ((match = cmdRegex.exec(responseText)) !== null) {
        onCommand(match[1]);
      }
      
      // Clean text for display
      const cleanText = responseText.replace(cmdRegex, '').trim();
      if (cleanText) {
        setMessages(prev => [...prev, { role: 'ai', content: cleanText }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to the local AI model.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      className="fixed bg-black/85 backdrop-blur-3xl border border-white/10 rounded-2xl flex flex-col z-50 shadow-2xl transition-none"
      style={{ 
        width: panelSize.width, 
        height: panelSize.height,
        left: panelPos.x,
        top: panelPos.y
      }}
    >
      {/* Resize Handle */}
      <div 
        className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize z-50 flex items-start justify-start p-1 text-white/20 hover:text-white/60 transition-colors"
        onMouseDown={handleResizeStart}
      >
        <Grip size={14} className="rotate-45" />
      </div>

      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 pl-8 cursor-grab active:cursor-grabbing rounded-t-2xl"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot size={18} className="text-red-400" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse border border-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/90 font-medium">Nexus AI</span>
            <span className="text-[9px] text-white/40">On-device Agent</span>
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={14} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
              msg.role === 'user' ? 'bg-white/10' : 'bg-red-500/20 border border-red-500/30'
            }`}>
              {msg.role === 'user' ? <User size={12} className="text-white/70" /> : <Bot size={12} className="text-red-400" />}
            </div>
            <div className={`px-3 py-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-red-600 text-white rounded-tr-sm' 
                : 'bg-white/10 text-white/80 rounded-tl-sm border border-white/5'
            }`}>
              {msg.role === 'ai' ? (
                <div className="markdown-body prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                  <Markdown>{msg.content}</Markdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-1">
              <Bot size={12} className="text-red-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 rounded-tl-sm border border-white/5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-black/60 border-t border-white/10">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Nexus AI to open apps or write code..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white/90 outline-none focus:border-red-500/50 transition-colors placeholder:text-white/30"
          />
          <button type="submit" disabled={!input.trim() || isTyping} className="absolute right-1.5 p-1.5 bg-red-600 hover:bg-red-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-lg transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
