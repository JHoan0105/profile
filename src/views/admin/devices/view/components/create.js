/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getDeviceProfile from 'services/device/getDeviceProfile';
import getIpRangeByAccount from 'services/device/getIpRangeByAccount';
import createDevice from 'services/device/createDevice'
import {  numbersOnly, validateIMEI, dupIMEI, dupSIM, dupESN, devMarketType, missingFields } from 'tools/validators'
import { AuthContext } from 'contexts/AuthContext'




// Chakra imports
import {
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

// Custom components
import InputField from "components/fields/InputField";

// Default function
export default function CreateDevice() {
  // App 
  const { accountInfo } = useContext(AuthContext);
  accountInfo.current = getAccountInfo();

  const toast = useToast();
  const [failed, setFailed] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCreate, setIsCreate] = useState(false);

  const nav = useNavigate();
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");
  const optionsBackGroundColor = useColorModeValue('white', `grey`);

  // Define state for input values
  const [inputValues, setInputValues] = useState({
    id: '',
    salesforceName: '',
    account: '',
    submarketId: '',
    servicePlanId: '',
    ipRangeID: '',
    ip: '',
    marketType: '',
    tailNumber: '',
    identifier: '',
    imei: '',
    accountNumber: '',
    sim: '',
    esn: '',
    model: ''
  });

  // Load device profile
  const [deviceProfile, setDeviceProfile] = useState();

  useEffect(() => {
    const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;
    onLoadIpTable(currentAccountNumber);
    setLoading(false)
    setFailed(false)
  }, [])

  const onLoadIpTable = async (e) => {
    handleOnChange(e, 'accountNumber')
    setFailed(() => false)
    // update other fields ie IpRANGE
    const tmp = await getIpRangeByAccount(e);
    setDeviceProfile((prev) => ({
      ...prev,
      ipRanges: tmp
    }))
    setInputValues((p) => ({ ...p, ipRangeID: tmp[0].id }));
  }

  const onFailed = (errorMessage) => {
    setFailed(true);

    setLoading(false);
    setErrorMessage(errorMessage); // Set errorMessage state
    (() => {
      toast({

        title: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = (message) => {
    setFailed(false);
    setLoading(false);
    (() => {
      toast({
        title: message,
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    })()
  }


  // Function to handle on changes
  const handleOnChange = (value, fieldName) => {
    console.log("fieldName", fieldName);
    console.log("value", value);
    // Validate the input value for tailNumber
    if (fieldName === 'tailNumber') {
      const isValid = /^[a-zA-Z0-9-]*$/.test(value);
      if (!isValid) {
        // If the value is invalid, do not update the state
        return;
      }
    }

    setInputValues(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  const ShowText = ({ errorMessage }) => {
    return <Text
      color='Red'
      fontSize="md"
      w="100%"
      fontWeight="500"
      mb='20px'
      display={failed ? 'show' : 'none'}
    >
      {errorMessage || "Create device failed"}
    </Text>
  };

  const onChangeIMEI = async (e) => {
    const imeI = validateIMEI(e)
    if (!imeI) {
      return;
    }
    handleOnChange(e, 'imei')
    if (imeI && imeI !== -1) {
      /* DeviceProfile to validate the IMEI  */
      let valid;
      try {
        valid = await getDeviceProfile(inputValues?.accountNumber, e);
        // save copy to profile
        setDeviceProfile((ori) => ({ ...ori, ...valid }))
      } catch (error) {
        console.log('error-IMEI')
      }
      if (!valid) {
        onFailed('Guardian Support : IMEI is not valid');
        setFailed(() => true);
        return;
      } else {
        // IMEI valid -- set Model field
        setFailed(() => false);
        handleOnChange(valid?.model?.name, 'model')
        handleOnChange(valid?.submarket?.name, 'marketType')
      }
    }
  }

  useEffect(() => {
    // Create device
    if (isCreate) {
      (async () => {
        try {
          // auto assign first bundle
          const create = await createDevice(inputValues?.accountNumber,
            '', // not assigned bundle
            inputValues.dateManufactured,
            inputValues.imei,
            inputValues.marketType,
            inputValues.sim,
            inputValues.ipRangeID,
            inputValues.model,
            inputValues.esn,
            inputValues.identifier,
            inputValues.tailNumber)
          if (!create) {
            onFailed("Failed to create a new device.");
            return;
          }
          else {
            //On Success Toast message
            onSuccess('Successfully created device.');
            nav(`/admin/devices/view?account=${inputValues?.accountNumber}&id=${inputValues.imei}`);
          }
        } catch (error) {
          // handle http ERROR -- Parse IMEI/SIM/ESN duplicate error
          const tmp = error.toString();
          if (dupIMEI(tmp)) {
            onFailed('Duplicate IMEI');
          }
          else if (dupSIM(tmp)) {
            onFailed('Duplicate SIM');
          }
          else if (dupESN(tmp)) {
            onFailed('Duplicate ESN')
          } else if (devMarketType(tmp)) {
            onFailed('Invalid Market Type')
          } else if (missingFields(tmp)) {
            onFailed('Missing Fields')
          }
          else if (tmp.match(/tail number/gi)) {
            onFailed('Invalid tail number')
          }
          else {
            onFailed("Fatal Error")
            console.log("ERROR:", tmp)
          }
        } finally {
          setIsCreate(() => false)
        }
      })()
    }

  }, [isCreate])

  const handleCreateDevice = async () => {
    //reset the Red error message
    setFailed(() => false)
    console.log("handleCreateDevice");

    setLoading(true);
    // require fields
    if (inputValues?.imei?.length < 15) {
      onFailed('Invalid IMEI');
      return;
    }
    if (inputValues?.sim?.length < 19) {
      onFailed('Invalid SIM')
      return;
    }
    /* esn default to IMEI FIX BUG*/
    if (!inputValues?.esn ?? true) {
      handleOnChange(inputValues.imei, 'esn');
    }
    // If activation market type and identifier is null then identifier = Tail Number 
    if (inputValues?.marketType === 'Certus Aviation' && inputValues?.identifier === '') {
      console.log("Certus Aviation tailNumber", inputValues?.tailNumber);
      setInputValues(prevState => ({
        ...prevState,
        identifier: inputValues?.tailNumber
      }));
    } else if (inputValues?.identifier === '') {
      // If aviation and identifier is null then identifier = esn
      console.log("identifier: ", inputValues?.identifier);
      setInputValues(prevState => ({
        ...prevState,
        identifier: inputValues?.esn
      }));
    }

    // DEV - Keep device console out here -- for debugging while Provisioning & Certus API under development
    console.log("inputValues 0", inputValues)

    // Call route to create the device
    setIsCreate(() => true)
  }

  return (
    <Flex pt={{ base: "130px", md: "80px", xl: "80px" }} maxW='600px'>
        <FormControl>
          <Card >
            <Flex direction='column' mb='30px' ms='10px'>
              <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
                New Device
              </Text>
            </Flex>
            <Flex direction='column'>
              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* IMEI */}
                <Box>
                  <InputField
                    mb='20px'
                    id='imei'
                    label='IMEI*'
                    color={errorMessage === 'Invalid IMEI' || errorMessage === 'Duplicate IMEI' ? 'red' : null}
                    placeholder="Enter 15 digits IMEI"
                    onChange={(event) => onChangeIMEI(event.target.value)}
                    value={inputValues?.imei}
                    maxLength={15} // Limit input characters 
                  />
                </Box>
                {/* SIM */}
                <Box>
                  <InputField
                    mb='20px'
                    id='sim'
                    label='SIM*'
                    color={errorMessage === 'Invalid SIM' || errorMessage === 'Duplicate SIM' ? 'red' : null}
                    placeholder="Enter 19 digits SIM"
                    onChange={(event) => numbersOnly(event.target.value) ? handleOnChange(event.target.value, 'sim') : null}
                    value={inputValues?.sim}
                    maxLength={19} // Limit input characters 8988169771000122367
                  />
                </Box>
              </SimpleGrid>
              {/* ESN */}
              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <Box>
                  <InputField
                    id='serialNumber'
                    label='ESN*'
                    color={errorMessage === 'Duplicate ESN' ? 'red' : null}
                    placeholder="Serial Number"
                    onChange={(event) => handleOnChange(event.target.value, 'esn')}
                    value={inputValues?.esn}
                    maxLength={50} // Limit input characters
                  />
                </Box>
              </SimpleGrid>

              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* Model */}
                <InputField
                  id='model'
                  label='Model'
                  placeholder='AutoGenerated on IMEI'
                  value={inputValues?.model}
                  isDisabled={true}
                  _hover={{ cursor: "arrow" }}
                  readOnly
                />
                {/* Market Type */}
                <Flex direction='column' mb="20px">

                  <InputField
                    id='marketType'
                    label='Market Type'
                    placeholder='AutoGenerated on IMEI'
                    value={inputValues?.marketType}
                    isDisabled={true}
                    _hover={{ cursor: "arrow" }}
                    readOnly
                  />

                </Flex>
              </SimpleGrid>
              {/* Required Identifier fields -note review with Ryan what is the required identifier field */}
              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* Tail Number */}
                {deviceProfile?.submarket?.name === 'Certus Aviation' ?
                  <Box>
                    <InputField
                      id='tailNumber'
                      label='Tail Number*'
                      placeholder="Enter tail number of aircraft"
                      onChange={(event) => handleOnChange(event.target.value, 'tailNumber')}
                      value={inputValues?.tailNumber}
                      maxLength={10}
                    />
                  </Box>
                  : null}
                {/* Identifier */}
                <Box>
                  <InputField
                    id='identifier'
                    label='Identifier / Alias'
                    placeholder='Friendly Name'
                    onChange={(event) => handleOnChange(event.target.value, 'identifier')}
                    value={inputValues?.identifier}
                    maxLength={50}
                  />
                </Box>
              </SimpleGrid>

              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* IP Range  -- allowed ip range based on ACCOUNT NUMBER --*/}
                <Flex direction='column' mb="20px">
                  <FormLabel
                    ms='10px'
                    fontSize='sm'
                    color={textColorPrimary}
                    fontWeight='bold'
                    _hover={{ cursor: "pointer" }}>
                    IP Range
                  </FormLabel>
                  <Select
                    iconColor={textColorPrimary}
                    textColor={textColorPrimary}
                    fontWeight='500'
                    fontSize='15px'
                    id='ipRange'
                    variant='main'
                    h='44px'
                    maxh='44px'
                    me='20px'
                    defaultValue={deviceProfile?.ipRanges[0].ip}
                    onChange={(e) => setInputValues(prevState => ({ ...prevState, ipRangeID: e.target.value.id, ip: e.target.value.name }))}
                  >
                    {deviceProfile?.ipRanges ? deviceProfile.ipRanges.map((v, i) => {
                      return <option id={i} key={i} value={{ id: v.id, name: v.name }} fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>{v.name}</option>
                    })
                      : <option id='noIp' value='NoIpRange' fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>IP Range N/A</option>
                    }
                  </Select>
                </Flex>
              </SimpleGrid>
              {/* Save button */}
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
                onClick={handleCreateDevice}
              >
                Create Device
              </Button>
            </Flex>
          </Card>
        </FormControl>
    </Flex>
  );
}
