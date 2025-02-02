import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../UserContext';
import { onValue, ref } from 'firebase/database';
import { db } from '../../api/Firebase-config.js';

const RecipientInfo = () => {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;

    const unSub = onValue(ref(db, `chats/${user.uid}`), async (doc) => {
      const items = doc.val()?.chats;
      if (items) {
        const promises = items.map(async (item) => {
          const userRef = ref(db, `users/${item.recipient}`);
          const userDoc = await get(userRef);
          return userDoc.data();
        });
        const users = await Promise.all(promises);
        setChats(users);
      } else {
        setChats([]);
      }
    });
    return () => unSub();
  }, [user]);

  console.log(chats);

  return (
    <div className="user-info">
      <div className='user'>
        <div className='circle-icon'>
          J
        </div>
        <h2>John Doe</h2>
      </div>

      <div >
        {
          chats.map((chat, index) => {
            return (
              <div className='user' key={`${chat.recipient}-${index}`}>
                <div className='circle-icon'>
                  {chat.recipient.charAt(0)}
                </div>
                <h2>{chat.recipient}</h2>
              </div>
            )
          })
        }
      </div>
      
    </div>
  )
}

export default RecipientInfo
