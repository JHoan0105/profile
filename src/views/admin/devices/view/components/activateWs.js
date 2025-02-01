//=========================================================
// Provisioning Portal - v1.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import SpinnerDialog from 'tools/spinnerDialog'

// Chakra imports
import {
  Button,
  Flex,
  LightMode,
  Text,
  useColorModeValue,
  Toast,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useRef, useState, useContext } from "react";
import { AuthContext } from 'contexts/AuthContext'

// Default function
export default function Activate({ imei, accountNumber, updateLines, state, iridiumStatus }) {
  const textColorSecondary = "grey";
  const textColor = useColorModeValue("black", "white");
  const msg = useRef(null);
  const activationStatus = useRef();
  const toast = Toast;

  const [loading, setLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(state.cancelStatus);

  const accountInfo = getAccountInfo();

  // FullScreenSpinner
  const [showSpinner, setShowSpinner] = useState(false);
  const handleShowSpinner = () => setShowSpinner(true);
  const handleHideSpinner = () => setShowSpinner(false);

  const activate = async () => {
    console.log("process.env.REACT_APP_CERTUS_API_WS_URL: ", process.env.REACT_APP_CERTUS_API_WS_URL);
    console.log("Activating....");
    const failedUpdate = await updateLines(false);
    console.log("FAILED UPDATE", failedUpdate)
    if ( !!failedUpdate) {
      setTimeout(() => handleShowSpinner(), 500)
    }
  };

  // Chakra Color Mode
  return (
    <Card
      mb={{base:"20px", sm:'45px', md:"55px", lg:"15px"}}
      p='30px'
      py='34px'
      flexDirection={{ base: "column", md: "row", lg: "row" }}
      alignItems='center'
      mt='0px'>
      <Flex direction='column'>
        <Text fontSize='lg' color={textColor} me='6px' fontWeight='700'>
          Activation
        </Text>
        <Text fontSize='md' as='b' color={msg.current ? "red" : activationStatus.current ? 'green' : textColorSecondary}>
          {activationStatus.current || msg.current || "Device is currently deactivated."}
        </Text>
      </Flex>
      {(accountInfo?.isGuardianAdmin || accountInfo?.isCertusProvisioning) ? (
        <LightMode>
          <Button
            isDisabled={!iridiumStatus }
            isLoading={loading}
            variant='brand'
            mt={{ base: "20px", md: "0", }}
            p='15px 40px'
            fontSize='sm'
            h='44px'
            fontWeight='500'
            ms='auto'
            onClick={activate}
          >
            Activate
          </Button>
        </LightMode>
      ) : null}
      <SpinnerDialog
        imei={imei}
        accountNumber={accountNumber }
        show={showSpinner}
        onHide={handleHideSpinner}
        websocketUrl={`${process.env.REACT_APP_CERTUS_API_WS_URL}/provisioning/account/${accountNumber}/certus/device/${imei}/activate`}
      />

    </Card>
  );
}

