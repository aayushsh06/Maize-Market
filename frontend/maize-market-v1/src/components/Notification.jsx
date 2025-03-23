import React from 'react';
import styled from 'styled-components';

const Notification = ({ message, isVisible, onClose, buttonText, onButtonClick, showCancelButton }) => {
  if (!isVisible) return null;
  
  return (
    <NotificationWrapper>
      <div className="notification-content">
        <p>{message}</p>
        {showCancelButton ? (
          <div className="button-group">
            <button className="action-button" onClick={onButtonClick}>
              {buttonText}
            </button>
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="action-button" onClick={onClose}>
            OK
          </button>
        )}
      </div>
    </NotificationWrapper>
  );
};

const NotificationWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
  
  .notification-content {
    background: #00274C;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 39, 76, 0.2);
    max-width: 400px;
    width: 90%;
    text-align: center;
    animation: slideUp 0.3s ease;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
  
  p {
    color: #FFCB05;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .action-button {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #FFCB05;
    color: #00274C;
    border: none;
    text-align: center;
    
    &.single {
      min-width: 120px;
      margin: 0 auto;
    }
    
    &:hover {
      background: #FFCB05;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 203, 5, 0.3);
    }
  }
  
  .cancel-button {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    color: #FFCB05;
    border: 2px solid #FFCB05;
    
    &:hover {
      background: rgba(255, 203, 5, 0.1);
      color: #FFCB05;
      border-color: #FFCB05;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export default Notification;