import React, { useState, useEffect } from 'react';
import { Box, Input, Button, VStack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

function Chat({ token, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const toast = useToast();

  useEffect(() => {
    axios.get('https://bitbasher-educonnect.hf.space/user/chat', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setMessages(response.data.messages))
    .catch(() => toast({
      title: 'Error',
      description: 'Failed to fetch chat history.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    }));
  }, [token]);

  const handleSendMessage = () => {
    axios.post('https://bitbasher-educonnect.hf.space/user/chat', { message: input }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      setMessages([...messages, response.data.message]);
      setInput('');
    })
    .catch(() => toast({
      title: 'Error',
      description: 'Failed to send message.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    }));
  };

  return (
    <VStack spacing={4} p={5}>
      <Text fontSize="2xl">EduConnect Chat</Text>
      <Box w="full" h="xs" overflowY="auto" p={4} borderWidth="1px" borderRadius="lg">
        {messages.map((msg, index) => (
          <Box key={index} bg="gray.100" p={2} my={2} borderRadius="md">
            {msg.text}
          </Box>
        ))}
      </Box>
      <Input placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} />
      <Button colorScheme="blue" onClick={handleSendMessage}>Send</Button>
      <Button colorScheme="red" onClick={onLogout}>Logout</Button>
    </VStack>
  );
}

export default Chat;
