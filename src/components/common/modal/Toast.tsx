// components/Toast.tsx
import { useEffect } from 'react';
import { useToastStore } from '../../../contexts/useToastStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
  const { message, show, hideToast, callback } = useToastStore();

  useEffect(() => {
    if(!show || message == null) return;
    if (message && show) {
      toast(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose:()=>{
          callback?.();
          hideToast();
        }
      });
    }
  }, [show]);

  return null;
};

export default Toast;
