import { useState, useEffect } from "react";

function Notification({ message }) {
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
    <div className="notification" onClick={() => setVisible(false)}>
      {message}
    </div>
  );
}

export default Notification;