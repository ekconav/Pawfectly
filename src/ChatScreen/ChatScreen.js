// ChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions

const ChatScreen = ({ currentUserType, recipientType, db }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        sender: currentUserType,
        recipient: recipientType,
        timestamp: serverTimestamp()
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View>
      {messages.map((msg, index) => (
        <Text key={index}>{msg.sender}: {msg.text}</Text>
      ))}
      <TextInput
        placeholder="Type your message..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatScreen;
