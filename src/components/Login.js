import React, { useRef } from 'react';
import { Box, Button, useToast, Center } from '@chakra-ui/react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const videoRef = useRef(null);
  const toast = useToast();

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      toast({
        title: 'Camera Error',
        description: 'Unable to access the camera',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('file', blob, 'login.jpg');
      axios.post('https://bitbasher-educonnect.hf.space/user/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => {
        const { token } = response.data;
        onLoginSuccess(token);
      })
      .catch(error => toast({
        title: 'Login Error',
        description: 'Failed to log in',
        status: 'error',
        duration: 5000,
        isClosable: true,
      }));
    }, 'image/jpeg');
  };

  return (
    <Center h="100vh" flexDirection="column">
      <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
      <Button colorScheme="teal" onClick={handleStartCamera}>Open Camera</Button>
      <Button colorScheme="blue" onClick={handleCapture} mt={4}>Capture & Login</Button>
    </Center>
  );
}

export default Login;
