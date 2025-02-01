/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import updateBundle from 'services/serviceplan/updateBundle';
import getDataServiceListByAccountNumber from 'services/dataservicetemplate/getDataServiceListByAccountNumber'
import getVoiceServiceListByAccountNumber from 'services/voiceServiceTemplate/getVoiceServiceListByAccountNumber'
import createBundle from 'services/serviceplan/createBundle';
import { formatDate } from 'tools/stringFormat'
import { PATH_NAME } from 'variables/constants'

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
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Custom components
import InputField from "components/fields/InputField";

// Default function
export default function ViewBundle({ rowData }) {
  // App 
  const toast = useToast();

  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const optionsBackGroundColor = useColorModeValue('white', `grey`);
  const optionsTextColor = useColorModeValue('black', `white`);

  const isCreateCertusBundle = rowData === undefined ? true : false;
  const accountNumber = rowData === undefined ? localStorage?.getItem('accountNumber') : rowData?.accountNumber;
  console.log("accountNumber", accountNumber);

  // Define state for input values
  const [inputValues, setInputValues] = useState({
    dataService: isCreateCertusBundle ? '' : rowData.dataService,
    voiceService: isCreateCertusBundle ? '' : rowData.voiceService,
    vpnService: isCreateCertusBundle ? '' : rowData.vpnService,
    id: isCreateCertusBundle ? '' : rowData.id,
    account: isCreateCertusBundle ? '' : rowData.account,
    accountNumber: isCreateCertusBundle ? accountNumber : rowData?.accountNumber,
    billingDetail: isCreateCertusBundle ? '0' : rowData.billingDetail,
    bundleName: isCreateCertusBundle ? '' : rowData.bundleName,
    startDate: isCreateCertusBundle ? formatDate(new Date(Date.now())) : rowData.startDate,
    endDate: isCreateCertusBundle ? '' : rowData.endDate,
    periodicity: isCreateCertusBundle ? 1 : rowData.periodicity,
    servicePlanId: isCreateCertusBundle ? '' : rowData.servicePlanID,
    submarketId: isCreateCertusBundle ? '' : rowData.submarketID,
    salesforceName: isCreateCertusBundle ? '' : rowData.salesforceName,
  });

  //Load certus bundle
  const [dataServiceList, setdataServiceList] = useState([]);
  const [voiceServiceList, setVoiceServiceList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataServices = await getDataServiceListByAccountNumber(accountNumber);
        setdataServiceList(dataServices);
        if (isCreateCertusBundle && dataServices.length > 0) {
          setInputValues(prevState => ({ ...prevState, dataService: dataServices[0].id }));
          console.log("dataService 1: ", dataServices[0].id);
        }
        else {
          setInputValues(prevState => ({ ...prevState, dataService: rowData.dataService }));
          console.log("dataService 2: ", rowData.dataService);
        }
        console.log("dataServiceList", dataServiceList);
      } catch (error) {
        console.error("Error fetching certus bundle:", error);
        if (error?.toString() === 'Error: token expired') {
          nav('/')
        }
      }
      try {
        const voiceServices = await getVoiceServiceListByAccountNumber(accountNumber);
        setVoiceServiceList(voiceServices);
        if (isCreateCertusBundle && voiceServices.length > 0) {
          setInputValues(prevState => ({ ...prevState, voiceServices: voiceServices[0].id }));
          console.log("voiceServices 1: ", voiceServices[0].id);
        }
        else {
          setInputValues(prevState => ({ ...prevState, voiceService: rowData.voiceService }));
          console.log("voiceServices 2: ", rowData.voiceService);
        }
        console.log("voiceServiceList", voiceServiceList);
      } catch (error) {
        console.error("Error fetching certus bundle:", error);
        if (error?.toString() === 'Error: token expired') {
          nav('/')
        }
      }
    };
    fetchData();
  }, []);

  const checkIfParametersNoEmpty = async () => {
    if (inputValues.bundleName === '') {
      onFailed("Please enter a bundle name.");
      return false;
    }
    if (inputValues?.accountNumber === '') {
      onFailed("Please an account number.");
      return false;
    }
    if (inputValues.periodicity === '') {
      onFailed("Please enter a billing period.");
      return false;
    }
    return true;
  }

  const handleCreateCertusBundle = async () => {
    setFailed(false);
    console.log("dataService=", inputValues.dataService);

    // Ensure parameters are not empty
    const parametersNotEmpty = await checkIfParametersNoEmpty();
    if (!parametersNotEmpty) {
      return;
    }
    // Create bundle
    try {
      // API request to update account setting
      const create = await createBundle(
        inputValues.bundleName,
        inputValues?.accountNumber,
        parseInt(inputValues.billingDetail),
        inputValues.dataService,
        inputValues.voiceService,
        inputValues.startDate,
        inputValues.endDate,
        parseInt(inputValues.periodicity)
      );

      if (!create) {
        onFailed("Failed to create a new Service Plan.");
        return;
      }
      else {
        //On Success Toast message
        onSuccess();
        nav(PATH_NAME.SERVICE_PLAN);
      }
    } catch (error) {
      if (error.message === "Service Plan already exists.") {
        onFailed("Service Plan already exists."); 
      } else {
        console.log("request error");
        onFailed("Failed to create a new Service Plan.");
      }
    }
  }

  const handleUpdateCertusBundle = async () => {
    console.log("dataService", inputValues.dataService);
    // Ensure parameters are not empty
    const parametersNotEmpty = await checkIfParametersNoEmpty();
    if (!parametersNotEmpty) {
      return;
    }

    try {
      // API request to update account setting
      const update = await updateBundle(
        inputValues.id,
        inputValues?.accountNumber,
        inputValues.account,
        parseInt(inputValues.billingDetail),
        inputValues.bundleName,
        inputValues.startDate,
        inputValues.endDate,
      );

      if (!update) {
        onFailed("Failed to update this bundle.");
        return;
      }
      else {
        //On Success Toast message
        onSuccess();
        nav(PATH_NAME.SERVICE_PLAN);
      }
    } catch (error) {
      console.log("error.message (Bundle View): ", error.message);
      if (error.message === "cannot directly modify bundle with one or more active devices") {
        console.log("Cannot directly modify bundle with one or more active devices.");
        onFailed("Cannot directly modify bundle with one or more active devices.");
      } else {
        console.log("request error");
        onFailed("Failed to update service plan.");
      }
    }
  }

  const onFailed = (errorMessage) => {
    setFailed(true);

    setLoading(false);
    setErrorMessage(errorMessage); // Set errorMessage state
    (() => {
      toast({

        title: errorMessage || "Failed to update service plan.",
        status: 'error',
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
        title: isCreateCertusBundle? 'Successfully created service plan':'Successfully updated service plan.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

  const handleIntegerInputChangeWithoutZero = (event, inputName, maxLeftDigits) => {
    const { value } = event.target;
    // Validate input to allow only decimal with max specified digits to the left and specified decimal points
    const isValidInput = new RegExp(`^[1-9]\\d{0,${maxLeftDigits - 1}}(\\.\\d*)?$`).test(value); // Check if the input is valid
    const newValue = isValidInput ? value : inputValues[inputName]; // Use previous value if input is not valid
    // Update state based on input name
    setInputValues(prevState => ({
      ...prevState,
      [inputName]: newValue,
    }));
  };

  const handleOnChange = (value, fieldName) => {
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
      {errorMessage || "Service Plan update failed."}
    </Text>
  };

  return (
    <FormControl>
      <Card mb='20px'>
        <Flex direction='column' mb='30px' ms='10px'>
          <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
            {isCreateCertusBundle ? "New Service Plan" : "Service Plan Detail : "}
            {inputValues?.salesforceName}
          </Text>
        </Flex>
        <Flex direction='column'>
          {/* Service Plan Name */}
          <Box>
            <InputField
              id='bundleName'
              label='Plan Name*'
              onChange={(event) => handleOnChange(event.target.value, 'bundleName')}
              placeholder={'Certus-00'}
              value={!!inputValues?.bundleName ? inputValues?.bundleName:''}
              maxLength={255} // Limit input characters
            />
          </Box>

          {/* Billing detail and billing period */}
          <SimpleGrid
            mb='0px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            {/* Billing Detail */}
            <Flex direction='column' mb="20px">
              <FormLabel
                ms='10px'
                htmlFor='currency'
                fontSize='sm'
                color={textColorPrimary}
                fontWeight='bold'
                _hover={{ cursor: "pointer" }}>
                Billing Detail
              </FormLabel>
              <Select
                textColor={textColorPrimary}
                fontWeight='500'
                fontSize='15px'
                id='billingDetail'
                variant='main'
                h='44px'
                maxh='44px'
                me='20px'
                value={inputValues.billingDetail} // Set value here
                onChange={((e) => setInputValues(prevState => ({ ...prevState, billingDetail: e.target.value })))} // Handle onChange event             
              >
                <option value='0' fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>Bundle</option>
                <option value='2' fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>Device</option>
                <option value='1' fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>Service</option>
                <option value='3' fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>None</option>
              </Select>
            </Flex>
            <InputField
              id='periodicity'
              label={isCreateCertusBundle ? 'Billing Period (Month)*' : 'Billing Period (Month)'}
              onChange={ //Only allow onChange if creating a bundle
                isCreateCertusBundle
                  ? (event) => handleIntegerInputChangeWithoutZero(event, 'periodicity', 3, 0)
                  : () => { } // or pass null, or an empty function if you prefer
              }
              placeholder={ '1'}
              value={!!inputValues?.periodicity ? inputValues.periodicity:''}
            />
          </SimpleGrid>
          {/* Start and End Date */}
          <SimpleGrid
            mb='0px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              id='startDate'
              label='Start Date'
              onChange={(event) => handleOnChange(event.target.value, 'startDate')}
              placeholder={ 'yyyy-mm-dd'}
              value={inputValues.startDate}
            />
            <InputField
              id='endDate'
              label='End Date'
              onChange={(event) => handleOnChange(event.target.value, 'endDate')}
              placeholder={'yyyy-mm-dd'}
              value={!!inputValues?.endDate ? inputValues?.endDate :''}
            />
          </SimpleGrid>
          {/* (Create Bundle) VOICE Service */}
          {isCreateCertusBundle && (
            <Flex direction='column' mb="20px">
              <FormLabel
                ms='10px'
                htmlFor='currency'
                fontSize='sm'
                color={textColorPrimary}
                fontWeight='bold'
                _hover={{ cursor: "pointer" }}>
                Voice Service Template
              </FormLabel>
              <Select
                textColor={textColorPrimary}
                fontWeight='500'
                fontSize='15px'
                id='dataService'
                variant='main'
                h='44px'
                maxh='44px'
                me='20px'
                value={inputValues?.voiceService || ''}
                placeholder={voiceServiceList?.filter(v => v.id === inputValues?.voiceService)[0]?.templateName}
                onChange={(e) => {
                  console.log("VOICE SERVICE", e.target.value)
                  setInputValues(prevState => ({ ...prevState, voiceService: e.target.value }));
                }}
              >
                <option key={0} value={0} style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>NONE</option>
                {voiceServiceList && voiceServiceList.map((option, index) => {
                  if (option.id === inputValues?.voiceService) return null;

                  return <option key={option.id} value={option.id} style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>{option.templateName}</option>
                })}
              </Select>
            </Flex>
          )}
          {/* (Create Bundle) Data Service */}
          {isCreateCertusBundle && (
            <Flex direction='column' mb="20px">
              <FormLabel
                ms='10px'
                htmlFor='currency'
                fontSize='sm'
                color={textColorPrimary}
                fontWeight='bold'
                _hover={{ cursor: "pointer" }}>
                Data Service Template
              </FormLabel>
              <Select
                textColor={textColorPrimary}
                fontWeight='500'
                fontSize='15px'
                id='dataService'
                variant='main'
                h='44px'
                maxh='44px'
                me='20px'
                value={inputValues?.dataService || ''}
                placeholder={ dataServiceList?.filter(v=> v.id === inputValues?.dataService)[0]?.templateName}
                onChange={(e) => {
                  setInputValues(prevState => ({ ...prevState, dataService: e.target.value }));
                }}
              >
                {dataServiceList && dataServiceList.map((option, index) => {
                  if (option.id === inputValues?.dataService) return null;

                  return <option key={option.id} value={option.id} style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>{option.templateName}</option>
                })}
              </Select>
            </Flex>
          )}
          {/* (View Bundle) Voice Service */}
          {!isCreateCertusBundle && inputValues.voiceService && (
            <InputField
              id='voiceService'
              label='Voice Service'
              placeholder={''}
              value={!!inputValues?.voiceService ? inputValues.voiceService : ''}
              readOnly
            />
          )}
          {/* (View Bundle) Data Service */}
          {!isCreateCertusBundle && inputValues.dataService && (
            <InputField
              id='dataService'
              label='Data Service'
              placeholder={ ''}
              value={!!inputValues?.dataService ? inputValues.dataService : ''}
              readOnly
            />
          )}
          {/* (View Bundle) VPN Service */}
          {!isCreateCertusBundle && inputValues.vpnService && (
            <InputField
              id='vpnService'
              label='VPN Service'
              placeholder={''}
              value={!!inputValues?.vpnService ? inputValues.vpnService : ''}
              readOnly
            />
          )}
          {/* Service plan id and submarket id */}
          {!isCreateCertusBundle && (
            <SimpleGrid
              mb='20px'
              columns={{ sm: 1, md: 2 }}
              spacing={{ base: "20px", xl: "20px" }}>
              {inputValues.servicePlanId && (
                <InputField
                  mb='0px'
                  me='30px'
                  id='servicePlanId'
                  label='Service Plan ID'
                  value={inputValues.servicePlanId}
                  readOnly
                />
              )}
              {inputValues.submarketId && (
                <InputField
                  mb='0px'
                  id='submarketId'
                  label='Submarket ID'
                  value={inputValues.submarketId}
                  readOnly
                />
              )}
            </SimpleGrid>
          )}
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
            onClick={isCreateCertusBundle ? handleCreateCertusBundle : handleUpdateCertusBundle}
          >
            {isCreateCertusBundle ? "Create Service Plan" : "Update Service Plan"}
          </Button>
        </Flex>
      </Card>
    </FormControl>
  );
}