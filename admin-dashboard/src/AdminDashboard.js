import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './FirebaseConfig'; // Import your Firestore instance

function AdminDashboard() {
  const [userData, setUserData] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userCollection = collection(db, 'users');
      const snapshot = await getDocs(userCollection);
      const userDataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserData(userDataList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchData(); // Refresh user data
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), editUser);
      setEditUser(null);
      fetchData(); // Refresh user data
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <h1>User Database</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.id}>
              <td>{editUser && editUser.id === user.id ? (
                <input
                  type="text"
                  value={editUser.firstName}
                  onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                />
              ) : user.firstName}</td>
              <td>{editUser && editUser.id === user.id ? (
                <input
                  type="text"
                  value={editUser.lastName}
                  onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                />
              ) : user.lastName}</td>
              <td>{editUser && editUser.id === user.id ? (
                <input
                  type="text"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              ) : user.email}</td>
              <td>
                {editUser && editUser.id === user.id ? (
                  <>
                    <button onClick={() => updateUser(user.id)}>Save</button>
                    <button onClick={() => setEditUser(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditUser(user)}>Edit</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
