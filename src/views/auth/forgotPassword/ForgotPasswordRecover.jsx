/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import reset from 'services/auth/passReset';
import { passwordValidator } from 'tools/validators'

// Chakra imports
import React, { useRef, useState, useEffect } from "react";
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
function PasswordRecovery() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const nav = useNavigate();
  const toast = useToast();
  const token = useRef();
  const id = useRef();
  const email = useRef();
  const pBox = useRef();


  // Chakra color mode
  const textColor = useColorModeValue("black", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  useEffect(() => {
    token.current = searchParams?.get('token');
    id.current = searchParams?.get('id');
    if (id.current && token.current) {
      [email.current] = id.current.split('.');
      email.current = decodeURIComponent(atob(email.current));
      pBox.current.focus();
    } else {
      nav('/error')
    }
  }, [])
  const onFailed = () => {
    setFailed(true);
    setLoading(false);
    (() => {
      toast({
        title: 'Failed password reset',
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
        title: 'Password reset successfully',
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  let msg = useRef(null);

  // new Password
  const [data, setData] = useState({
    new: '',
    confirm: ''
  })

  const handleShowNew = () => setShowNew(!showNew);
  const handleShowConfirm = () => setShowConfirm(!showConfirm);

  const OnChange = (k, v) => {
    setFailed(false);
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

  const updatePassword = async () => {
    console.log('update password', data);
    setLoading(true);
    if (data.new.length < 12 || data.confirm.length < 12) {
      msg.current = "Password must be at least 12 characters.";
      onFailed();
      setLoading(false);
      setFailed(true);
      return;
    }
    if (data.new !== data.confirm) {
      msg.current = "Confirm password does not match."
      onFailed();
      setLoading(false);
      setFailed(true);
      return;
    }
    if (!passwordValidator(data.new)) {
      msg.current = "Strong password required. Passwords must have at least 1 lowercase, 1 uppercase, 1 special character and 1 number."
      onFailed();
      setLoading(false);
      setFailed(true);
      return;
    }
    try {
      // API request update password - require username token
      // ADD API key validations / add authorization(permissions) / add UUID unique id
      const update = await reset(email.current, data.new, token.current);
      if (!update) {
        msg.current = "Error : Failed Udpate";
        onFailed();
        setLoading(false);
        setFailed(true);
        return;
      }
    } catch (error) {
      onFailed();
      console.log("request error");
      return;
    }

    console.log("Update Successful!");
    onSuccess();
    nav(`/auth/sign-in?email=${email.current}`);
    setLoading(false);
  }

  return (
    <CenteredAuth
      image={"linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"}
      cardTop={{ base: "140px", md: "24vh" }}
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
            Change Password
          </Heading>
          <Text
            color={textColor}
            fontSize='md'
            w={{ base: "100%", lg: "456px" }}
            maxW='100%'>
            Here you can set your new password.
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
              New Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                ref={pBox}
                value={data.new === '' ? null : data.new}
                isRequired={true}
                fontSize="sm"
                ms={{ base: '0px', md: '4px' }}
                placeholder='Min. 12 characters'
                mb='24px'
                size='lg'
                type={showNew ? 'text' : 'password'}
                variant="auth"
                onChange={(e) => OnChange('new', e.target.value)}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColor}
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
                placeholder='Min. 12 characters'
                mb='24px'
                size='lg'
                type={showConfirm ? 'text' : 'password'}
                variant="auth"
                onChange={(e) => OnChange('confirm', e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? updatePassword() : null}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColor}
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
              onClick={updatePassword}
            >
              Change Password
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </CenteredAuth>




  );
}

export default PasswordRecovery;