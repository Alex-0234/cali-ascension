

function Notification({ message }) {

  if (message === null) {
    return null;
  } else if (message.includes("Error")) {
    return <div className="error">{message}</div>;
  } else {
    return <div className="success">{message}</div>;
  }
}
export default Notification;