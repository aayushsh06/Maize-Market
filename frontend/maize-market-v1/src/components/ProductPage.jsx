import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/ProductService';
import { db, ref, update, get, auth, query, orderByChild, equalTo, runTransaction } from '../api/Firebase-config';
import Loader from './Loader.jsx';
import { UserContext } from './UserContext';
import Notification from './Notification';
import '../styles/ProductPage.css'

const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { email, user, isAuthenticated } = useContext(UserContext);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isVerificationNotice, setIsVerificationNotice] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProduct(productId);
                setProduct(response.data);
                if (user) {
                    const cartRef = ref(db, `carts/${user.uid}/${productId}`);
                    const snapshot = await get(cartRef);
                    setIsInCart(snapshot.exists());
                }
                setLoading(false);
            }
            catch (e) {
                console.log(e);
            }
        }
        fetchProduct();
    }, [productId, user])

    const handleAddToCart = async () => {
        const currentUser = auth.currentUser;

        if (!isAuthenticated) {
            setIsVerificationNotice(false);
            setNotificationMessage("You need to be logged in to add items to cart. Please sign in or create an account.");
            setShowNotification(true);
            return;
        }

        if (currentUser && !currentUser.emailVerified) {
            setIsVerificationNotice(true);
            setNotificationMessage("Please verify your email before adding items to cart. Check your inbox for the verification link.");
            setShowNotification(true);
            return;
        }

        try {
            const cartUpdates = {
                [`carts/${user.uid}/${product.id}`]: {
                    dateAdded: new Date().toISOString()
                }
            };
            await update(ref(db), cartUpdates);
            setIsInCart(true);
            setNotificationMessage("Added to cart!");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleRemoveFromCart = async () => {
        if (!user) return;

        try {
            const cartUpdates = {
                [`carts/${user.uid}/${product.id}`]: null
            };
            await update(ref(db), cartUpdates);
            setIsInCart(false);
            setNotificationMessage("Removed from cart!");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const handleNotificationAction = () => {
        setShowNotification(false);
        navigate("/login");
    };

    const handleMessageClick = async () => {
        const currentUser = auth.currentUser;
    
        if (!isAuthenticated) {
            setIsVerificationNotice(false);
            setNotificationMessage("You need to be logged in to message sellers. Please sign in or create an account.");
            setShowNotification(true);
            return;
        }
    
        if (currentUser && !currentUser.emailVerified) {
            setIsVerificationNotice(true);
            setNotificationMessage("Please verify your email before messaging sellers. Check your inbox for the verification link.");
            setShowNotification(true);
            return;
        }
    
        try {
            const sellerEmail = product.sellerEmail;
            const buyerId = user.uid;
    
            const usersQuery = query(ref(db, 'users'), orderByChild('email'), equalTo(sellerEmail));
            const usersSnapshot = await get(usersQuery);
    
            let sellerId = null;
            if (usersSnapshot.exists()) {
                const users = usersSnapshot.val();
                sellerId = Object.keys(users)[0];
            }
    
            if (!sellerId) {
                setNotificationMessage("Seller not found. Please try again later.");
                setShowNotification(true);
                return;
            }
    
            const conversationId = [buyerId, sellerId].sort().join('_');
    
            try {
                const conversationRef = ref(db, `conversations/${conversationId}`);
                
                await runTransaction(conversationRef, (currentData) => {
                    if (currentData === null) {
                        return {
                            createdAt: new Date().toISOString(),
                            lastMessage: null,
                            participants: {
                                [buyerId]: true,
                                [sellerId]: true
                            }
                        };
                    }
                    return currentData;
                });
    
                const userConversationUpdates = {
                    [`userConversations/${buyerId}/${conversationId}`]: {
                        otherUserEmail: sellerEmail,
                        otherUserId: sellerId,
                        lastRead: new Date().toISOString()
                    },
                    [`userConversations/${sellerId}/${conversationId}`]: {
                        otherUserEmail: email,
                        otherUserId: buyerId,
                        lastRead: new Date().toISOString()
                    }
                };
    
                await update(ref(db), userConversationUpdates);
    
                localStorage.setItem('currentConversationId', conversationId);
    
                navigate("/messages");
    
            } catch (firebaseError) {
                console.error('Error creating conversation:', firebaseError);
                setNotificationMessage("Failed to create conversation. Please try again.");
                setShowNotification(true);
            }
    
        } catch (error) {
            console.error('Error in handleMessageClick:', error);
            setNotificationMessage("An unexpected error occurred. Please try again.");
            setShowNotification(true);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
        {showNotification && (
            isVerificationNotice || !isAuthenticated ? (
                <Notification
                    message={notificationMessage}
                    type="error"
                    buttonText="Login"
                    onButtonClick={handleNotificationAction}
                    onClose={() => setShowNotification(false)}
                    showCancelButton={true}
                    isVisible={showNotification}
                />
            ) : (
                <Notification
                    message={notificationMessage}
                    type="success"
                    onClose={() => setShowNotification(false)}
                    isVisible={showNotification}
                />
            )
        )}
        <div className="page-container">
            <div className="productPage-container" data-available={true}>
                <div className="product-image-section">
                    <div className="image-wrapper" data-available={true}>
                        <img src={product.photoUrl} alt={product.name} />
                    </div>
                </div>

                <div className="product-details">
                    <div className="product-header">
                        <h1 className="product-name">{product.name}</h1>
                        <div className="product-price">${product.price}</div>
                        <div
                            className="product-availability-badge"
                            data-available={true}
                        >
                            In Stock
                        </div>
                    </div>

                    <div className="product-main-info">
                        <div className="info-group">
                            <h2>Description</h2>
                            <p>{product.description}</p>
                        </div>

                        <div className="product-specs" data-available={true}>
                            <div className="spec-item">
                                <span className="spec-label">Condition</span>
                                <span className="spec-value">{product.condition}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Category</span>
                                <span className="spec-value">{product.category}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Listed On</span>
                                <span className="spec-value">{product.releaseDate}</span>
                            </div>
                        </div>
                        {email !== product.sellerEmail && (
                            <>
                                <button
                                    className={`cart-button ${isInCart ? 'remove' : 'add'}`}
                                    onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
                                >
                                    {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                                </button>
                                <button 
                                    className="message-button" 
                                    onClick={handleMessageClick}
                                >
                                    Message Seller
                                </button>
                            </>
                        )}
                    </div>

                    <div className="seller-section">
                        <h2>Seller Information</h2>
                        <div className="seller-info">
                            <p className="seller-name">{product.seller}<span className="product_seller">{product.sellerEmail.split('@')[1] == 'umich.edu' ?<span className='verified-icon'>✓</span> : ''}</span></p>
                            <a href={`mailto:${product.sellerEmail}`} className="seller-email">
                                {product.sellerEmail}
                            </a>
                            {email === product.sellerEmail && (
                                <Link
                                    to={`/products/edit/${product.id}`}
                                    className="edit-product-button"
                                >
                                    Edit Listing
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="product-id">Product ID: {product.id}</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProductPage