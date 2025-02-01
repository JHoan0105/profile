/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import updateAccountInfo from 'services/account/updateAccountInfo';
import checkAccountNumber from 'services/account/checkAccountNumber';
import {EMAIL_REGEX, ACCOUNT_NUMBER_REGEX } from 'variables/constants'
import { GUARDIANACC } from '../'


// Chakra imports
import {
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  useColorModeValue,
  Button,
  useToast,
  Select,
  FormLabel,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import InputField from "components/fields/InputField";
//import InputReadOnly from "components/fields/InputReadOnly";
import React, { useState, useRef, useEffect } from "react";


// Default function
export default function Information({ userId, accountInfo, setAccountInfo, jwtAccountInfo }) {
  // Get the URL search parameters
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const optionsBackGroundColor = useColorModeValue('white', `grey`);
  const [failed, setFailed] = useState(false);
  let msg = useRef(null)
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [validAccount, setValidAccount] = useState(true);

  useEffect(() => {
    (async () => {
      if (jwtAccountInfo?.isGuardianAdmin && accountInfo?.accountNumber?.toString().length === 8) {
        const accNum = await checkAccountNumber(userId ? accountInfo?.accountNumber : jwtAccountInfo?.accountNumber);
        if (!accNum) {
          onFailed("Account Number does not exist.");
          setValidAccount(() => false)
        } else {
          setValidAccount(() => true)
          setFailed(false)
        }
      }
    })()

  }, [accountInfo?.accountNumber, userId])

  const [errorMessage, setErrorMessage] = useState(null);


  const saveAccountSetting = async () => {
    setLoading(true);
    // Ensure parameters are not empty
    if (accountInfo.firstName === '') {
      onFailed("Please enter a first name.");
      return;
    }
    if (accountInfo.lastName === '') {
      onFailed("Please enter a last name.");
      return;
    }
    if (!EMAIL_REGEX.test(accountInfo.email)) {
      onFailed("Please enter a valid email address.");
      return;
    }
    if (!ACCOUNT_NUMBER_REGEX.test(accountInfo?.accountNumber)) {
      onFailed("Please enter an account number of 8 digits.");
      return;
    }
    if (!validAccount) {
      msg.current = "Guardian Support : Invalid account number";
      onFailed();
      return;
    }

    try {
      // API request to update account setting
      const update = await updateAccountInfo(accountInfo.id, accountInfo.firstName, accountInfo.lastName, accountInfo.email, accountInfo?.accountNumber);

      if (!update) {
        msg.current.innerText = "Error : failed udpate.";
        (() => { onFailed("Failed change account setting."); })()
        return;
      }
      else {
        //On Success Toast message
        onSuccess();
      }
    } catch (error) {
      if (error.message === "Email already exists") {
        console.log("Email already exists");
        (() => { onFailed("Email address already exists."); })()
      } else {
        console.log("request error");
        (() => { onFailed("Failed change account setting."); })()
      }
    }
  }

  const OnChange = (key, value) => {
    setFailed(false);
    setAccountInfo(prevState => ({
      ...prevState,
      [key]: value
    }));
  }

  const OnChangeAccount = async (e) => {
    setFailed(false);
    // TODO : Dynamically verify Account Number

    if (ACCOUNT_NUMBER_REGEX.test(e.target.value) || e.target.value === '') {
      setAccountInfo(prev => ({
        ...prev,
        'accountNumber': e.target.value,
      }))
    } else {
      e.target.value = accountInfo?.accountNumber;

    }
  }
  const onFailed = (errorMessage) => {
    setFailed(true);

    setLoading(false);
    setErrorMessage(errorMessage); // Set errorMessage state
    (() => {
      toast({

        title: validAccount ? 'Failed change account setting.' : msg.current,
        status: validAccount ? 'error' : 'warning',
        description: errorMessage,
        duration: 9000,
        isClosable: true,
      })
    })()
  }
  const onSuccess = () => {
    setFailed(false);
    setLoading(false);
    (() => {
      toast({
        title: 'Successfully changed account setting. Warning: Users must re-login for changes to take effect.',
        status: 'warning',
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
      {errorMessage || "Update account setting failed."}
    </Text>
  };

  // Chakra Color Mode
  return (
    <FormControl >
      <Card mt='0px' mb='20px'>
        <Flex direction='column' mb='30px' ms='10px'>
          <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
            Account Settings
          </Text>
        </Flex>
        <SimpleGrid
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <Flex display='block'>
            <InputField
              me='30px'
              id='firstName'
              label='First Name'
              onChange={(e) => OnChange('firstName', e.target.value)}
              value={userId ? accountInfo?.firstName : jwtAccountInfo?.firstName}
              placeholder={'first name'}
            />
            <InputField
              id='lastName'
              label='Last Name'
              onChange={(e) => OnChange('lastName', e.target.value)}
              placeholder={'last name'}
              value={userId ? accountInfo?.lastName : jwtAccountInfo?.lastName}
            />
            {jwtAccountInfo.isGuardianAdmin && <InputField
              id='email'
              label='Email Address'
              onChange={jwtAccountInfo?.isGuardianAdmin || jwtAccountInfo?.isAccountManagement ? (e) => OnChange('email', e.target.value) : () => { }}
              value={!!accountInfo?.email ? accountInfo?.email : jwtAccountInfo?.email}
              placeholder={'email'}
            />}
          </Flex>
          {(
            <Flex display='block'>
              {jwtAccountInfo?.isGuardianAdmin &&
                <InputField
                  me='30px'
                  id='account'
                  label='Account Number'
                  color={(validAccount && !jwtAccountInfo.isGuardiaAdmin) ? null : 'red'}
                  onChange={jwtAccountInfo?.isGuardianAdmin && accountInfo?.accountNumber !== GUARDIANACC ? (e) => OnChangeAccount(e) : () => { }}
                  value={userId && accountInfo?.accountNumber !== GUARDIANACC ? accountInfo?.accountNumber : jwtAccountInfo?.accountNumber}
                  placeholder={'account number'}
                  readOnly={(accountInfo?.accountNumber === GUARDIANACC) || !(jwtAccountInfo.isGuardianAdmin && userId)}
                />}
              <Flex direction='column' mb="20px">
                <FormLabel
                  ms='10px'
                  fontSize='sm'
                  color={textColorPrimary}
                  fontWeight='bold'
                  _hover={{ cursor: "pointer" }}>
                  Account Name
                </FormLabel>
                {((jwtAccountInfo?.isGuardianAdmin && userId)
                  || (jwtAccountInfo?.isAccountManagement && userId)) && !accountInfo?.isGuardianAdmin? <Select
                  iconColor={textColorPrimary}
                  textColor={textColorPrimary}
                  fontWeight='500'
                  fontSize='15px'
                  id='accountSelector'
                  variant='main'
                  h='44px'
                  maxh='44px'
                  placeholder={jwtAccountInfo?.accountNumbers?.filter(v => v.account_number === accountInfo?.accountNumber)[0]?.account_name}
                  onChange={(e) => OnChangeAccount(e)}
                >
                  {jwtAccountInfo?.accountNumbers?.sort((a,b)=> a.account_name.charCodeAt(0)-b.account_name.charCodeAt(0))?.map((option, index) => {
                    if (option?.account_number === accountInfo?.accountNumber) return null;
                    return <option key={option?.account_number} value={option?.account_number} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>{option?.account_name}</option>
                  })
                  }
                </Select> :
                  // Account Name
                  <InputField
                    value={userId ? accountInfo?.accountName : jwtAccountInfo?.accountName}
                  />
                }
              </Flex>
              {!jwtAccountInfo.isGuardianAdmin && <InputField
                id='email'
                label='Email Address'
                onChange={jwtAccountInfo?.isGuardianAdmin || jwtAccountInfo?.isAccountManagement ? (e) => OnChange('email', e.target.value) : () => { }}
                value={!!accountInfo?.email ? accountInfo?.email : jwtAccountInfo?.email}
                placeholder={'email'}
              />}
            </Flex>

          )}

        </SimpleGrid>
        <ShowText errorMessage={errorMessage} />
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
          onClick={saveAccountSetting}
        >
          Save Account Settings
        </Button>
      </Card>
    </FormControl>
  );
}
