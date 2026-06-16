const Toast = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type || 'info'} alert-dismissible fade show`} role="alert">
      {message}
    </div>
  );
};

export default Toast;
