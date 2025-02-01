/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';

import createAccountNumber from 'services/manageAccounts/createAccountNumber'
import getAllAccountNumbers from 'services/manageAccounts/getAllAccountNumbers'



import checkAccountNumber from 'services/account/checkAccountNumber'
import { emailValidator } from 'tools/validators'

// Chakra imports
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'

// TODO -- in tools/validators
const accountNum = /^\d{8}$/;

export default function CreateAccount() {
  const textColor = useColorModeValue('black', 'white');
  const textColorInActive = useColorModeValue("gray", "gray.600");
  const textColorSecondary = "secondaryGray.600";

  const nav = useNavigate();
  const [validAccount, setValidAccount] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);


  const accountInfo = getAccountInfo();

  // account Info
  const [newAccount, setNewAccount] = useState({accountNumber:'', accountName:''});

  const msg = useRef(null)
  const toast = useToast();

  const [activeBullets, setActiveBullets] = useState({
    account: true
  });

  const updateNewAccount = (k, v) => {

    setNewAccount(e => ({
      ...e,
      [k]: v
    }))

  }
  const accountTab = React.useRef();

  const onFailed = () => {
    (() => {
      toast({
        title: 'Failed.',
        description: msg.current,
        status: validAccount ? 'warning' : 'error',
        duration: 5000,
        isClosable: true,
      })
    })()
    msg.current = ''
  }
  const onSuccess = () => {
    (() => {
      toast({
        title: 'Successful.',
        status: msg.current ? "success" : "warning",
        description: msg.current ? msg.current : "Failed.",
        duration: 7000,
        isClosable: true,
      })
    })()
    msg.current = ''
  }
  const onWarning = (warning='') => {
    (() => {
      toast({
        title: 'ATTENTION',
        status:  "warning",
        description: warning || "Warning!",
        duration: 7000,
        isClosable: true,
      })
    })()
    msg.current = ''
  }
  const onChangeAccount = async (e) => {
    if (Number(e.target.value).toString() === 'NaN')
      return
    setValidAccount(() => false)
    updateNewAccount('accountNumber', e.target.value)
    const tmpvalue =e.target.value
    // Account number validation
    if (!accountNum.test(tmpvalue) || tmpvalue === '') {
      return
    } 
    if (tmpvalue?.toString().length === 8) {
      const accNum = await checkAccountNumber(tmpvalue);
      if (!accNum?.status) {
        msg.current = 'Guardian Support : Account Number does not exist';
        onFailed();
        msg.current = '';
        updateNewAccount('accountName', '')
        setValidAccount(() => false)

      } else if (tmpvalue.accountNumber?.toString().length > 8) {
        setValidAccount(() => false)
      } else {
        if (!!accountInfo?.accountNumbers?.filter(v => v.account_number === e.target.value)[0]) {
          setValidAccount(() => false)
          onWarning(`Account "${accNum.name}" already exist on GAPP. Please search for a new account to add.`)
        } else {
          setValidAccount(() => true)
        }
        updateNewAccount('accountNumber', tmpvalue)
        updateNewAccount('accountName', accNum.name)
      }
      setLoading(()=> false)
    }
  }

  const onSubmit = async () => {
    setLoading(()=> true)

    //Get all accounts for the account number
    console.log('CREATE NEW ACCOUNT', newAccount.accountNumber, newAccount.accountName)

    if (!validAccount) {
      setLoading(() => false)
      onWarning('Invalid account.')
      return
    }

    const all = await getAllAccountNumbers()
                        
    if (!!all) {
      // Additional FrontEnd Check before creating Account
      if (all.some(v => v.account_number === newAccount.accountNumber)) {
        onFailed('Cannot create an account that is already on the system.');
        setLoading(() => false)
        return;
      }

      const create = await createAccountNumber(newAccount.accountNumber, newAccount.accountName)
      console.log("ACCOUNT GET", all)
      if (create) {
        console.log("CREATED", create)
        msg.current = "Account successfully created"
        onSuccess();
        nav('/admin/manageaccount/list')
      } else {
        msg.current = "Account registration failed"
        onFailed();
      }
    }
    setLoading(() => false)
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      align="center"
      pt={{ sm: '125px', lg: '75px' }}
      position="relative"
    >
      <Box
        h="45vh"
        position="absolute"
        w="100%"
        borderRadius="20px"
      />

      <Tabs
        variant="unstyled"
        zIndex="0"
        mt={{ base: '60px', md: '165px' }}
        display="flex"
        flexDirection="column"
      >
        <TabList
          display="flex"
          alignItems="center"
          alignSelf="center"
          justifySelf="center"
        >
          <Tab
            _focus={{ border: '0px', boxShadow: 'unset' }}
            ref={accountTab}
            w={{ sm: '120px', md: '250px', lg: '300px' }}
            onClick={() =>
              setActiveBullets({
                account: true,
              })
            }
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
              _before={{
                content: "''",
                width: { sm: '120px', md: '250px', lg: '300px' },
                height: '3px',
              }}
            >
              <Box
                zIndex="1"
                border="2px solid"
                borderColor={activeBullets.account ? textColor : textColorInActive}
                bgGradient="linear(to-b, brand.400, brand.600)"
                w="16px"
                h="16px"
                mb="8px"
                borderRadius="50%"
              />
              <Text
                color={activeBullets.account ? textColor : textColorInActive}
                fontWeight={activeBullets.account ? 'bold' : 'normal'}
                display={{ sm: 'none', md: 'block' }}
              >
                Create Account
              </Text>
            </Flex>
          </Tab>
        </TabList>
        <TabPanels mt="24px" maxW={{ md: '90%', lg: '100%' }} mx="auto">
          <TabPanel
            w={{ sm: '330px', md: '700px', lg: '850px' }}
            p="0px"
            mx="auto"
          >
            <Card p="30px">
              <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
                Account Info
              </Text>
              <Flex direction="column" w="100%">
                <Stack direction="column" spacing="20px">
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
                    {accountInfo.isGuardianAdmin && (
                      <InputField
                        onChange={(e) => onChangeAccount(e) }
                        color={!validAccount ? 'red' : null}
                        placeholder={'00000000'}
                        value={ newAccount?.accountNumber}
                        label="Account Number"
                        mb='15px'
                      />
                    )}
                    <InputField
                      onChange={(e) => updateNewAccount('accountName', e.target.value)}
                      mb="0px"
                      placeholder="Business Name"
                      label="Account Name"
                      value={newAccount?.accountName}
                      readOnly
                    />
                  </SimpleGrid>
                </Stack>
                <Flex justify="space-between" mt="24px">
                  <Button
                    isLoading={loading }
                    variant="brand"
                    _hover={{ bg: "brand.600" }}
                    _active={{ bg: "brand.500" }}
                    _focus={{ bg: "brand.500" }}
                    fontSize="sm"
                    borderRadius="16px"
                    w={{ base: '128px', md: '148px' }}
                    h="46px"
                    onClick={onSubmit}
                  >
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}