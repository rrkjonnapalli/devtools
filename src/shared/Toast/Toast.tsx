// Toast.jsx
import { useEffect } from 'react';
import './Toast.css';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number; // in milliseconds
};

export default function Toast({ message, type = 'error', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="toast">
      <div className={`toast-content toast-${type}`}>
        <span className="toast-message">{message}</span>
        <button onClick={onClose} className="toast-close">×</button>
      </div>
    </div>
  );
}