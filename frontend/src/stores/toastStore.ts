import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warn';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toasts = writable<Toast[]>([]);

function addToast(toast: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = { ...toast, id };
  toasts.update(t => [...t, newToast]);

  // Auto remove after duration
  setTimeout(() => removeToast(id), toast.duration || 5000);
}

function removeToast(id: string) {
  toasts.update(t => t.filter(toast => toast.id !== id));
}

export function showToast(message: string, type: ToastType = 'success', duration = 5000) {
  addToast({ message, type, duration });
}

export { toasts, addToast, removeToast };