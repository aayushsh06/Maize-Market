import React, { useContext, useState, useEffect } from 'react'
import { auth, db, ref, get } from '../api/Firebase-config.js'
import { UserContext } from './UserContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { getProduct } from '../api/ProductService'
import Notification from './Notification'
import Product from './Product'
import './ProductList.css'
import { FaShoppingCart } from 'react-icons/fa'
import CustomLoader from './Loader'

const Cart = () => {
  const { isAuthenticated, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!user) return;

      try {
        const cartRef = ref(db, `carts/${user.uid}`);
        const cartSnapshot = await get(cartRef);
        
        if (cartSnapshot.exists()) {
          const cartData = cartSnapshot.val();
          
          const productPromises = Object.keys(cartData).map(async (productId) => {
            try {
              const response = await getProduct(productId);
              return response.data;
            } catch (error) {
              console.error(`Error fetching product ${productId}:`, error);
              return null;
            }
          });

          const products = await Promise.all(productPromises);
          setCartProducts(products.filter(product => product !== null));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    const currentUser = auth.currentUser;
    if (!isAuthenticated || (currentUser && !currentUser.emailVerified)) {
      setShowNotification(true);
      setLoading(false);
    } else {
      fetchCartProducts();
    }
  }, [isAuthenticated, user]);

  const handleNotificationAction = () => {
    setShowNotification(false);
    navigate("/login");
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="products-container">
      {showNotification && (
        <Notification 
          message="You need to be logged in to view your cart"
          type="error"
          buttonText="Login"
          onButtonClick={handleNotificationAction}
          onClose={() => setShowNotification(false)}
          showCancelButton={true}
          isVisible={showNotification}
        />
      )}
      
      {isAuthenticated && (
        <>
          <header className="products-header">
            <h1>Your Cart</h1>
          </header>
          
          <main className='main'>
            {cartProducts.length === 0 ? (
              <div className="empty-state">
                <FaShoppingCart className="empty-icon" />
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart to see them here!</p>
                <Link to="/products" className="browse-button">
                  Browse Products
                </Link>
              </div>
            ) : (
              <ul className='product_list'>
                {cartProducts.map(product => (
                  <Product key={product.id} product={product} />
                ))}
              </ul>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default Cart
