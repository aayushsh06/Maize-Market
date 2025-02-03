import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../UserContext';
import { onValue, ref } from 'firebase/database';
import { db } from '../../api/Firebase-config.js';

const RecipientInfo = () => {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);



  return (
    <div className="user-info">
      <div className='user'>
        <div className='circle-icon'>
          J
        </div>
        <h2>John Doe</h2>
      </div>


      
    </div>
  )
}

export default RecipientInfo
