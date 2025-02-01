// FullScreenSpinner.js
import React, { useState, useEffect } from 'react';
import { Box, Flex, Spinner, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { FaCheck, FaTimes } from 'react-icons/fa';

const FullScreenSpinner = ({ show, onHide, accountNumber, imei, websocketUrl }) => {
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [ws, setWs] = useState(null);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const [connected, setConnected] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const safelyParseJSON = (message) => {
    try {
      return JSON.parse(message);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (!show) return;

    const newWs = new WebSocket(websocketUrl);

    newWs.onopen = () => {
      setShowSpinner(true); // Start the spinner animation
      setConnected(true);
      setShowSuccess(true);
      console.log('Connected to WebSocket server');
      setStatusMessage('Connected...');
    };

    newWs.onmessage = (event) => {
      console.log('Received:', event.data);
      const data = safelyParseJSON(event.data);

      if (data) {
        if (data.code) {
          // If the data contains a 'code' property, it's likely an error message
          let message = data.message;
          // Check if the error code exists in the errorMessages mapping
          if (errorMessages[data.code]) {
            // If it does, use the function to get the customized message
            message = errorMessages[data.code](message);
            //setServerMessage(() => data.message)
          }
          setShowSuccess(false);
          setShowSpinner(false); // Stop the spinner animation after receiving code 400 to 500
          setStatusMessage(`${message}`);
        } else {
          const statusMap = {
            SUBMITTED: 'Connected...',
            PENDING: 'Pending...',
            PROVISIONING: 'Provisioning...',
            COMPLETED: 'Completed...',
            FAILED: 'Failed...',
            SCHEDULED: 'Deactivation is schedule...'
          };
          setStatusMessage(statusMap[data.status] || 'Unknown status');

          if (data.status === 'FAILED') {
            setServerMessage(() => data.message)
            setShowSuccess(false);
            setShowSpinner(false); // Stop the spinner animation after receiving "COMPLETED" status
          }

          // Introduce a minimum delay of 3000 milliseconds after changing the status message
          setTimeout(() => {
            if (data.status === 'COMPLETED') {
              setShowSuccess(true);
              setShowSpinner(false); // Stop the spinner animation after receiving "COMPLETED" status
              setTimeout(() => {
                onHide();
                window.location.href = `/admin/devices/view?account=${accountNumber}&id=${imei}`
              }, 5000); // Close the spinner after 3 seconds
            }
          }, 1500);
        }

      } else {
        if (event.data === 'CLOSE') {
          // Introduce a minimum delay of 3000 milliseconds after changing the status message
/*          setTimeout(() => {
            if (event.data === 'CLOSE') {
              setShowSpinner(false); // Stop the spinner animation after receiving "COMPLETED" status
              setTimeout(() => {
                onHide();
                window.location.reload();
              }, 3000); // Close the spinner after 3 seconds
            }
          }, 1500);*/
        }
      }

    };

    newWs.onclose = () => {
      console.log('Disconnected from WebSocket server');
      console.log("connected; ", connected);
      if (connected) {
        setStatusMessage('Disconnected');
      } else {

        setShowSuccess(false);
        setShowSpinner(false); // Stop the spinner animation
        setStatusMessage('Unable to connect. Please try again!');
      }
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatusMessage('Error occurred');
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, [show, websocketUrl]);

  const errorMessages = {
    400: (message) => {
      switch (message) {
        case "device is already in an active state":
          return "Device is already activated.";
        case "Device does not exist":
          return "Device cannot be activated.";
        default:
          return message;
      }
    },
    500: (message) => {
      switch (message) {
        case "Internal Server Error":
          return "Unable to connect. Please try again!";
        default:
          return message;
      }
    },
    // Add more error codes here as needed
  };

  const bg = useColorModeValue('white', 'black');
  const textColor = useColorModeValue('black', 'white');

  if (!show) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bg={bg}
      zIndex={9999}
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        height="100%"
      >
        {showSpinner ? <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" /> :
          showSuccess ? <FaCheck size={24} color="green" /> : <FaTimes size={24} color="red" />
        }
        <Text mt={3} color={textColor} fontSize="lg">
          {statusMessage}
        </Text>
        { // add Server provided error message here
          serverMessage ? <Text mt={3} color='red' fontSize="lg">
            {serverMessage}
          </Text>
            : null
        }
        <Button mt={6} onClick={() => {
          onHide();
          //window.location.reload(); // Refresh the page when the button is clicked
          window.location.href = `/admin/devices/view?account=${accountNumber}&id=${imei}`
        }}>
          Close
        </Button>
      </Flex>
    </Box>
  );
};

export default FullScreenSpinner;




