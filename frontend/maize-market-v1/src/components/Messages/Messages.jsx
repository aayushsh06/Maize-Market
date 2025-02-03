import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../UserContext';
import { ref, onValue, set, push, serverTimestamp } from 'firebase/database';
import { db } from '../../api/Firebase-config.js';
import MessageInput from './MessageInput';
import './Messages.css';
import Notification from '../Notification';

const Messages = () => {

    const { user, email } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const messagesEndRef = useRef(null);

    

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!user) return;

        const conversationsRef = ref(db, `conversations/${user.uid}`);
        onValue(conversationsRef, (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const conversationsData = snapshot.val();
                    setConversations(Object.values(conversationsData));
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        });
    }, [user]);

    useEffect(() => {
        if (!activeChat) return;

        const messagesRef = ref(db, `messages/${activeChat.id}`);
        onValue(messagesRef, (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const messagesData = snapshot.val();
                    setMessages(Object.values(messagesData));
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        });
    }, [activeChat]);

   
    const openChatWithSeller = (sellerId) => {
        const selectedConversation = conversations.find(conv => conv.otherUserEmail === sellerId);
        if (selectedConversation) {
            setActiveChat(selectedConversation);
            localStorage.removeItem('selectedSellerEmail');
        } else {
            return <Notification message="An Error Occurred." isVisible={true} onClose={() => {}} buttonText="OK" showCancelButton={false} />
        }
    };

    useEffect(() => {
        const selectedSellerId = localStorage.getItem('selectedSellerEmail');
        if (selectedSellerId) {
            openChatWithSeller(selectedSellerId);
        }
    }, [conversations]);

    const sendMessage = async (text) => {
        if (!activeChat || !text.trim()) return;

        const messageData = {
            senderId: user.uid,
            senderEmail: email,
            text,
            timestamp: serverTimestamp(),
        };

        const messageRef = ref(db, `messages/${activeChat.id}`);
        const newMessageRef = push(messageRef);
        try {
            await set(newMessageRef, messageData);
        } catch (error) {
            return <Notification message="An Error Occurred." isVisible={true} onClose={() => {}} buttonText="OK" showCancelButton={false} />
        }
    };

    const handleCloseNotification = () => {
        setNotificationVisible(false);
    };

    return (
        <>
            <Notification 
                message={notificationMessage} 
                isVisible={notificationVisible} 
                onClose={handleCloseNotification} 
                buttonText="OK" 
                showCancelButton={false} 
            />
            <div className="messages-container">
                <div className="conversations-sidebar">
                    <h3 className="conversations-title">Conversations</h3>
                    
                    {conversations.map((conv, index) => {
                        return (
                            <div
                                key={conv.id || `${conv.otherUserEmail}-${index}`}
                                className={`user ${activeChat?.id === conv.id ? 'active' : ''} conversation-item`}
                                onClick={() => setActiveChat(conv)}
                            >
                                <div className="user-info">
                                    <div className="circle-icon">
                                        {conv.otherUserEmail.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 className="user-email">
                                        {conv.otherUserEmail.split('@')[0].length > 10 ? conv.otherUserEmail.split('@')[0].substring(0, 10) + '...' : conv.otherUserEmail.split('@')[0]}</h2>
                                    <p>{conv.lastMessage}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="chat-area">
                    <div className='recipient-container'>
                        {activeChat ? <div className='circle-icon'>{activeChat.otherUserEmail.charAt(0).toUpperCase()}</div> : <></>}
                        <span className='recipient-name'>
                            {activeChat ? activeChat.otherUserEmail : 'Select a chat'}
                        </span>
                    </div>

                    {activeChat ? (
                        <>
                            <div className="messages-list">
                                {messages.map(msg => (
                                    <div
                                        key={msg.id || msg.timestamp}
                                        className={`message-container ${msg.senderId === user.uid ? 'message-container-self' : ''}`}
                                    >
                                        {msg.senderId !== user.uid && (
                                            <div className='circle-icon'>
                                                {msg.senderEmail.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className={`message-text ${msg.senderId === user.uid ? 'message-text-self' : ''}`}>
                                            <p className='message-content'>{msg.text}</p>
                                            <span className='message-time'>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <MessageInput onSend={sendMessage} />
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <h2>Select A Chat To Start Messaging</h2>
                        </div>
                    )}
                    <MessageInput onSend={sendMessage} />
                </div>
            </div>
        </>
    );
};

export default Messages; 