//=========================================================
// Provisioning Portal - v1.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import SpinnerDialog from 'tools/spinnerDialog'
import deviceCancelDeactivation from 'services/device/deviceCancelDeactivation'

// Chakra imports
import {
    Box,
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
    AlertDialogOverlay
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { isCancel } from 'axios'

// Default function
export default function Deactivate({ imei, accountNumber, state, iridiumStatus }) {
  const textColorSecondary = "grey";
  const textColor = useColorModeValue("black", "white");
  const bgAlertbox = useColorModeValue('white', 'guardianDark.500');
  const cancelRef = useRef();
  const toast = useToast();
  const msg = useRef(null);
  const activationStatus = useRef();
  let localTime = new Date(state.scheduleTime).toLocaleString();

  console.log("state.scheduleTime: ", state.scheduleTime);
  console.log("imei: ", imei);
  console.log("accountNumber: ", accountNumber);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(state.cancelStatus);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);

  // Full screen spinner for immediate deactivation
  const [showImmediateDeactivationSpinner, setShowImmediateDeactivationSpinner] = useState(false);
  const handleImmediateDeactivationShowSpinner = () => setShowImmediateDeactivationSpinner(true);
  const handleImmediateDeactivationHideSpinner = () => setShowImmediateDeactivationSpinner(false);

  const immediateDeactivation = async () => {
    console.log("Deactivating immediately....");
    handleImmediateDeactivationShowSpinner();
  };

  // Full screen spinner for deactivation
  const [showDeactivationSpinner, setShowDeactivationSpinner] = useState(false);
  const handleDeactivationShowSpinner = () => setShowDeactivationSpinner(true);
  const handleDeactivationHideSpinner = () => setShowDeactivationSpinner(false);

  const deactivate = async () => {
    console.log("Deactivating....");
    handleDeactivationShowSpinner();
  };

  // Handle user access buttons click
  const handleCancelDeactivationClick = () => {
    try {
      // API request to update access setting   
      const update = deviceCancelDeactivation(imei, accountNumber);
      if (!update) {
        msg.current.innerText = "Error : failed udpate.";
        (() => { onFailed(); })()
        return;
      }
      else {
        //On Success Toast message
        onSuccess("Success fully cancel schedule deactivation.");
        //window.location.reload();
        window.location.href = `/admin/devices/view?account=${accountNumber}&id=${imei}`
      }
    } catch (error) {
      console.log("request error");
      (() => { onFailed(); })()
    }
  };

  const activate = async () => {


  }

  const onFailed = () => {
    setLoading(false);
    (() => {
      toast({
        title: 'Failed change access setting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = (message) => {
    setLoading(false);
    (() => {
      toast({
        title: message || 'Successful update.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

  const onClose = () => { setLoading(false); setIsOpen(false) };

  // Chakra Color Mode
  return (
    <Card direction='column' w='100%' p='34px' mb={{ base: "20px", sm: '45px', md: "55px", lg: "15px" }}>
      <Flex justifyContent='center' alignItems='center' w='100%' mb='25px' >
        <Flex direction='column' align='start' me='auto' w='85%'>
          <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
            Deactivation
          </Text>
          {state.scheduleTime ?
            <Text mt='0px' mr='5px' fontSize='sm' as='b' color={msg.current ? "red" : activationStatus.current ? 'green' : textColorSecondary}>
              Device is currently schedule for deactivation on the {localTime}.
            </Text>
            :
            <Text mt='0px' mr='5px' fontSize='sm' as='b' color={msg.current ? "red" : activationStatus.current ? 'green' : textColorSecondary}>
              Here you can deactivate a device.
            </Text>
          }
        </Flex>
        <LightMode>
          {!state.scheduleTime && (
            <Button
              isDisabled={!iridiumStatus }
              isLoading={loading}
              width={250}
              variant='brand'
              mt={{ base: "20px", md: "0", }}
              p='15px 40px'
              fontSize='sm'
              h='44px'
              fontWeight='500'
              ms='auto'
              onClick={deactivate}
            >
              Deactivate
            </Button>
          )}
          {state.scheduleTime && (
            <Button
              isDisabled={!iridiumStatus}
              isLoading={loading}
              width={250}
              variant='brand'
              mt={{ base: "20px", md: "0", }}
              p='15px 40px'
              fontSize='sm'
              h='44px'
              fontWeight='500'
              ms='auto'
              onClick={handleCancelDeactivationClick}
            >
              Cancel deactivation
            </Button>
          )}
        </LightMode>
      </Flex>
      <Flex justifyContent='center' alignItems='center' w='100%' mb='0px' >
        <Flex direction='column' align='start' me='auto' w='95%'>
        </Flex>
        <LightMode>
          <Button
            isDisabled={!iridiumStatus}
            isLoading={loading}
            width={250}
            variant='brand'
            mt={{ base: "20px", md: "0", }}
            p='15px 40px'
            fontSize='sm'
            h='44px'
            fontWeight='500'
            ms='auto'
            onClick={() => setIsOpen(true)}
            //onClick={immediateDeactivation}
          >
            Deactivate Immediately
          </Button>
        </LightMode>
      </Flex>

      {/* Handle immediate deactivation */}
      <SpinnerDialog
        imei={imei}
        accountNumber={accountNumber }
        show={showImmediateDeactivationSpinner}
        onHide={handleImmediateDeactivationHideSpinner}
        websocketUrl={`${process.env.REACT_APP_CERTUS_API_WS_URL}/provisioning/account/${accountNumber}/certus/device/${imei}/deactivate?immediate=true`}
      />

      {/* Handle deactivation */}
      <SpinnerDialog
        imei={imei}
        accountNumber={accountNumber}
        show={showDeactivationSpinner}
        onHide={handleDeactivationHideSpinner}
        websocketUrl={`${process.env.REACT_APP_CERTUS_API_WS_URL}/provisioning/account/${accountNumber}/certus/device/${imei}/deactivate`}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={bgAlertbox}>
            <AlertDialogHeader color={textColor} fontSize="lg" fontWeight="bold">
              Immediate Deactivation
            </AlertDialogHeader>
            <AlertDialogBody color={textColor}>
              {"Are you sure you want to deativate Immediately? (Please review your contract on terms of early cancellation)"}
            </AlertDialogBody>
            <AlertDialogFooter
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                _hover={{ backgroundColor: "brand.400" }}
                backgroundColor={"green.500"}
                ref={cancelRef}
                onClick={onClose}
              >
                Close
              </Button>
              {!isCancelled && state.status ? <Button
                _hover={{ backgroundColor: "brand.400" }}
                backgroundColor={"red.500"}
                onClick={immediateDeactivation}
                ml={3}
              >
                Immediate Deactivation
              </Button> : null}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>


    </Card>
  );
}

