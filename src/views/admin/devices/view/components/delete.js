//=========================================================
// Provisioning Portal - v1.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports

import deleteDevice from 'services/device/deleteDevice'
import { activeDevice, restrictedError } from 'tools/validators'

// Chakra imports
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
import { useNavigate } from 'react-router-dom';

// Default function
export default function Delete({ imei, accountNumber, iridiumStatus }) {
  const textColorSecondary = "grey";
  const textColor = useColorModeValue("black", "white");
  const bgAlertbox = useColorModeValue('white', 'guardianDark.500');
  const bgHover = useColorModeValue('black', "whiteAlpha.100");
  const toast = useToast();
  const cancelRef = useRef();
  let msg = useRef(null)

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onDelete = async () => {
    //Delete all data service assignment
    msg.current = undefined;
    try {
      // API request to delete
      const result = await deleteDevice(accountNumber, imei);
      if (result) {
        //On Success Toast message
        onSuccess();
        nav('/admin/devices');
      }
    } catch (error) {
      const tmp = error.toString();
      console.log("request error");
      if (activeDevice(tmp)) {
        msg.current = "Cannot delete active device."
        onFailed('Cannot delete active device.');
      } else if (restrictedError(tmp)) {
        msg.current = "Device deletion restricted."
        onFailed('Delete restricted.')
      } // add other error states on Delete
      else {
        msg.current = tmp;
        onFailed("Failed deleting device.")
      }
    } finally {
      setLoading(false)
      setIsOpen(false);
    }
  };

  const onClose = () => { setIsOpen(false); setLoading(() => false) };

  const onFailed = (s) => {
    setLoading(false);
    (() => {
      toast({
        title: s || 'Failed deleting this device.',
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
        title: 'Successfully deleted device.',
        status: 'info',
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
      mt='20px'>
      <Flex direction='column'>
        <Text fontSize='lg' color={textColor} me='6px' fontWeight='700'>
          Delete Device
        </Text>
        <Text fontSize='md' color={msg.current ? 'red' : textColorSecondary}>
          {msg.current || "Here you can permanently delete this device"}
        </Text>
      </Flex>
      <LightMode>
        <Button
          isDisabled={!iridiumStatus}
          isLoading={loading}
          colorScheme='red'
          variant='outline'
          mt={{ base: "20px", md: "0", }}
          _hover={{ bg: bgHover, opacity: "0.75", }}
          _focus={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
          p='15px 40px'
          fontSize='sm'
          h='44px'
          fontWeight='500'
          ms='auto'
          onClick={() => { setLoading(() => true); setIsOpen(() => true); }}
        >
          Delete
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
              Delete Device
            </AlertDialogHeader>
            <AlertDialogBody color={textColor}>
              Are you sure you want to delete this device? This action cannot be undone.
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
                onClick={onDelete} ml={3}
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

