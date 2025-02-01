//=========================================================
// Provisioning Portal - v1.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import deleteDataService from 'services/dataservicetemplate/deleteDataService';
import getDataServiceAssignments from 'services/dataservicetemplateassignment/getDataServiceAssignments';
import deleteDataServiceAssignment from 'services/dataservicetemplateassignment/deleteDataServiceAssignment';

import { PATH_NAME} from 'variables/constants'

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
export default function Delete({ dataServiceId }) {
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

  const deleteRecord = async () => {
    setLoading(true)
    // deletedAssignments bool status on deleting device's assignments
    let deletedAssignments = false;
    let dataServiceAssignments = [];
    let deleteCompleted = false;
    //Delete all data service assignment
    try {
      dataServiceAssignments = await getDataServiceAssignments(dataServiceId);
      if (dataServiceAssignments?.length > 0)
        for (const record of dataServiceAssignments) {
          // Delete each data global setting
          try {
            // API request to delete a data service
            deletedAssignments = await deleteDataServiceAssignment(dataServiceId, record.id);
          } catch (error) {
            onFailed(`Failed unassigning account number: ${record.name}.`);
          }
        }
    } catch (error) {
      console.error("Error fetching accounts data:", error);
    }
    console.log("DELETED ASSIGNMENTS", deletedAssignments, dataServiceAssignments?.length)

    if (!!dataServiceAssignments || !deletedAssignments) {
      try {
        // API request to delete a data service
        deleteCompleted = await deleteDataService(dataServiceId);
        if (!deleteCompleted) {
          msg.current.innerText = "Error : failed deleting this data service.";
          onFailed();
          return;
        }
        else {
          //On Success Toast message
          onSuccess();
          nav(PATH_NAME.DATA_SERVICE);
        }
        setIsOpen(false);
      } catch (error) {
        console.log("request error");
        onFailed();
      }
    }
  };

  const onClose = () => setIsOpen(false);

  const onFailed = () => {
    setLoading(false);
    (() => {
      toast({
        title: 'Failed deleting this data service.',
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
        title: 'Successfully deleted this data service.',
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
          Delete Data Service
        </Text>
        <Text fontSize='md' color={textColorSecondary}>
          Here you can permanently delete this data service.
        </Text>
      </Flex>
      <LightMode>
        <Button
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
          onClick={() => setIsOpen(true)}
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
              Delete Data Service
            </AlertDialogHeader>
            <AlertDialogBody color={textColor}>
              Are you sure you want to delete this data service? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                isLoading={loading}
                _hover={{ backgroundColor: "brand.400" }}
                backgroundColor={"green.500"}
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                isLoading={loading}
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
  );
}

