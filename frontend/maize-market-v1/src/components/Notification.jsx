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
          <button className="action-button single" onClick={onClose}>
            {buttonText}
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
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  .notification-content {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 39, 76, 0.2);
    max-width: 400px;
    width: 90%;
    text-align: center;
    animation: slideUp 0.3s ease;
  }

  p {
    color: #00274C;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
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
    background: #00274C;
    color: #FFCB05;
    border: none;

    &.single {
      min-width: 120px;
      margin: 0 auto;
    }

    &:hover {
      background: #001f3d;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 39, 76, 0.2);
    }
  }

  .cancel-button {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    color: #00274C;
    border: 2px solid #00274C;

    &:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
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