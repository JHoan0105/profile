//=========================================================
// Provisioning Portal - v2.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import deleteAccount from 'services/account/deleteAccount';
import { PATH_NAME } from 'variables/constants'

// Chakra imports
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Flex,
  LightMode,
  Text,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useRef, useState } from "react";

// Default function
export default function Delete({ accountInfo, mb }) {
  const textColorSecondary = "grey";
  const textColor = useColorModeValue("black", "white");
  const toast = useToast();
  const cancelRef = useRef();
  let msg = useRef(null)
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();
  const bgAlertbox = useColorModeValue('white', 'guardianDark.500');

  const deleteUser = async () => {
    try {
      // API request to delete a user account  
      const update = await deleteAccount(accountInfo.id);
      if (!update) {
        msg.current.innerText = "Error : failed deleting this account.";
        (() => { onFailed(); })()
        return;
      } else {
        //On Success Toast message
        onSuccess();
        nav(PATH_NAME.USER_LIST);
      }
        } catch (error) {
    console.log("request error");
    (() => { onFailed(); })()
  }
  console.log('User deleted.');
  setIsOpen(false);
};

const onClose = () => setIsOpen(false);

const onFailed = () => {
  (() => {
    toast({
      title: 'Failed deleting this account.',
      status: 'error',
      duration: 9000,
      isClosable: true,
    })
  })()
}

const onSuccess = () => {
  (() => {
    toast({
      title: 'Successfully deleted this account. Warning: Users must logout for changes to take effect.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    })
  })()
}

// Chakra Color Mode
return (
  <Card
    p='30px'
    py='34px'
    flexDirection={{ base: "column", md: "row", lg: "row" }}
    alignItems='center'
    mb={mb}>
    <Flex direction='column'>
      <Text fontSize='lg' color={textColor} me='6px' fontWeight='700'>
        Delete Account
      </Text>
      <Text fontSize='md' color={textColorSecondary}>
        Here you can permanently delete this account.
      </Text>
    </Flex>
    <LightMode>
      <Button
        colorScheme='red'
        variant='outline'
        mt={{ base: "20px", md: "0", }}
        _hover={{ bg: "whiteAlpha.100" }}
        _focus={{ bg: "transparent" }}
        _active={{ bg: "transparent" }}
        p='15px 40px'
        fontSize='sm'
        h='44px'
        fontWeight='500'
        ms='auto'
        onClick={() => setIsOpen(true)}
      >
        Delete account
      </Button>
    </LightMode>

    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg={bgAlertbox}>
          <AlertDialogHeader color={textColor} fontSize="lg" fontWeight="bold">
            Delete Account
          </AlertDialogHeader>
          <AlertDialogBody color={textColorSecondary}>
            Are you sure you want to delete this account? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              _hover={{ backgroundColor: "brand.400" }}
              backgroundColor={"green.500"}
              ref={cancelRef}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              _hover={{ backgroundColor: "brand.400" }}
              backgroundColor={"red.500"}
              onClick={deleteUser} ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </Card>
);
}

