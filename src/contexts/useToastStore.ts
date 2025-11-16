import { create } from "zustand";

interface ToastState {
    message: string;
    show: boolean;
    callback?: () => void;
    setToast: (msg:string, cb?:()=>void) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set)=>({
    message: '',
    show: false,
    callback: undefined,
    setToast: (msg,cb) => set({ message:msg, show:true, callback:cb }),
    hideToast: () => set({ show: false, callback:undefined }),
}))