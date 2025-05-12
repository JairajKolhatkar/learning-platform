import socketIOClient from 'socket.io-client';
import { User } from './authService';

// Types for socket messages
export interface ChatMessage {
  room: string;
  message: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

class SocketService {
  private socket: any = null;
  private connected = false;
  private messageListeners: ((message: ChatMessage) => void)[] = [];

  initialize(token?: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';
    
    this.socket = socketIOClient(SOCKET_URL, {
      auth: token ? { token } : undefined,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Socket disconnected');
    });

    this.socket.on('receive-message', (message: ChatMessage) => {
      this.messageListeners.forEach(listener => listener(message));
    });
  }

  joinRoom(roomId: string): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit('join-room', roomId);
  }

  leaveRoom(roomId: string): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit('leave-room', roomId);
  }

  sendMessage(room: string, message: string, user: Partial<User>): void {
    if (!this.socket || !this.connected) return;
    
    this.socket.emit('send-message', {
      room,
      message,
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar
      }
    });
  }

  onMessage(callback: (message: ChatMessage) => void): () => void {
    this.messageListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.messageListeners = this.messageListeners.filter(listener => listener !== callback);
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 