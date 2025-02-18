/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
//import userLogin from 'services/auth/useLogin';                         // Login callout
import otpVerify from 'services/auth/otpVerify';                        // 2 factor authentication call out
import getAccountInfo from 'services/account/getAccountInfo';           // User's Profile / Information

import { EMAIL_REGEX } from 'variables/constants'
import { encodeIt, decodeIt, jsonToString } from 'tools/codec'          // use encode64 and decode, jsonToString to save on localstorage

// Chakra imports
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Text,
  useToast,
} from '@chakra-ui/react';

// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

// Custom components
import CenteredAuth from 'layouts/auth/types/Centered';
// Default function
function SignIn() {
  // When user is directed to the sign-in page User cannot navigate back
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  const rm = encodeIt('rememberme');                         // used to store encoded data on localstorage
  const rmEmail = encodeIt('email');                         // used to store encoded data on localstorage

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramEmail = searchParams.get("email");


  const nav = useNavigate();
  const toast = useToast();

  const [failed, setFailed] = useState(false);                         // Set Failed state to show red message
  let msg = useRef(null);                                              // Red failed message appears when user fails signin
  const [email, setEmail] = useState('sample@email.com');                              // User's sign in email
  const [userPass, setPassword] = useState('any');                        // User's sign in password 
  const [errorMessage, setErrorMessage] = useState(null);              // Toast error message 
  const [loading, setLoading] = useState(false);                       // Button loading animation

  const emailBox = useRef();                                           // email box for UX - focused on email box
  const pBox = useRef();                                               // password box for UX - focused on password box 
  const rememberMe = useRef()                                          // used on saved remember me checkbox 

  let accountInfo;                                                     // hold user's account information onced logged in
  let cert = JSON.parse(localStorage?.getItem('certus')) || []         // retrieved saved preferences

  // Chakra color mode
  const textColor = useColorModeValue('black', 'white');
  const textColorSecondary = useColorModeValue('black', 'gray.400');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');


  useEffect(() => {
    if (paramEmail !== null) {
      // Redirection from setting a new password
      emailBox.current.value = paramEmail;
      setEmail(() => paramEmail)
      pBox.current.focus();
    } else {
      // Apply remember me here
      if (cert[rm]) {
        emailBox.current.value = decodeIt(cert[rmEmail])
        setEmail(() => decodeIt(cert[rmEmail]))
        pBox.current.focus();
      } else {
        emailBox.current.focus();
      }
    }
  }, [])

  const handleUserEmail = (e) => {
    setEmail(e.target.value);
    setFailed(false);
  };

  const handleUserPassword = (e) => {
    setPassword(e.target.value);
  };

  const ShowText = ({ errorMessage }) => {
    return <Text
      color='Red'
      fontSize="md"
      w="100%"
      fontWeight="500"
      mb='20px'
      display={failed ? 'show' : 'none'}
    >
      {errorMessage || "Failed Login!"}
    </Text>
  };

  //show password
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const onFailed = (errorMessage) => {
    setFailed(true);
    setLoading(false);
    setErrorMessage(errorMessage); // Set errorMessage state
    (() => {
      toast({
        title: 'Failed Login',
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }
  const onSuccess = () => {
    (() => {
      toast({
        title: 'Login Successful',
        description: `Welcome, ${accountInfo.firstName + ' ' + accountInfo.lastName}`,
        status: accountInfo.is2FactorEnabled === true ? "loading" : "success",
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  // make request to authenticate with server
  const authenticateUser = async () => {

    const userLogin = (email, password) => {
      return {message: 'login successful'}
    }

    setLoading(true);
    // failed messages
    if (!email) {
      msg.current = "Please enter a email address.";
      (() => onFailed())()
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      msg.current = "Please enter a valid email address.";
      (() => onFailed())()
      return;
    }
    if (!userPass) {
      msg.current = "Please enter a password.";
      (() => onFailed())()
      return;
    }
    if (userPass.length < 8) {
      msg.current = "Password must be at least 12 characters.";
      (() => onFailed())()
    }

    try {

      const response = (await userLogin(email.toLowerCase(), userPass));
      console.log("message: " + response.message);

      if ((response.message) == "Invalid login!") {
        (() => onFailed("Invalid login!"))()
        return;
      } else if ((response.message) == "Access revoked. Please contact support for assistance.") {
        (() => onFailed(response.message))()

        return;
      }

      //Get user info from cookies
      accountInfo = getAccountInfo();
      console.log("userInfo.email", accountInfo.email);

      setLoading(false); console.log("accountInfo.email1", accountInfo.email);
      (() => onSuccess())()
      console.log("accountInfo.email2", accountInfo.email);
      // Remember Me
      if (rememberMe.current.checked) {
        console.log('save remember me')
        cert = { [rm]: rememberMe.current.checked, [rmEmail]: encodeIt(email) }
        localStorage.setItem('certus', jsonToString(cert))
      } else {
        if (localStorage?.getItem('certus')) {
          cert = { [rm]: rememberMe.current.checked }
          localStorage.setItem('certus', jsonToString(cert))
        }
      }

      //After all user data loaded check 2FA settings
      if (accountInfo.is2FactorEnabled) {
        otpVerify(accountInfo.firstName, accountInfo.email)
        nav("/auth/verification");
      } else {
        nav("/main/dashboard");
      }
      console.log("userInfo.email3", accountInfo.email);
    } catch (e) {
      //msg.current= "Failed authentication. Please check your login email or password."
      (() => onFailed())()
      setLoading(false);
      return;
    }
  };

  return (
    <CenteredAuth
      cardTop={{ base: '140px', md: '14vh' }}
      cardBottom={{ base: '50px', lg: 'auto' }}
      mx="0px"
    >

      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        justifyContent="center"
        px={{ base: '20px', md: '0px' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >

          <FormControl >
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email<Text color={brandStars}>*</Text>
            </FormLabel>

            <Input
              ref={emailBox}
              value={email === '' ? '' : email}
              isRequired={true}
              variant="auth"
              fontSize="sm"
              ms={{ base: '0px', md: '0px' }}
              type="email"
              placeholder="email@override.com"
              _placeholder={{ fontWeight: "400", color: "grey" }}
              mb="24px"
              fontWeight="500"
              size="lg"
              onChange={handleUserEmail}
            />

            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <FormControl>
              <InputGroup size="md">
                <Input
                  id='signinpass'
                  ref={pBox}
                  value={userPass === '' ? '' : userPass}
                  isRequired={true}
                  fontSize="sm"
                  ms={{ base: '0px', md: '4px' }}
                  placeholder="Min. 12 characters"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
                  _placeholder={{ fontWeight: "400", color: "grey" }}
                  onChange={handleUserPassword}
                  onKeyDown={e => e.key === 'Enter' ? authenticateUser() : null}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <ShowText errorMessage={errorMessage} />
            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox defaultChecked={cert[rm] ?? false ? true : false} id="remember-login" colorScheme="brand" me="10px" ref={rememberMe} />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                  color={textColor}
                  fontSize="sm"
                >
                  Remember me
                </FormLabel>
              </FormControl>
              <NavLink to={`/auth/forgot-password?email=${email}`}>
                <Text
                  color={textColorBrand}
                  fontSize="sm"
                  w="124px"
                  fontWeight="500"
                >
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
              isLoading={loading}
              fontSize="sm"
              variant="brand"
              fontWeight="800"
              w="100%"
              h="50"
              mb="24px"

              colorScheme='blue'
              onClick={authenticateUser}
            >
              Log In
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
          </Flex>
        </Flex>
      </Flex>
    </CenteredAuth>
  );
}


export default SignIn;
