/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getAccountList from 'services/account/getAccountList';
import createAccount from 'services/account/createAccount'
import checkAccountNumber from 'services/account/checkAccountNumber'
import { emailValidator } from 'tools/validators'
import { PATH_NAME, ACCOUNT_8NUM_REGEX } from 'variables/constants'

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
  FormLabel,
  Select,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'

export default function CreateNewUser() {
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColor = useColorModeValue('black', 'white');
  const textColorInActive = useColorModeValue("gray", "gray.600");
  const optionsBackGroundColor = useColorModeValue('white', `grey`);
  const [validAccount, setValidAccount] = useState(true);

  const accountInfo = getAccountInfo();
  const nav = useNavigate();
  // Permissions
  const [access, setAccess] = useState({
    GuardianAdmin: false,
    AccountManagement: false,
    AlertManagement: true,
    VPNManagement: true,
    CertusProvisioning: true,
    AccessStatus: true,
    OtpSetting: false
  })

  // User Info
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    account: accountInfo?.accountNumber,
    accountName: accountInfo?.accountName,
    validAccount: true
  });


  const msg = useRef(null)
  const toast = useToast();

  const [activeBullets, setActiveBullets] = useState({
    user: true,
    permissions: false,
    profile: false,
  });


  const userTab = React.useRef();
  const permissionTab = React.useRef();
  const securityTab = React.useRef();

  const handleAccess = (k, v) => {

    setAccess(e => ({
      ...e,
      [k]: v
    }))

  }
  const updateUser = (k, v) => {

    setNewUser(e => ({
      ...e,
      [k]: v
    }))

  }

  const onFailed = () => {

    (() => {
      toast({
        title: 'Update failed.',
        description: msg.current,
        status: validAccount ? 'warning' : 'error',
        duration: 5000,
        isClosable: true,
      })
    })()
  }
  const onSuccess = () => {


    (() => {
      toast({
        title: 'Update',
        status: msg.current ? "success" : "warning",
        description: msg.current ? msg.current : "New user email setup failed",
        duration: 7000,
        isClosable: true,
      })
    })()
  }
  const onWarning = (warning = '') => {
    (() => {
      toast({
        title: 'ATTENTION',
        status: "warning",
        description: warning || "Please review your steps to update.",
        duration: 7000,
        isClosable: true,
      })
    })()
  }

  const onChangeAccount = async (e) => {
    console.log("newUser.account", e.target.value);
    if (Number(e.target.value).toString() === 'NaN')
      return;
    updateUser('account', e.target.value)
    // Account number validation
    if (ACCOUNT_8NUM_REGEX.test(e.target.value) || e.target.value === '') {
      return;
    }
    if (e.target.value.toString().length === 8) {
      const accNum = await checkAccountNumber(e.target.value);
      if (!accNum?.status) {
        msg.current = 'Guardian Support : Account Number does not exist';
        onFailed();
        msg.current = '';
        updateUser('account', accountInfo?.accountNumber)
        updateUser('accountName', accountInfo?.accountName)
        setValidAccount(() => false)
      } else {
        if (!!accountInfo?.accountNumbers?.filter(v => v.account_number === e.target.value)[0]) {
          setValidAccount(() => true)
          updateUser('validAccount', true)
        } else {
          setValidAccount(() => false)
          updateUser('validAccount', false)
          onWarning(`Account "${accNum.name}" has not been registered on GAPP. Please create the Organization Account to register users under the account.`)
        }
        updateUser('accountName', accNum?.name)
      }
    }
  }
  const onChangeName = async (e) => {
    updateUser('accountName', e.target.value)
    updateUser('account', accountInfo?.accountNumbers?.filter(v => v.account_name === e.target.value)[0]?.account_number)
    setValidAccount(() => true)
  }


  const onSubmit = async () => {
    if (!validAccount && accountInfo.isGuardianAdmin) {
      msg.current = "Guardian Support : Invalid account number"
      onFailed();
      return;
    }
    if (!newUser.firstname || !newUser.lastname || !newUser.account || !newUser.email) {
      msg.current = "Please complete the User Info form";
      onFailed();
      return;
    }
    if (!emailValidator(newUser.email)) {
      msg.current = "Please provide a valid Email Address";
      onFailed();
      return;
    }
    if (!validAccount && !newUser.validAccount) {
      if (accountInfo?.isGuardianAdmin)
        msg.current = "Please create organization account on GAPP before creating a user.";
      else
        msg.current = "Please contact Guardian Support."
      onFailed();
    }

    // TODO: encoded url string

    //Get all accounts for the account number
    const accountList = await getAccountList(newUser.account);
    const numberOfAccounts = accountList.length;
    console.log("newUser.account: ", newUser.account);
    // On creating USER ACCOUNT in the backend -- new user setup email sent here
    const createResult = await createAccount(newUser.email.toLowerCase(),
      newUser.firstname,
      newUser.lastname,
      newUser.account,
      access.OtpSetting,
      access.GuardianAdmin,
      access.AccountManagement,
      access.AlertManagement,
      access.VPNManagement,
      access.CertusProvisioning,
      access.AccessStatus);

    // Account created but need registration                                                
    if (await createResult) {
      msg.current = "Account successfully created - Pending user registration"
      onSuccess();

      if (numberOfAccounts === 0) { // Force a page reload if adding a user with new account
        localStorage.setItem('accountNumber', newUser.account);
        nav(PATH_NAME.USER_LIST)
        window.location.reload();
      } else {
        nav(PATH_NAME.USER_LIST)
      }
    } else {
      msg.current = "Account registration failed"
      onFailed();
    }
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
            ref={userTab}
            w={{ sm: '120px', md: '250px', lg: '300px' }}
            onClick={() =>
              setActiveBullets({
                user: true,
                permissions: false,
                profile: false,
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
                bg: activeBullets.permissions ? 'brand.400' : textColorInActive,
                left: { sm: '12px', md: '30px' },
                top: {
                  sm: activeBullets.user ? '6px' : '4px',
                  md: null,
                },
                position: 'absolute',
                bottom: activeBullets.user ? '40px' : '38px',

                transition: 'all .3s ease',
              }}
            >
              <Box
                zIndex="1"
                border="2px solid"
                borderColor={activeBullets.user ? textColor : textColorInActive}
                bgGradient="linear(to-b, brand.400, brand.600)"
                w="16px"
                h="16px"
                mb="8px"
                borderRadius="50%"
              />
              <Text
                color={activeBullets.user ? textColor : textColorInActive}
                fontWeight={activeBullets.user ? 'bold' : 'normal'}
                display={{ sm: 'none', md: 'block' }}
              >
                User Info
              </Text>
            </Flex>
          </Tab>
          <Tab
            _focus={{ border: '0px', boxShadow: 'unset' }}
            ref={permissionTab}
            w={{ sm: '120px', md: '250px', lg: '300px' }}
            onClick={() =>
              setActiveBullets({
                user: true,
                permissions: true,
                profile: false,
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
                width: { sm: '120px', md: '250px', lg: '310px' },
                height: '3px',
                bg: activeBullets.profile ? 'brand.400' : textColorInActive,
                left: { sm: '12px', md: '32px' },
                top: '6px',
                position: 'absolute',
                bottom: activeBullets.permissions ? '40px' : '38px',
                transition: 'all .3s ease',
              }}
            >
              <Box
                zIndex="1"
                border="2px solid"
                borderColor={activeBullets.permissions ? textColor : textColorInActive}
                bgGradient="linear(to-b, brand.400, brand.600)"
                w="16px"
                h="16px"
                mb="8px"
                borderRadius="50%"
              />
              <Text
                color={activeBullets.permissions ? textColor : textColorInActive}
                fontWeight={activeBullets.permissions ? 'bold' : 'normal'}
                display={{ sm: 'none', md: 'block' }}
              >
                Permissions
              </Text>
            </Flex>
          </Tab>
          <Tab
            _focus={{ border: '0px', boxShadow: 'unset' }}
            ref={securityTab}
            w={{ sm: '120px', md: '250px', lg: '300px' }}
            onClick={() =>
              setActiveBullets({
                user: true,
                permissions: true,
                profile: true,
              })
            }
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
            >
              <Box
                zIndex="1"
                border="2px solid"
                borderColor={activeBullets.profile ? textColor : textColorInActive}
                bgGradient="linear(to-b, brand.400, brand.600)"
                w="16px"
                h="16px"
                mb="8px"
                borderRadius="50%"
              />
              <Text
                color={activeBullets.profile ? textColor : textColorInActive}
                fontWeight={activeBullets.profile ? 'bold' : 'normal'}
                display={{ sm: 'none', md: 'block' }}
              >
                Security
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
                User Info
              </Text>
              <Flex direction="column" w="100%">
                <Stack direction="column" spacing="20px">
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
                    <Flex display='block'>
                      <InputField
                        onChange={(e) => updateUser('firstname', e.target.value)}
                        mb="15px"
                        placeholder="eg. Esthera"
                        label="First Name"
                        value={newUser.firstname}
                      />
                      <InputField
                        onChange={(e) => updateUser('lastname', e.target.value)}
                        mb="0px"
                        placeholder="eg. Peterson"
                        label="Last Name"
                        value={newUser.lastname}
                      />
                    </Flex>
                    <Flex display='block'>
                      {accountInfo.isGuardianAdmin && (
                        <InputField
                          onChange={(e) => onChangeAccount(e)}
                          mb="15px"
                          color={!validAccount && accountInfo.isGuardianAdmin ? 'red' : null}
                          value={newUser.account}
                          label="Account Number"
                        />
                      )}
                      {(accountInfo?.isGuardianAdmin || accountInfo?.isAccountManagement) && (
                        <Flex display='block'>
                          <Flex direction='column' mb="20px">
                            <FormLabel
                              ms='10px'
                              htmlFor='currency'
                              fontSize='sm'
                              color={textColorPrimary}
                              fontWeight='bold'
                              _hover={{ cursor: "pointer" }}>
                              Account Name
                            </FormLabel>
                            {<Select
                              iconColor={textColorPrimary}
                              textColor={textColorPrimary}
                              fontWeight='500'
                              fontSize='15px'
                              id='accountSelector'
                              variant='main'
                              h='44px'
                              maxh='44px'
                              placeholder={newUser.accountName}
                              onChange={(e) => onChangeName(e)}
                            >
                              {accountInfo?.accountNumbers.sort((a, b) => a.account_name.charCodeAt(0) - b.account_name.charCodeAt(0))?.map((option, index) => {
                                if (option.account_number === newUser?.account) return null;
                                return <option key={option.account_number} value={option.account_name} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>{option.account_name}</option>
                              })
                              }

                            </Select>
                            }
                          </Flex>
                        </Flex>
                      )}
                    </Flex>
                    <InputField
                      onChange={(e) => updateUser('email', e.target.value)}
                      mb="0px"
                      placeholder="eg. user@SatComService.com"
                      label="Email Address"
                      value={newUser.email}
                    />
                  </SimpleGrid>
                </Stack>
                <Flex justify="space-between" mt="24px">
                  <Button
                    variant="brand"
                    _hover={{ bg: "brand.600" }}
                    _active={{ bg: "brand.500" }}
                    _focus={{ bg: "brand.500" }}
                    fontSize="sm"
                    borderRadius="16px"
                    w={{ base: '128px', md: '148px' }}
                    h="46px"
                    ms="auto"
                    onClick={() => permissionTab.current.click()}
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </TabPanel>
          <TabPanel
            w={{ sm: '330px', md: '700px', lg: '850px' }}
            p="0px"
            mx="auto"
          >
            <Card p="30px">
              <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
                Permissions
              </Text>
              <Flex direction="column" w="100%">
                <Stack direction="column" spacing="20px" mb="43px" >
                  {accountInfo.isGuardianAdmin ?
                    <Flex justifyContent='center' alignItems='center' w='100%' >
                      <Flex direction='column' align='start' me='auto'>
                        <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
                          Guardian Administrator
                        </Text>
                        <Text color="grey" fontSize='sm' fontWeight='500'>
                          SuperAdmin / Support.
                        </Text>
                      </Flex>

                      <Button
                        _hover={{ backgroundColor: "brand.400" }}
                        variant='brand'
                        px='24px'
                        onClick={(e) => { handleAccess('GuardianAdmin', !access.GuardianAdmin); e.target.blur() }}
                        fontSize='sm'
                        fontWeight='700'
                        backgroundColor={access.GuardianAdmin ? "green.500" : "red.500"}
                      >
                        {access.GuardianAdmin ? "ENABLED " : "DISABLED"}
                      </Button>
                    </Flex>
                    : null}
                  <Flex justifyContent='center' alignItems='center' w='100%' >
                    <Flex direction='column' align='start' me='auto'>
                      <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
                        Account Management
                      </Text>
                      <Text color="grey" fontSize='sm' fontWeight='500'>
                        Account settings.
                      </Text>
                    </Flex>
                    <Button
                      variant='brand'
                      px='24px'
                      onClick={e => { handleAccess('AccountManagement', !access.AccountManagement); e.target.blur() }}
                      fontSize='sm'
                      fontWeight='700'
                      backgroundColor={access.AccountManagement ? "green.500" : "red.500"}>
                      {access.AccountManagement ? "ENABLED " : "DISABLED"}
                    </Button>
                  </Flex>
                  <Flex justifyContent='center' alignItems='center' w='100%' >
                    <Flex direction='column' align='start' me='auto'>
                      <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
                        Certus Provisioning
                      </Text>
                      <Text color="grey" fontSize='sm' fontWeight='500'>
                        Create new units.
                      </Text>
                    </Flex>

                    <Button
                      variant='brand'
                      px='24px'
                      onClick={e => { handleAccess('CertusProvisioning', !access.CertusProvisioning); e.target.blur() }}
                      fontSize='sm'
                      fontWeight='700'
                      backgroundColor={access.CertusProvisioning ? "green.500" : "red.500"}>
                      {access.CertusProvisioning ? "ENABLED " : "DISABLED"}
                    </Button>
                  </Flex>
                  <Flex justifyContent='center' alignItems='center' w='100%'>
                    <Flex direction='column' align='start' me='auto'>
                      <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
                        Alert Management
                      </Text>
                      <Text color="grey" fontSize='sm' fontWeight='500'>
                        Notification settings.
                      </Text>
                    </Flex>
                    <Button
                      variant='brand'
                      px='24px'
                      onClick={e => { handleAccess('AlertManagement', !access.AlertManagement); e.target.blur() }}
                      fontSize='sm'
                      fontWeight='700'
                      backgroundColor={access.AlertManagement ? "green.500" : "red.500"}>
                      {access.AlertManagement ? "ENABLED " : "DISABLED"}
                    </Button>
                  </Flex>
                  <Flex justifyContent='center' alignItems='center' w='100%'>
                    <Flex direction='column' align='start' me='auto'>
                      <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
                        VPN Management
                      </Text>
                      <Text color="grey" fontSize='sm' fontWeight='500'>
                        Configure Virtual Private Network.
                      </Text>
                    </Flex>
                    <Button
                      variant='brand'
                      px='24px'
                      onClick={e => { handleAccess("VPNManagement", !access.VPNManagement); e.target.blur() }}
                      fontSize='sm'
                      fontWeight='700'
                      backgroundColor={access.VPNManagement ? "green.500" : "red.500"}>
                      {access.VPNManagement ? "ENABLED " : "DISABLED"}
                    </Button>
                  </Flex>

                </Stack>
                <Flex justify="space-between">
                  <Button
                    variant="brand"
                    _hover={{ bg: "brand.600" }}
                    _active={{ bg: "brand.500" }}
                    _focus={{ bg: "brand.500" }}
                    fontSize="sm"
                    borderRadius="16px"
                    w={{ base: '128px', md: '148px' }}
                    h="46px"
                    onClick={() => userTab.current.click()}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="brand"
                    _hover={{ bg: "brand.600" }}
                    _active={{ bg: "brand.500" }}
                    _focus={{ bg: "brand.500" }}
                    fontSize="sm"
                    borderRadius="16px"
                    w={{ base: '128px', md: '148px' }}
                    h="46px"
                    ms="auto"
                    onClick={() => securityTab.current.click()}
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </TabPanel>
          <TabPanel
            w={{ sm: '330px', md: '700px', lg: '850px' }}
            p="0px"
            mx="auto"
          >
            <Card p="30px">
              <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
                Security
              </Text>
              <Flex direction="column" w="100%">

                <Flex justifyContent='center' alignItems='center' w='100%' mb='20px'>
                  <Flex direction='column' align='start' me='auto'>
                    <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
                      Two-Factor Authentication
                    </Text>
                    <Text color="grey" fontSize='sm' fontWeight='500'>
                      Get a code to your email address.
                    </Text>
                  </Flex>

                  <Button
                    _hover={{ backgroundColor: "brand.400" }}
                    variant='brand'
                    px='24px'
                    onClick={(e) => { handleAccess('OtpSetting', !access.OtpSetting); e.target.blur() }}
                    fontSize='sm'
                    fontWeight='700'
                    backgroundColor={access.OtpSetting ? "green.500" : "red.500"}
                  >
                    {access.OtpSetting ? "ENABLED " : "DISABLED"}
                  </Button>
                </Flex>

                {accountInfo?.isGuardianAdmin &&
                  <Flex justifyContent='center' alignItems='center' w='100%' mb='20px'>
                    <Flex direction='column' align='start' me='auto'>
                      <Text color={textColor} fontSize='md' me='6px' fontWeight='700'>
                        User Account Access
                      </Text>
                      <Text color="grey" fontSize='sm' fontWeight='500'>
                        Here you can block user account access.
                      </Text>
                    </Flex>

                    <Button
                      _hover={{ backgroundColor: "brand.400" }}
                      variant='brand'
                      px='24px'
                      onClick={(e) => { handleAccess('AccessStatus', !access.AccessStatus); e.target.blur() }}
                      fontSize='sm'
                      fontWeight='700'
                      backgroundColor={access.AccessStatus ? "green.500" : "red.500"}
                    >
                      {access.AccessStatus ? "ENABLED " : "DISABLED"}
                    </Button>
                  </Flex>
                }
                <Flex justify="space-between" mt="24px">
                  <Button
                    variant="brand"
                    _hover={{ bg: "brand.600" }}
                    _active={{ bg: "brand.500" }}
                    _focus={{ bg: "brand.500" }}
                    fontSize="sm"
                    borderRadius="16px"
                    w={{ base: '128px', md: '148px' }}
                    h="46px"
                    onClick={() => permissionTab.current.click()}
                  >
                    Prev
                  </Button>
                  <Button
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