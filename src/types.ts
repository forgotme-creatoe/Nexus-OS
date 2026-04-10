export type AppId = 'ps-terminal' | 'browser' | 'word' | 'excel' | 'files' | 'settings' | 'store' | 'slack' | 'zoom' | 'spotify' | 'discord' | 'edge' | 'excalidraw' | 'codepen' | 'youtube' | 'wikipedia';

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x?: number;
  y?: number;
};

export type Tab = {
  id: string;
  name: string;
  group?: string;
  content: string;
};

export type Message = {
  role: 'user' | 'ai' | 'system';
  content: string;
};

export type FileNode = {
  id: string;
  name: string;
  isFolder: boolean;
  parentId: string | null;
  content?: string;
  storage?: {
    used: number;
    total: number;
    unit: string;
  };
};

export type SystemSettings = {
  accentColor: 'red' | 'blue' | 'green' | 'purple' | 'orange';
  taskbarPosition: 'left' | 'bottom' | 'mac';
  taskbarOpacity?: number;
  backgroundImage?: string;
  showDesktopClock?: boolean;
  desktopClockPosition?: { x: number, y: number };
  desktopClockSize?: 'small' | 'medium' | 'large';
  desktopClockStyle?: 'default' | 'flip' | 'futuristic' | 'analog';
};

export type NexusUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};
