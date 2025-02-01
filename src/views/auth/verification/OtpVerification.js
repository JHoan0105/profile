/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import checkOtp from "services/auth/checkOtp"
import getAccountInfo from 'services/account/getAccountInfo';

// Imports
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, PinInput, PinInputField, Button, FormControl, useToast } from '@chakra-ui/react';

// Default function
const OTPVerification = () => {
  const nav = useNavigate();
  const inputPin = useRef();
  const toast = useToast();

  useEffect(() => {
    inputPin.current.focus();
  }, [])

  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP  
  const handleVerify = async (e) => {
    if (e.length === 6) {
      const accountInfo = getAccountInfo();
      console.log("OTPVerification.js, accountInfo.email: ", accountInfo.email);

      const otpStatus = await checkOtp(accountInfo.email, e);

      if (await otpStatus) {
        (() => {
          toast({
            title: `Welcome ${accountInfo.firstName + accountInfo.lastName}`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })()
        nav("/admin");
      } else {

        (() => {
          toast({
            title: 'Failed Login',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        })()
      }
    }
  }

  return (
    <FormControl>
      <Flex justify='center' alignItems="center" >
        <PinInput mx='auto' otp mask value={otp.join('')} onChange={(value) => { setOtp(value.split('')); handleVerify(value); }}>
          {[...Array(6)].map((_, index) => (
            <PinInputField
              ref={index === 0 ? inputPin : null}
              key={index}
              fontSize='36px'
              color='black' // Replace with your desired text color
              borderRadius='16px'
              borderColor='gray.300' // Replace with your desired border color
              h={{ base: '63px', md: '95px' }}
              w={{ base: '63px', md: '95px' }}
              me={index < 5 ? '10px' : '0'}
            />
          ))}
        </PinInput>
      </Flex>

      <Flex mt='10px'>
        <Button
          fontSize='14px'
          variant='brand'
          borderRadius='16px'
          fontWeight='500'
          w='100%'
          h='50'
          mb='24px'
          mt='12px'
          onClick={handleVerify} ml="10px">
          Unlock
        </Button>
      </Flex>
    </FormControl>
  );
};
export default OTPVerification;