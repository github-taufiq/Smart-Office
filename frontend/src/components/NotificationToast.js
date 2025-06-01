import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useParking } from '../context/ParkingContext';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const NotificationToast = () => {
  const { notifications, removeNotification } = useParking();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-success me-2" />;
      case 'error':
        return <FaExclamationTriangle className="text-danger me-2" />;
      default:
        return <FaInfoCircle className="text-info me-2" />;
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
      {notifications.map((notification, index) => (
        <Toast
          key={notification.id}
          onClose={() => removeNotification(notification.id)}
          show={true}
          delay={5000}
          autohide
        >
          <Toast.Header>
            {getIcon(notification.type)}
            <strong className="me-auto">
              {notification.type === 'success' ? 'Success' : 
               notification.type === 'error' ? 'Error' : 'Info'}
            </strong>
            <small>{new Date(notification.timestamp).toLocaleTimeString()}</small>
          </Toast.Header>
          <Toast.Body>{notification.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationToast;