import React, { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa'; 

const MessageInput = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button type="submit" className='send-button'>
                <FaArrowUp />
            </button>
        </form>
    );
};

export default MessageInput;