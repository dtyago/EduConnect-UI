import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Input, VStack, Text, Flex, HStack, Spinner } from '@chakra-ui/react';
import axios from 'axios';

const Chat = ({ token, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom every time messages update

  useEffect(() => {
    // Fetch chat history logic here
  }, [token]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    // Immediately display the user message
    setMessages(prevMessages => [
      ...prevMessages,
      { text: newMessage, type: 'user', name: "You" },
    ]);
    setNewMessage(''); // Clear input field

    setIsSending(true); // Start loading
  
    try {
      const payload = { user_input: newMessage };
  
      const response = await axios.post('https://bitbasher-educonnect.hf.space/user/chat', { ...payload}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const { ai_response } = response.data;
  
      // Update the chat with AI response
      setMessages(prevMessages => [
        ...prevMessages,
        { text: ai_response, type: 'ai', label: "EduConnect" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally handle error, e.g., show an error message
    }
  
    setIsSending(false); // End loading
  };
  

  return (
    <VStack spacing={4}>
      <Button colorScheme="red" alignSelf="flex-end" onClick={() => onLogout(token)}>Logout</Button>
      <Flex direction="column" p={5} overflowY="auto" bg="gray.100" height="400px" width="100%" css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray',
          borderRadius: '24px',
        },
      }}>
      {messages.map((msg, index) => (
        <Flex key={index} justify={msg.type === 'user' ? 'flex-end' : 'flex-start'} w="full">
          <Box bg={msg.type === 'user' ? 'blue.100' : 'green.100'} p={3} borderRadius="lg" maxWidth="70%">
            <Text fontSize="md">{msg.text}</Text>
            {index === messages.length - 1 && isSending && <Spinner ml={4} />}
          </Box>
        </Flex>
      ))}
      {/* Invisible element to mark the end of messages */}
      <div ref={endOfMessagesRef} />
      </Flex>
      <HStack width="100%">
        <Input
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          flex="1"
        />
        <Button colorScheme="blue" onClick={sendMessage} isLoading={isSending} loadingText="Sending" disabled={isSending}>
          Send
        </Button>
      </HStack>
    </VStack>
  );
};

export default Chat;
