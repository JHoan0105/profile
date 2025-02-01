/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import resendWelcomeEmail from 'services/account/resendWelcomeEmail';

// Chakra imports
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useEffect, useState, useRef } from "react";

// Default function
export default function NewAccount({ accountInfo, jwtAccountInfo, mb }) {
    const textColorSecondary = "grey";
    // Chakra Color Mode
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const toast = useToast();
    let msg = useRef(null)
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    // State for user access   
    const [welcomeEmailExpirationCountDown, setWelcomeEmailExpirationCountDown] = useState(0); //Seconds

    useEffect(() => {
      // Parse the account creation date
      const createdDate = new Date(accountInfo.joinDate);
      console.log("createdDate", accountInfo.joinDate);
      // Define the expiration duration, e.g., 24 hours from account creation
      const expirationDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      // Declare intervalId
      let intervalId;

      // Function to update the countdown
      const updateCountdown = () => {
        const now = new Date();
        const timeLeft = createdDate.getTime() + expirationDuration - now.getTime();
        const timeLeftInSeconds = Math.max(0, Math.floor(timeLeft / 1000));
        setWelcomeEmailExpirationCountDown(timeLeftInSeconds);

        // If the time left is zero or less, clear the interval
        if (timeLeftInSeconds <= 0) {
          clearInterval(intervalId);
        }
      };

      // Call the function initially to set the initial state
      updateCountdown();

      // Set an interval to update the countdown every second
      intervalId = setInterval(updateCountdown, 1000);

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }, [accountInfo.created_date]);

    // Handle user access buttons click
    const buttonResendWelcomeEmail = () => {
        try {
            // API request to update access setting   
            const update = resendWelcomeEmail(accountInfo.email);
            if (!update) {
                msg.current.innerText = "Error : failed udpate.";
                (() => { onFailed(); })()
                return;
            }
            else {
              //On Success Toast message
              onSuccess();
              nav('/admin/users/list');
            }
        } catch (error) {
            console.log("request error");
            (() => { onFailed(); })()
        }
    };

    const onFailed = () => {
        setLoading(false);
        (() => {
            toast({
                title: 'Failed to send welcome email.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        })()
    }

    const onSuccess = () => {
        setLoading(false);
        (() => {
            toast({
                title: 'Successfully sent welcome email.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        })()
    }

    // Utility function to format seconds into HH:mm:ss
    const formatTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
    <Card
            p='30px'
            py='34px'
            flexDirection={{ base: "column", md: "row", lg: "row" }}
            alignItems='center'
            mb={mb}>

    <Flex justifyContent='center' alignItems='center' w='100%' >
        <Flex direction='column' align='start' me='auto'>
            <Text color={textColor} fontSize='lg' me='6px' fontWeight='700'>
              Welcome Email Management
            </Text>
            <Text fontSize='md' color={textColorSecondary}>
              Time until welcome email expires: {formatTime(welcomeEmailExpirationCountDown)}
            </Text>
        </Flex>

          <Button
            isLoading={loading}
            variant='brand'
            color='white'
            fontSize='sm'
            fontWeight='500'
            _hover={{ bg: "brand.600" }}
            _active={{ bg: "brand.500" }}
            _focus={{ bg: "brand.500" }}
            onClick={buttonResendWelcomeEmail}
          >
            Resend Email
          </Button>
        
    </Flex>

    </Card>
    );
}
