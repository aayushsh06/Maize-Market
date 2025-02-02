import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { ref, onValue, set, push, serverTimestamp } from 'firebase/database';
import { db } from '../../api/Firebase-config.js';
import MessageInput from './MessageInput';
import './Messages.css';
import RecipientInfo from './RecipientInfo';

const Messages = () => {

    const { user, email } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);



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
            console.error("Error sending message:", error);
        }
    };


    return (
        <>
            <div className="messages-container">
                <div className="conversations-sidebar">
                    <h3>Conversations</h3>
                    <RecipientInfo />
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
                    <div className='recipient-container'>
                        <div className='circle-icon'>
                            J
                        </div>
                        <span className='recipient-name'>John Doe</span>
                    </div>

                    <div className='messages-list'>
                        <div className='message-container'>
                            <div className='circle-icon'>
                                J
                            </div>
                            <div className='message-text'>
                                <p className='message-content'>Hellofjsfksdjfkdsjkfjsdkfjadsfkajfk
                                    jsfhdasjhfjdsfjdskhfjdshfjkdshjfkhadsjfhjasdfh
                                    sdjfhjdsfhdjsafdsjfhsdjfsj
                                </p>
                                <span className='message-time'>12:00 PM</span>
                            </div>
                        </div>
                        <div className='message-container-self'>
                            <div className='message-text-self'>
                                <p className='message-content'>Hey</p>
                                <span className='message-time'>12:01 PM</span>
                            </div>
                        </div>
                    </div>
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

                        </div>
                    )}
                    <MessageInput onSend={sendMessage} />
                </div>
            </div>
        </>
    );
};

export default Messages; 