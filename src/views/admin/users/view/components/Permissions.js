/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import updatePermission from 'services/account/updatePermission';

// Chakra imports
import { Button, Flex, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";

// Custom components
import Card from "components/card/Card.js";

// Default function
export default function Permissions({ accountInfo, jwtAccountInfo, mb }) {
  // Chakra Color Mode
  const textColor = useColorModeValue("black", "white");
  const secondaryTextColor = useColorModeValue("grey", "grey");

  const toast = useToast();
  let msg = useRef(null)
  const [loading, setLoading] = useState(false);

  // State for 2fa and all permission button   
  const [is2FactorEnabled, setIs2FactorEnabled] = useState(accountInfo.is2FactorEnabled);
  const [isGuardianAdmin, setIsGuardianAdmin] = useState(accountInfo?.isGuardianAdmin);
  const [isAccountManagement, setIsAccountManagement] = useState(accountInfo?.isAccountManagement);
  const [isAlertManagement, setIsAlertManagement] = useState(accountInfo.isAlertManagement);
  const [isVpnManagement, setIsVpnManagement] = useState(accountInfo.isVpnManagement);
  const [isCertusProvisioning, setIsCertusProvisioning] = useState(accountInfo?.isCertusProvisioning);

  useEffect(() => {
    setIs2FactorEnabled(accountInfo.is2FactorEnabled);
    setIsGuardianAdmin(accountInfo?.isGuardianAdmin);
    setIsAccountManagement(accountInfo?.isAccountManagement);
    setIsAlertManagement(accountInfo.isAlertManagement);
    setIsVpnManagement(accountInfo.isVpnManagement);
    setIsCertusProvisioning(accountInfo?.isCertusProvisioning);
  }, [accountInfo.is2FactorEnabled, accountInfo?.isGuardianAdmin, accountInfo?.isAccountManagement, accountInfo.isAlertManagement, accountInfo.isVpnManagement, accountInfo?.isCertusProvisioning]);

  // Handle permission buttons click
  const handle2FactorClick = () => {
    setIs2FactorEnabled(prevState => !prevState); // Toggle state
  };

  const handleGuardianAdminClick = () => {
    setIsGuardianAdmin(prevState => !prevState); // Toggle state
  };

  const handleAccountManagementClick = () => {
    setIsAccountManagement(prevState => !prevState); // Toggle state
  };

  const handleAlertManagementClick = () => {
    setIsAlertManagement(prevState => !prevState); // Toggle state
  };

  const handleVpnManagementClick = () => {
    setIsVpnManagement(prevState => !prevState); // Toggle state
  };

  const handleCertusProvisioningClick = () => {
    setIsCertusProvisioning(prevState => !prevState); // Toggle state
  };

  const savePermissionSetting = async () => {
    setLoading(true);
    try {
      // API request to update permission setting   
      const update = await updatePermission(accountInfo.id, is2FactorEnabled, isGuardianAdmin, isAccountManagement, isAlertManagement, isVpnManagement, isCertusProvisioning);
      if (!update) {
        msg.current.innerText = "Error : failed udpate.";
        onFailed()
        return;
      } else {
        //On Success Toast message
        onSuccess();
      }

    } catch (error) {
      console.log("request error");
      onFailed();
    }
  }

  const onFailed = () => {
    setLoading(false);
    (() => {
      toast({
        title: 'Failed change permission setting.',
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
        title: 'Successfully changed permission setting. Warning: Users must re-login for changes to take effect.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

  return (
    <Card direction='column' w='100%' p='34px' mb={mb} >

      <Flex justifyContent='center' alignItems='center' w='100%' mb='25px' >
        { /* Two Factor Authentication */}
        <Flex direction='column' align='start' me='auto'>
          <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
            Two-Factor Authentication
          </Text>
          <Text color={secondaryTextColor} fontSize='sm' fontWeight='500'>
            Get a code to your email address.
          </Text>
        </Flex>
        <Button
          _hover={jwtAccountInfo?.isGuardianAdmin || jwtAccountInfo?.isAccountManagement ? { backgroundColor: "brand.400" } : {}}
          px='24px'
          onClick={jwtAccountInfo?.isGuardianAdmin || jwtAccountInfo?.isAccountManagement ? handle2FactorClick : null}
          fontSize='sm'
          fontWeight='700'
          backgroundColor={is2FactorEnabled ? "green.500" : "red.500"}
        >
          {is2FactorEnabled ? "ENABLED " : "DISABLED"}
        </Button>
      </Flex>
      { /* Guardian Administrator */}
      {jwtAccountInfo?.isGuardianAdmin && ( // Conditionally render if isGuardianAdmin is true
        <Flex justifyContent='center' alignItems='center' w='100%' mb='25px' >
          <Flex direction='column' align='start' me='auto'>
            <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
              Guardian Administrator
            </Text>
            <Text color={secondaryTextColor} fontSize='sm' fontWeight='500'>
              SuperAdmin / Support.
            </Text>
          </Flex>
          <Button
            _hover={jwtAccountInfo?.isGuardianAdmin ? { backgroundColor: "brand.400" } : {}}
            px='24px'
            onClick={jwtAccountInfo?.isGuardianAdmin ? handleGuardianAdminClick : null}
            fontSize='sm'
            fontWeight='700'
            backgroundColor={isGuardianAdmin ? "green.500" : "red.500"}
          >
            {isGuardianAdmin ? "ENABLED " : "DISABLED"}
          </Button>
        </Flex>
      )}
      { /* Account Management */}
      {(jwtAccountInfo?.isGuardianAdmin || jwtAccountInfo?.isAccountManagement) && ( // Conditionally render if isGuardianAdmin or isAccountManagement is true
        <Flex justifyContent='center' alignItems='center' w='100%' mb='25px'>
          <Flex direction='column' align='start' me='auto'>
            <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
              Account Management
            </Text>
            <Text color={secondaryTextColor} fontSize='sm' fontWeight='500'>
              Account settings.
            </Text>
          </Flex>
          <Button
            _hover={(jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && jwtAccountInfo.id !== accountInfo.id && !isGuardianAdmin)) ? { backgroundColor: "brand.400" } : {}}
            px='24px'
            onClick={(jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && jwtAccountInfo.id !== accountInfo.id && !isGuardianAdmin)) ? handleAccountManagementClick : null}
            fontSize='sm'
            fontWeight='700'
            backgroundColor={isAccountManagement ? "green.500" : "red.500"}>
            {isAccountManagement ? "ENABLED " : "DISABLED"}
          </Button>
        </Flex>
      )}
      { /* Provisioning */}
      {(jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && jwtAccountInfo?.isCertusProvisioning) || jwtAccountInfo?.isCertusProvisioning) && ( // Conditionally render if isGuardianAdmin is true or (isAccountManagement and isCertusProvisioning is true)
        <Flex justifyContent='center' alignItems='center' w='100%' mb='25px'>
          <Flex direction='column' align='start' me='auto'>
            <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
              Provisioning
            </Text>
            <Text color={secondaryTextColor} fontSize='sm' fontWeight='500'>
              Create new units.
            </Text>
          </Flex>
          <Button
            _hover={jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && !isGuardianAdmin) ? { backgroundColor: "brand.400" } : {}}
            px='24px'
            onClick={jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && !isGuardianAdmin) ? handleCertusProvisioningClick : null}
            fontSize='sm'
            fontWeight='700'
            backgroundColor={isCertusProvisioning ? "green.500" : "red.500"}>
            {isCertusProvisioning ? "ENABLED " : "DISABLED"}
          </Button>
        </Flex>
      )}
      { /* Alert Management */}
      {(jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && jwtAccountInfo.isAlertManagement) || jwtAccountInfo.isAlertManagement) && ( // Conditionally render if isGuardianAdmin is true or (isAccountManagement and isAlertManagement is true)
        <Flex justifyContent='center' alignItems='center' w='100%' mb='25px'>
          <Flex direction='column' align='start' me='auto'>
            <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
              Alert Management
            </Text>
            <Text color={secondaryTextColor} fontSize='sm' fontWeight='500'>
              Notification settings.
            </Text>
          </Flex>
          <Button
            _hover={jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && !isGuardianAdmin) ? { backgroundColor: "brand.400" } : {}}
            px='24px'
            onClick={jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && !isGuardianAdmin) ? handleAlertManagementClick : null}
            fontSize='sm'
            fontWeight='700'
            backgroundColor={isAlertManagement ? "green.500" : "red.500"}>
            {isAlertManagement ? "ENABLED " : "DISABLED"}
          </Button>
        </Flex>
      )}
      { /* VPN Management */}
      {(jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && jwtAccountInfo.isVpnManagement) || jwtAccountInfo.isVpnManagement) && ( // Conditionally render if isGuardianAdmin is true or (isAccountManagement and isVpnManagement is true)
        <Flex justifyContent='center' alignItems='center' w='100%' mb='25px'>
          <Flex direction='column' align='start' me='auto'>
            <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
              VPN Management
            </Text>
            <Text color={secondaryTextColor} fontSize='sm' fontWeight='500'>
              Configure Virtual Private Network.
            </Text>
          </Flex>
          <Button
            _hover={jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && !isGuardianAdmin) ? { backgroundColor: "brand.400" } : {}}
            px='24px'
            onClick={jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && !isGuardianAdmin) ? handleVpnManagementClick : null}
            fontSize='sm'
            fontWeight='700'
            backgroundColor={isVpnManagement ? "green.500" : "red.500"}>
            {isVpnManagement ? "ENABLED " : "DISABLED"}
          </Button>
        </Flex>
      )}
      { /* Save Permission Settings Button */}
      {(jwtAccountInfo?.isGuardianAdmin || (jwtAccountInfo?.isAccountManagement && !isGuardianAdmin)) && ( // Conditionally render if isGuardianAdmin is true or (isAccountManagement and isVpnManagement is true)
        <Button
          isLoading={loading}
          width='100%'
          variant='brand'
          color='white'
          fontSize='sm'
          fontWeight='500'
          _hover={{ bg: "brand.600" }}
          _active={{ bg: "brand.500" }}
          _focus={{ bg: "brand.500" }}
          onClick={savePermissionSetting}
        >
          Save Permission Settings
        </Button>
      )}
    </Card>
  );
}
