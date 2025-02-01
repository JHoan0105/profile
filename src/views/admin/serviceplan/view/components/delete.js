//=========================================================
// Provisioning Portal - v2.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import deleteBundle from 'services/serviceplan/deleteBundle';
import { PATH_NAME } from 'variables/constants'

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
export default function DeleteBundle({ rowData}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [failed, setFailed] = useState(false);
  const textColor = useColorModeValue("black", "white");
  const bgAlertbox = useColorModeValue('white', 'guardianDark.500');
  const toast = useToast();
  const cancelRef = useRef();
  let msg = useRef(null)
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();

  const deleteRecord = async () => {
    //Delete all data service assignment
    try {
      const resDeleteBundle = await deleteBundle(rowData.id, rowData?.accountNumber);

      if (resDeleteBundle) {
        onSuccess();
        nav(PATH_NAME.SERVICE_PLAN);
      }

    } catch (error) {
      console.log("error.message (Delete Bundle): ", error.message);
      if (error.message === "cannot delete bundle with one or more active devices") {
        console.log("Cannot delete bundle with one or more active devices.");
        onFailed("Cannot delete bundle with one or more active devices.");
      } else {
        console.log("request error");
        onFailed("Failed to update service plan.");
      }
      if (error?.toString() === 'Error: token expired') {
        nav('/')
      }
    }

    setIsOpen(false);
  };

  const onClose = () => setIsOpen(false);

  const onFailed = (errorMessage) => {
    setErrorMessage(errorMessage); // Set errorMessage state
    setFailed(true); // Update failed state to true
    (() => {
      toast({

        title: msg.current,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = () => {
    setFailed(false); // Reset failed state to false
    (() => {
        toast({
            title: 'Successfully deleted this Service Plan.',
            status: 'info',
            duration: 5000,
            isClosable: true,
        })
    })()
  }

  const ShowText = ({ errorMessage }) => {
    return <Text
      color='Red'
      fontSize="md"
      w="100%"
      fontWeight="500"
      mb='20px'
      display={failed ? 'show' : 'none'}
    >
      {errorMessage || "Update Service Plan failed."}
    </Text>
  };

    // Chakra Color Mode
  return (
    <>
      <Card
        p='30px'
        py='34px'
        flexDirection={{ base: "column", md: "row", lg: "row" }}
        alignItems='center'
        >
        <Flex direction='column' flex="1" >
          <Text fontSize='lg' color={textColor} me='6px' fontWeight='700'>
            Delete Service Plan
          </Text>
          <Text fontSize='md' color={textColor }>
             
            Here you can permanently delete this service plan.
          </Text>
          <Flex direction={{ base: "column", md: "row", lg: "row" }} flex="1">
            <ShowText errorMessage={errorMessage} />
          </Flex>  
        </Flex>
        <Flex direction={{ base: "column", md: "row", lg: "row" }} flex="1">
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
              Delete
            </Button>
          </LightMode>
        </Flex>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent bg={bgAlertbox}>
              <AlertDialogHeader color={textColor} fontSize="lg" fontWeight="bold">
                Delete Service Plan
              </AlertDialogHeader>
                          <AlertDialogBody textColor={textColor }>
                Are you sure you want to delete this service plan? This action cannot be undone.
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
                  onClick={deleteRecord} ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Card>
    </>
  );
}

