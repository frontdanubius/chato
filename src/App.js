import React, { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7kcIG3FSJihH97GZP_EWOIBJ3eVBr7PY",
  authDomain: "alto-f90d5.firebaseapp.com",
  databaseURL: "https://alto-f90d5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "alto-f90d5",
  storageBucket: "alto-f90d5.appspot.com",
  messagingSenderId: "649907371805",
  appId: "1:649907371805:web:b24ab4693f0163d66dabf4",
  measurementId: "G-SN85R1Q872"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Constants
const ADMIN_EMAIL = "diego@diego.com";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showInvalidLoginAlert, setShowInvalidLoginAlert] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserUID, setNewUserUID] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const messageContainerRef = useRef(null);

  // Firestore Collection Reference for Messages
  const messagesCollection = collection(db, "messages");

  // Subscribe to messages collection changes
  onSnapshot(messagesCollection, (snapshot) => {
    setMessages(snapshot.docs.map((doc) => doc.data()));
    scrollToBottom();
  });

  // Scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  // Leave a new message
  const handleLeaveMessage = async () => {
    const messageData = { user, message: newMessage, timestamp: new Date() };
    await addDoc(messagesCollection, messageData);
    setNewMessage("");
  };

  // Update username input
  const handleUpdateUsername = (e) => {
    setUsername(e.target.value);
  };

  // Update password input
  const handleUpdatePassword = (e) => {
    setPassword(e.target.value);
  };

  // Handle user login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const loggedInUser = userCredential.user;
      setUser(loggedInUser.uid);
      setShowInvalidLoginAlert(false);
    } catch (error) {
      console.error("Error signing in:", error.message);
      setUser(null);
      setShowInvalidLoginAlert(true);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Update new user email input
  const handleUpdateNewUserEmail = (e) => {
    setNewUserEmail(e.target.value);
  };

  // Update new user password input
  const handleUpdateNewUserPassword = (e) => {
    setNewUserPassword(e.target.value);
  };

  // Update new user UID input
  const handleUpdateNewUserUID = (e) => {
    setNewUserUID(e.target.value);
  };

  // Update admin password input
  const handleUpdateAdminPassword = (e) => {
    setAdminPassword(e.target.value);
  };

  // Create a new user (admin only)
  const handleCreateNewUser = async () => {
    try {
      if (username === ADMIN_EMAIL) {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, adminPassword);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          newUserEmail,
          newUserPassword
        );

        const newUser = userCredential.user;

        await updateProfile(newUser, { displayName: newUserUID });

        console.log('New user created successfully:', newUser);
      } else {
        alert("You do not have permission to create a new user.");
      }
    } catch (error) {
      console.error('Error creating a new user:', error.message);
    }
  };

  // Display invalid login alert
  const handleInvalidLoginAlert = () => {
    if (showInvalidLoginAlert) {
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="App">
      <header>
        <h1 style={{ color: user ? "green" : "blue" }}>Diego - Chat - Versao 1.0</h1>
      </header>
      {user ? (
        <>
          <div>
            <p>Welcome / Bem-vindo, {user}!</p>
            <button onClick={handleLogout}>Sair</button>
          </div>
          <div className="message-container" ref={messageContainerRef}>
            <ul>
              {messages.map((message, index) => (
                <li key={index}>
                  <strong>{message.user}</strong>: {message.message}
                  <span style={{ marginLeft: '1em' }}>
                    {message.timestamp?.toDate().toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Enviar Mensagem</h3>
            <div>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui"
              />
            </div>
            <button onClick={handleLeaveMessage}>Enviar</button>
          </div>
        </>
      ) : (
        <div>
          {handleInvalidLoginAlert()}
          <h2>Login</h2>
          <div>
            <label htmlFor="username">Usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUpdateUsername}
            />
          </div>
          <div>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleUpdatePassword}
            />
          </div>
          <button onClick={handleLogin}>Entrar</button>

          {username === ADMIN_EMAIL && (
            <div style={{ marginTop: '20px' }}>
              <h2>Criar Novo Usuário (Admin)</h2>
<div>
<label htmlFor="newUserEmail">Novo Usuário (E-mail):</label>
<input
               type="text"
               id="newUserEmail"
               value={newUserEmail}
               onChange={handleUpdateNewUserEmail}
             />
</div>
<div>
<label htmlFor="newUserPassword">Senha:</label>
<input
               type="password"
               id="newUserPassword"
               value={newUserPassword}
               onChange={handleUpdateNewUserPassword}
             />
</div>
<div>
<label htmlFor="newUserUID">UID do Novo Usuário:</label>
<input
               type="text"
               id="newUserUID"
               value={newUserUID}
               onChange={handleUpdateNewUserUID}
             />
</div>
<div>
<label htmlFor="adminPassword">Admin Password:</label>
<input
               type="password"
               id="adminPassword"
               value={adminPassword}
               onChange={handleUpdateAdminPassword}
             />
</div>
<button onClick={handleCreateNewUser}>Criar Novo Usuário</button>
</div>
)}
</div>
)}
</div>
);
}

export default App;
