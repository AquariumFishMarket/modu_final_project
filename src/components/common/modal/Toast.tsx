// components/Toast.tsx
import { useEffect } from 'react';
import { useToastStore } from '../../../contexts/useToastStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
  const { message } = useToastStore();

  useEffect(() => {
    if (message) {
      toast(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [message]);

  return null;
};

export default Toast;
