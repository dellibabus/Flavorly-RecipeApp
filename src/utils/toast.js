import { create } from 'zustand';

export const useToastStore = create((set) => ({
  visible: false,
  message: '',
  type: 'success', // 'success' | 'error' | 'info'
  _timer: null,

  show: (message, type = 'success', duration = 2500) => {
    set((state) => {
      if (state._timer) clearTimeout(state._timer);
      const timer = setTimeout(() => {
        set({ visible: false, message: '', _timer: null });
      }, duration);
      return { visible: true, message, type, _timer: timer };
    });
  },

  hide: () => {
    set((state) => {
      if (state._timer) clearTimeout(state._timer);
      return { visible: false, message: '', _timer: null };
    });
  },
}));

// Convenience helper — call anywhere without hooks
export const toast = {
  success: (msg, duration) => useToastStore.getState().show(msg, 'success', duration),
  error: (msg, duration) => useToastStore.getState().show(msg, 'error', duration),
  info: (msg, duration) => useToastStore.getState().show(msg, 'info', duration),
};
