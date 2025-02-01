//=========================================================
// Provisioning Portal - v2.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import deleteAccountNumber from 'services/manageAccounts/deleteAccountNumber';
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
export default function DeleteAccount({ accountInfo,accountnumber, accountname, users}) {
  const textColorSecondary = "grey";
  const textColor = useColorModeValue("black", "white");
  const toast = useToast();
  const cancelRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();
  const bgAlertbox = useColorModeValue('white', 'guardianDark.500');

  const deleteAccount = async () => {
    if (users) {
      onFailed('Cannot delete an account with users.')
      setIsOpen(false);
      return;
    }
    try {
      // API request to delete a user account  
      const update = await deleteAccountNumber(accountnumber, accountname)
      if (!update) {
        onFailed('Unauthorized action: Please contact Guardian Administrator.');
        setIsOpen(false);
        return;
      }
      else {
        if (localStorage.getItem('accountNumber') === accountnumber) {
          localStorage.setItem('accountNumber', accountInfo?.accountNumbers[0]?.account_number)
          window.location.reload();
        }
        //On Success Toast message
        onSuccess();
        //Get all accounts for the account number
        nav(PATH_NAME.ACCOUNT_NUMBERS);
      }
    } catch (error) {
      console.log("request error ");
      onFailed();
    }
    console.log('User deleted.');
    setIsOpen(false);
  };

  const onClose = () => setIsOpen(false);

  const onFailed = (s) => {
    (() => {
      toast({
        title: s || 'Failed deleting this account.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = () => {
    (() => {
      toast({
        title: 'Successfully deleted this account.',
        status: 'success',
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
    >
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
                onClick={deleteAccount} ml={3}
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

