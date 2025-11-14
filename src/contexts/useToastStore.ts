import { create } from "zustand";

interface ToastState {
    message: string;
    show: boolean;
    setToast: (msg:string) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set)=>({
    message: '',
    show: false,
    location: '',
    setToast: (msg) => set({ message:msg, show:true }),
    hideToast: () => set({ show: false }),
}))