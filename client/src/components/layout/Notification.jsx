import { useState, useEffect } from "react";

export default function SystemAlert({ message, error }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) {
    return null;
  }

  return (
    <div 
      className={`system-alert ${error ? 'alert-error' : 'alert-success'}`} 
      onClick={() => setVisible(false)}
    >
      <div className="alert-header">
        {error ? '⚠ [ SYSTEM ERROR ]' : '✓ [ SYSTEM NOTICE ]'}
      </div>
      
      <div className="alert-body">
        {message}
      </div>
    </div>
  );
}