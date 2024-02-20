import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Input, VStack, Text, Flex, HStack, IconButton, useToast, Spinner, Heading } from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import axios from 'axios';

const Chat = ({ token, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endOfMessagesRef = useRef(null);
  const toast = useToast();
  const fileInputRef = useRef(null);
  const userName = sessionStorage.getItem('userName'); // Retrieve the user's name from session storage for display

  useEffect(() => {
    // Ensure the latest message is always in view
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('https://bitbasher-educonnect.hf.space/user/upload', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessages(prevMessages => [
          ...prevMessages,
          { text: `File uploaded: ${file.name}`, type: 'user', name: "You" },
        ]);
        toast({
          title: "File uploaded successfully.",
          description: response.data.status,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "File upload failed.",
          description: error.toString(),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true); // Indicate message is being sent

    try {
      const payload = { user_input: newMessage };
      const response = await axios.post('https://bitbasher-educonnect.hf.space/user/chat', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const { ai_response } = response.data;

      // Update the chat with AI responses
      setMessages(prevMessages => [
        ...prevMessages,
        { text: ai_response, type: 'ai', label: "EduConnect AI" },
      ]);
      setNewMessage(''); // Clear input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message sending failed",
        description: "Unable to send your message. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  return (
    <Flex direction="column" height="100vh">
      <Flex justifyContent="space-between" alignItems="center" p={4} bg="blue.100">
        <Heading size="md">{userName}'s Chat</Heading>
        <Button colorScheme="red" alignSelf="flex-end" m={2} onClick={onLogout}>Logout</Button>
      </Flex>
      <Flex flex="1" direction="column-reverse" overflowY="auto" p={5} bg="gray.100">
        {messages.slice().reverse().map((msg, index) => (
          <Flex key={index} justify={msg.type === 'user' ? 'flex-end' : 'flex-start'} w="full">
            <Box bg={msg.type === 'user' ? 'blue.100' : 'green.100'} p={3} borderRadius="lg">
              <Text fontSize="md">{msg.text}</Text>
            </Box>
          </Flex>
        ))}
        <div ref={endOfMessagesRef} />
      </Flex>
      <HStack spacing={4} p={2}>
        <IconButton
          icon={<AttachmentIcon />}
          colorScheme="blue"
          aria-label="Upload PDF"
          onClick={() => fileInputRef.current.click()}
        />
        <Input
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          flex="1"
        />
        <Input
          type="file"
          id="file-upload"
          accept=".pdf"
          onChange={handleFileUpload}
          hidden
          ref={fileInputRef}
        />
        <Button colorScheme="blue" onClick={sendMessage} isLoading={isSending} loadingText="Sending" disabled={isSending}>
          Send
        </Button>
      </HStack>
    </Flex>
  );
};

export default Chat;
