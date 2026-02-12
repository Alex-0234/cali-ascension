import { useState, useEffect } from "react";
import './Notification.css'

function Notification( { message, error }) {
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
    <>
    { error && (
      <div className="notification error" onClick={() => setVisible(false)}>
      {message}
      </div>
    )};
    { !error && (
      <div className="notification message" onClick={() => setVisible(false)}>
      {message}
      </div>
    )}
      </>
  );
}

export default Notification;