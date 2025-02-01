/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import pSetup from 'services/account/accountPassSetup';
import checkReg from 'services/account/getAccountRegistrationStatus'
import { passwordValidator } from 'tools/validators'
import { decodeIt } from 'tools/codec'

// Chakra imports
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Text,
  useToast,
} from "@chakra-ui/react";

// Custom components
import CenteredAuth from "layouts/auth/types/Centered";
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

// Default function
function NewUserPassword() {
  const [showNew, setShowNew] = useState(false);                                            // show password on click
  const [showConfirm, setShowConfirm] = useState(false);                                    // show confirmed password on click
  const [failed, setFailed] = useState(false);                                              // failed state to display Red error message
  const [loading, setLoading] = useState(false);                                            // loading state on submit
  const [update, setUpdate] = useState(false);                                              // track successful update after retrieving data from param
  let [searchParams] = useSearchParams();
  const nav = useNavigate();
  const toast = useToast();
  const token = useRef();                                                                   // token to return to provisioning API
  const id = useRef();                                                                      // hold parameters values for manipulation
  const acc = useRef();                                                                     // account number from parameter
  const email = useRef();                                                                   // email from parameter
  const expiry = useRef();                                                                  // expiry of URL from parameter
  const pBox = useRef();                                                                    // password box for focus
  let msg = useRef(null);                                                                   // error message
  const [data, setData] = useState({                                                        // new Password
    new: '',
    confirm: ''
  })

  // Chakra color mode
  const textColor = useColorModeValue("black", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");


  useEffect(() => {
    try {

      id.current = searchParams?.get('id');
      if (id.current) {
        // emailed-url : retrieving data from parameters
        email.current = id.current;
        id.current = searchParams?.get('token');
        [token.current] = id.current.split('&');
        acc.current = searchParams?.get('acc')
        expiry.current = searchParams?.get('exp');

        email.current = decodeIt(email.current);
        acc.current = decodeIt(acc.current);
        expiry.current = decodeIt(expiry.current);
        console.log(acc.current)
        console.log(email.current)
        console.log("expiry.current", (expiry.current))
        const tmpDate = new Date(expiry.current)
        // If expired error message
        if (tmpDate - Date.now() <= 0) {
          msg.current = 'Your account registration period has expired. Please contact your Administrator for a password Reset'
          onFailed();
        }
        // On Success - Update
        setUpdate(() => true);

        nav('/auth/users/newaccount')
        pBox.current.focus();
      }
    } catch {
      nav('/error')
    }
  }, [])

  useEffect(() => {

    try {
      // Check if url is valid
      (() => { return new Promise(r => setTimeout(r, 5000)) })().then(async () => {
        const regStatus = await checkReg();

        console.log("regStatus: ", regStatus);

        if (!regStatus) {
          msg.current = "Invalid request - Expired URL";
          onFailed();
          nav('/error');
        }
      })
    } catch (error) {
      console.log("DEBUG - error on load")
      nav('/error')
    }
  }, [token])

  useLayoutEffect(() => {
    document.cookie = `token=${token.current}; expires=${expiry?.current}; path=/;`
  }, [update])

  const onFailed = () => {
    setFailed(true);
    setLoading(false);
    (() => {
      toast({
        title: 'Account registration failed',
        description: msg.current,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }
  const onSuccess = () => {
    (() => {
      toast({
        title: 'Account registration successful',
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    })()
  }



  // Chakra color mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  // show entered new password
  const handleShowNew = () => setShowNew(!showNew);
  // show entered confirmed new password
  const handleShowConfirm = () => setShowConfirm(!showConfirm);

  // update password settings fields
  const OnChange = (k, v) => {
    setData((e) =>
    ({
      ...e,
      [k]: v
    })
    );
  }

  // On click or on Submit to send Request to backend API
  const ShowText = () => {
    return <Text
      color='Red'
      fontSize="md"
      w="100%"
      fontWeight="500"
      mb='20px'
      display={failed ? 'show' : 'none'}
    >
      {msg?.current || "Update password failed."}
    </Text>
  };
  // save password
  const setPassword = async () => {
    console.log('update password', data);
    setLoading(true);

    if (data.new !== data.confirm) {
      msg.current = "Confirm password does not match."
      onFailed();
      setLoading(false);
      setFailed(true);
      return;
    }
    if (!passwordValidator(data.new)) {
      msg.current = "Strong password required: Must be at least 12 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character."
      onFailed();
      setLoading(false);
      setFailed(true);
      return;
    }
    try {

      const update = await pSetup(email.current, acc.current, data.new);
      if (await !update) {
        msg.current = "Error : Failed Udpate";
        onFailed();
        setLoading(false);
        setFailed(true);
        return;
      }
    } catch (error) {
      onFailed();
      console.log("request error");
      nav('error')
      return;
    }

    console.log("Update Successful!");
    onSuccess();
    nav(`/auth/sign-in?email=${email.current}`);
    setLoading(false);
  }

  return (
    <CenteredAuth
      cardTop={{ base: "140px", md: "14vh" }}
      cardBottom={{ base: "50px", lg: "auto" }}>
      <Flex
        w='100%'
        maxW='max-content'
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        px={{ base: "25px", md: "0px" }}
        flexDirection='column'>
        <Box me='auto' mb='34px'>
          <Heading
            color={textColor}
            fontSize={{ base: "3xl", md: "36px" }}
            mb='16px'>
            Setting Account Password
          </Heading>
          <Text
            color={textColorPrimary}
            fontSize='md'
            w={{ base: "100%", lg: "456px" }}
            maxW='100%'>
            Here you can set your password.
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", lg: "456px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}
          align='start'>
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='16px'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                ref={pBox}
                value={data.new === '' ? null : data.new}
                isRequired={true}
                fontSize="sm"
                ms={{ base: '0px', md: '4px' }}
                _placeholder={{ fontWeight: "400", color: "grey" }}
                placeholder='Min. 12 characters'
                mb='24px'
                size='lg'
                type={showNew ? 'text' : 'password'}
                variant="auth"
                onChange={(e) => OnChange('new', e.target.value)}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorPrimary}
                  _hover={{ cursor: 'pointer' }}
                  as={showNew ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleShowNew}
                />
              </InputRightElement>
            </InputGroup>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='16px'>
              Confirm Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                value={data.confirm === '' ? null : data.confirm}
                isRequired={true}
                fontSize="sm"
                ms={{ base: '0px', md: '4px' }}
                _placeholder={{ fontWeight: "400", color: "grey" }}
                placeholder='Min. 12 characters'
                mb='24px'
                size='lg'
                type={showConfirm ? 'text' : 'password'}
                variant="auth"
                onChange={(e) => OnChange('confirm', e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? setPassword() : null}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorPrimary}
                  _hover={{ cursor: 'pointer' }}
                  as={showConfirm ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleShowConfirm}
                />
              </InputRightElement>
            </InputGroup>
            <ShowText />
            <Button
              isLoading={loading}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              _hover={{ bg: "brand.600" }}
              _active={{ bg: "brand.500" }}
              _focus={{ bg: "brand.500" }}
              onClick={setPassword}
            >
              Set Password
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </CenteredAuth>

  );
}

export default NewUserPassword;
