// src/store/useChatStore.js
import { create } from 'zustand';
import io from 'socket.io-client';
import axiosInstance from '../api/axios';


const socket = io(import.meta.env.VITE_CHAT_API_URL, { withCredentials: true });


export const useChatStore = create((set, get) => ({
  messages: [],
  socket,
  room: null,
  user: null, 
 

  joinRoom: async (room, user) => {
    if (!user) return;
    set({ room, user });

    socket.emit('join-room', room);


      // Fetch existing messages from the database
    try {
      const response = await axiosInstance(`/messages/${room}`);
      console.log(response.data)
      set({messages: response.data})
    } catch (error) {
      console.error('Error fetching messages:', error);
    }


    socket.off('new-message');
    socket.on('new-message', (msg) => {
      set((state) => ({ messages: [...state.messages, msg] }));
    });
  },

  

  sendText: (text) => {
     const { room, user } = get();
    if (!room || !user) return;
    socket.emit('send-message', { room, sender: user._id, text, type: 'text' });
  },

  sendImage: async (base64String) => {
  const { room, user } = get();
  if (!room || !user) return;
  socket.emit('upload-image', { room, sender: user._id, file: base64String });
  },
}));