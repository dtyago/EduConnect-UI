import React, { useState, useRef, useCallback } from 'react';
import { Button, Box, useToast } from '@chakra-ui/react';
import Webcam from 'react-webcam';
import axios from 'axios';
import '../App.css'; 


const Login = ({ onLogin }) => {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const toast = useToast();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 string to a blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "user.jpg", { type: "image/jpeg" });
          login(file);
        });
    }
  }, [webcamRef]);

  const login = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('https://bitbasher-educonnect.hf.space/user/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onLogin(response.data);
      toast({ title: "Login successful.", status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: "Login failed.", description: error.toString(), status: "error", duration: 5000, isClosable: true });
    }
  };

  return (
    <Box textAlign="center" py={10}>
      {showCamera ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="mirrored"
          />
          <Button colorScheme="teal" onClick={capture} mt={4}>Login</Button>
        </Box>
      ) : (
        <Button colorScheme="teal" onClick={() => setShowCamera(true)}>Enter</Button>
      )}
    </Box>
  );
};

export default Login;
