'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function UsernameList() {
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const usernamesRef = ref(database, 'usernames');
    const unsubscribe = onValue(usernamesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of usernames into an array for display
        const usernameList = Object.keys(data).map((username) => ({
          username,
          ...data[username],
        }));
        setUsernames(usernameList);
      } else {
        setUsernames([]);
      }
    }, (error) => {
      // Removed console.error
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Usernames</h2>
      {usernames.length > 0 ? (
        <ul className="list-disc pl-5">
          {usernames.map((user) => (
            <li key={user.username}>
              {user.username} (ID: {user.userId}, Email: {user.email || 'N/A'})
            </li>
          ))}
        </ul>
      ) : (
        <p>No usernames found in the database.</p>
      )}
    </div>
  );
}