import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../UserContext';
import { ref, onValue, set, push, serverTimestamp, get, remove } from 'firebase/database';
import { db } from '../../api/Firebase-config.js';
import MessageInput from './MessageInput';
import './Messages.css';
import Notification from '../Notification';
import { getMyProducts } from '../../api/ProductService.js';
import MyProductList from '../MyProductList.jsx';

const Messages = () => {
    const { user, email } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [productData, setProductData] = useState({ content: [], totalElements: 0 });
    const [currentPage] = useState(0);
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);
    const messagesEndRef = useRef(null);
    const [deleteModal, setDeleteModal] = useState(false)

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const messagesContainer = document.querySelector('.messages-list');

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!user) return;
        const userConversationsRef = ref(db, `userConversations/${user.uid}`);

        onValue(userConversationsRef, async (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const conversationsData = snapshot.val();

                    const formattedConversations = await Promise.all(
                        Object.entries(conversationsData).map(async ([conversationId, convData]) => {
                            const messagesRef = ref(db, `messages/${conversationId}`);
                            const messagesSnapshot = await get(messagesRef);
                            let lastMessageText = '';

                            if (messagesSnapshot.exists()) {
                                const messagesData = messagesSnapshot.val();
                                const messagesList = Object.values(messagesData);
                                if (messagesList.length > 0) {
                                    messagesList.sort((a, b) => a.timestamp - b.timestamp);
                                    lastMessageText = messagesList[messagesList.length - 1].text;
                                }
                            }

                            return {
                                id: conversationId,
                                otherUserEmail: convData.otherUserEmail,
                                otherUserId: convData.otherUserId,
                                lastMessage: lastMessageText ?
                                    (lastMessageText.length > 20 ? lastMessageText.substring(0, 20) + '...' : lastMessageText) :
                                    'No messages yet'
                            };
                        })
                    );

                    setConversations(formattedConversations);

                    const storedConversationId = localStorage.getItem('currentConversationId');
                    if (storedConversationId) {
                        const conversationToActivate = formattedConversations.find(
                            conv => conv.id === storedConversationId
                        );

                        if (conversationToActivate) {
                            setActiveConversationId(storedConversationId);
                            setActiveChat(conversationToActivate);
                            setSelectedUserEmail(conversationToActivate.otherUserEmail);
                        }
                    }
                } else {
                    setConversations([]);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
                showNotification("Error loading conversations");
            }
        });
    }, [user, messages]);

    useEffect(() => {
        if (!activeConversationId) return;

        const messagesRef = ref(db, `messages/${activeConversationId}`);

        onValue(messagesRef, (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const messagesData = snapshot.val();
                    const messagesList = Object.entries(messagesData).map(([id, msg]) => ({
                        id,
                        ...msg,
                    }));

                    messagesList.sort((a, b) => {
                        return (a.timestamp || 0) - (b.timestamp || 0);
                    });

                    setMessages(messagesList);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
                showNotification("Error loading messages");
            }
        });
    }, [activeConversationId]);

    useEffect(() => {
        if (activeChat && activeChat.otherUserEmail) {
            getAllMyProducts(currentPage);
        }
    }, [activeChat, currentPage]);

    const getAllMyProducts = async (page = 0, size = 10) => {
        try {
            if (activeChat) {
                const { data } = await getMyProducts(page, size, activeChat.otherUserEmail);
                setProductData(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            showNotification("Error loading products");
        }
    };

    const selectConversation = (conversation) => {
        setActiveConversationId(conversation.id);
        setActiveChat(conversation);
        setSelectedUserEmail(conversation.otherUserEmail);
        localStorage.setItem('currentConversationId', conversation.id);
    };

    const sendMessage = async (text) => {
        if (!activeConversationId || !text.trim()) return;

        const messageData = {
            senderId: user.uid,
            senderEmail: email,
            text,
            timestamp: serverTimestamp(),
        };

        const messagesRef = ref(db, `messages/${activeConversationId}`);
        const newMessageRef = push(messagesRef);

        try {
            await set(newMessageRef, messageData);

            const conversationRef = ref(db, `conversations/${activeConversationId}`);

            await set(conversationRef, {
                lastMessage: text,
                lastMessageTime: serverTimestamp(),
                lastMessageSenderId: user.uid
            }, { merge: true });

        } catch (error) {
            console.error("Error sending message:", error);
            showNotification("Failed to send message");
        }
    };

    const showNotification = (message) => {
        setNotificationMessage(message);
        setNotificationVisible(true);
    };

    const handleCloseNotification = () => {
        setNotificationVisible(false);
    };

    const handleDelete = async () => {
        if (!activeConversationId || !activeConversationId.includes('_')) {
            setNotificationMessage('Error Deleting');
            setNotificationVisible(true);
        }

        const [currentUserId, otherUserId] = activeConversationId.split('_');

        try{
            const conversationPath = `conversations/${activeConversationId}`;
            const currentUserConversationPath = `userConversations/${currentUserId}/${activeConversationId}`;
            const otherUserConversationPath = `userConversations/${otherUserId}/${activeConversationId}`;
            const messagesPath = `messages/${activeConversationId}`;

            const conversationRef = ref(db, conversationPath);
            const currentUserConversationRef = ref(db, currentUserConversationPath);
            const otherUserConversationRef = ref(db, otherUserConversationPath);
            const messagesRef = ref(db, messagesPath);

            await Promise.all([
                remove(conversationRef),
                remove(currentUserConversationRef),
                remove(otherUserConversationRef),
                remove(messagesRef)
            ])
        }
        catch(error){
            setNotificationMessage(error.message);
            setNotificationVisible(true);
        }
        setActiveConversationId(null);
        setActiveChat(null);
    }

    return (
        <>
            <Notification
                message={notificationMessage}
                isVisible={notificationVisible}
                onClose={handleCloseNotification}
                buttonText="OK"
                showCancelButton={false}
            />

            {deleteModal ? 
            <div className='confirm'>
                <p>Deleting conversation will permenantly delete all messages</p>
                <div className='options'>
                    <button onClick={() => setDeleteModal(false)}>Cancel</button>
                    <button onClick={() => {
                        handleDelete();
                        setDeleteModal(false);
                    }}>Confirm</button>
                </div>
            </div>
            :<></>
            }

            <div className="messages-container">
                <div className="conversations-sidebar">
                    <h3 className="conversations-title">Conversations</h3>

                    {conversations.length > 0 ? (
                        conversations
                            .filter(conv => conv.lastMessage !== "No messages yet")
                            .map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`user conversation-item ${activeConversationId === conv.id ? 'active' : ''}`}
                                    onClick={() => selectConversation(conv)}
                                >
                                    <div className="circle-icon">
                                        {conv.otherUserEmail.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info">
                                        <h2 className="user-email">
                                            {conv.otherUserEmail.split('@')[0].length > 20
                                                ? conv.otherUserEmail.split('@')[0].substring(0, 20) + '...'
                                                : conv.otherUserEmail.split('@')[0]}
                                        </h2>
                                        <p className="preview-message">{conv.lastMessage}</p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="no-conversations">
                            <p>No conversations yet</p>
                        </div>
                    )}
                </div>

                <div className="chat-area">
                    <div className='recipient-container'>
                        {activeChat ? (
                            <>
                                <div className='circle-icon'>
                                    {activeChat.otherUserEmail.charAt(0).toUpperCase()}
                                </div>
                                <span className='recipient-name'>
                                    {activeChat.otherUserEmail}{activeChat.otherUserEmail.split('@')[1] == 'umich.edu' ? <span className='verified-icon'>✓</span> : ''}
                                </span>
                                <button onClick={() => setDeleteModal(true)}>Delete Conversation</button>
                            </>
                        ) : (
                            <span className='recipient-name'>Select a chat</span>
                        )}
                    </div>

                    {activeChat ? (
                        <>
                            <div className="messages-list">
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => {
                                        const isLastFromSender =
                                            index === messages.length - 1 ||
                                            messages[index + 1].senderId !== msg.senderId;

                                        const timestamp = msg.timestamp
                                            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : '';

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`message-container ${msg.senderId === user.uid ? 'message-container-self' : ''}`}
                                            >
                                                {msg.senderId !== user.uid && (
                                                    <div className='circle-icon'>
                                                        {msg.senderEmail.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className={`message-text ${msg.senderId === user.uid ? 'message-text-self' : ''}`}>
                                                    <p className='message-content'>{msg.text}</p>
                                                    {isLastFromSender && timestamp && (
                                                        <span className='message-time'>{timestamp}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="no-messages">
                                        <p>Start a conversation with {activeChat.otherUserEmail}</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <MessageInput onSend={sendMessage} />
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <h2>Select A Chat To Start Messaging</h2>
                        </div>
                    )}
                </div>

                <div className='products-list'>
                    {activeChat ? (
                        <>
                            <h1 className="products-list-header">
                                {activeChat.otherUserEmail.split('@')[0]}'s Products
                            </h1>
                            {productData.content && productData.content.length > 0 ? (
                                <MyProductList
                                    className='seller-products'
                                    data={productData}
                                    currentPage={currentPage}
                                    sellerEmail={selectedUserEmail}
                                    getMyProducts={getAllMyProducts}
                                />
                            ) : (
                                <div className="no-products-message">
                                    <p>This user is not selling any products yet.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-products-message">
                            <p>Select a conversation to see user's products</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Messages;