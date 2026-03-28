import { create } from 'zustand';
import type { ToastType } from '@/types';
import { generateId } from '@/lib/utils';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (type, message, duration = 5000) => {
    const id = generateId();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Convenience hook
export function useToast() {
  const { addToast, removeToast, clearToasts } = useToastStore();
  
  return {
    toast: (type: ToastType, message: string, duration?: number) => 
      addToast(type, message, duration),
    success: (message: string, duration?: number) => 
      addToast('success', message, duration),
    error: (message: string, duration?: number) => 
      addToast('error', message, duration),
    warning: (message: string, duration?: number) => 
      addToast('warning', message, duration),
    info: (message: string, duration?: number) => 
      addToast('info', message, duration),
    remove: removeToast,
    clear: clearToasts,
  };
}
