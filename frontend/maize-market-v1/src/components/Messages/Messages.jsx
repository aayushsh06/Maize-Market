import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ref, onValue, set, push, serverTimestamp } from 'firebase/database';
import { db } from '../../firebase';
import MessageInput from './MessageInput';

const Messages = () => {
    const { user, email } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        if (!user) return;
        
        // Listen to user's conversations
        const conversationsRef = ref(db, `conversations/${user.uid}`);
        onValue(conversationsRef, (snapshot) => {
            if (snapshot.exists()) {
                const conversationsData = snapshot.val();
                setConversations(Object.values(conversationsData));
            }
        });
    }, [user]);

    const sendMessage = async (text) => {
        if (!activeChat || !text.trim()) return;
        
        const messageData = {
            senderId: user.uid,
            senderEmail: email,
            text,
            timestamp: serverTimestamp(),
        };

        // Add message to the conversation
        const messageRef = ref(db, `messages/${activeChat.id}`);
        const newMessageRef = push(messageRef);
        await set(newMessageRef, messageData);
    };

    return (
        <div className="messages-container">
            <div className="conversations-sidebar">
                {conversations.map(conv => (
                    <div 
                        key={conv.id} 
                        className={`conversation ${activeChat?.id === conv.id ? 'active' : ''}`}
                        onClick={() => setActiveChat(conv)}
                    >
                        <div className="conversation-info">
                            <span>{conv.otherUserEmail}</span>
                            <p>{conv.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="chat-area">
                {activeChat ? (
                    <>
                        <div className="messages-list">
                            {messages.map(msg => (
                                <div 
                                    key={msg.id}
                                    className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        <MessageInput onSend={sendMessage} />
                    </>
                ) : (
                    <div className="no-chat-selected">
                        Select a conversation to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages; 