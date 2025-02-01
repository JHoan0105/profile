/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getDataServiceListById from 'services/dataservicetemplate/getDataServiceListById';
import createDataService from 'services/dataservicetemplate/createDataService';
import updateDataService from 'services/dataservicetemplate/updateDataService';
import getCertusServices from 'services/dataservicetemplate/getCertusServices'
import CertusServices from '../../list/variables/CertusServices.json'

import {PATH_NAME, UNIT } from 'variables/constants'

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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Custom components
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";

// Default function
export default function DataService({ dataServiceId }) {
  // App 
  const isCreateDataService = dataServiceId === null ? true : false;
  const toast = useToast();
  let msg = useRef(null)
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certusServices, setCertusServices] = useState();
  const [isLand, setIsLand] = useState(true)
  const nav = useNavigate()

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");
  const optionsBackGroundColor = useColorModeValue('white', 'grey');
  const optionsTextColor = useColorModeValue('black', 'white');

  // Define state for input values
  const [inputValues, setInputValues] = useState({
    planName: '',
    marketType: '',
    minTerm: '',
    dataIncluded: '',
    dataIncrement: '',
    activationFee: '',
    isInternetAccess: false,
    internetAccessFee: '',
    baseFee: '',
    earlyTerminationFee: '',
    dataRate: '',
    minDeviceCommit: '',
    isPooling: false,
    servicePlanId: '',
    submarketId: '',
    salesforceName: '',
  });


  // Load data service
  const [dataService, setData] = useState([]);
  useEffect(() => {
    // TODO : Update servicePlanID on Correcting serviceplan database
    const fetchData = async () => {
      try {
        const certus = await getCertusServices();
        setCertusServices(() => certus)

      } catch (error) {
        console.log('Certus Service HTTP', error)
      }
      try {
        const dataService = await getDataServiceListById(dataServiceId);
        console.log('DataService variable', dataService)
        setData(dataService);
        console.log('dataService.length: ', dataService.length)
        // Update values
        if (dataService.length > 0) {
          // On update
          setInputValues(prevState => ({
            ...prevState,
            planName: dataService[0].templateName,
            activationFee: dataService[0].activationFee,
            baseFee: dataService[0].baseFee,
            dataIncluded: dataService[0].dataIncluded,
            dataIncrement: dataService[0].dataIncrement,
            dataRate: dataService[0].dataRate,
            earlyTerminationFee: dataService[0].earlyTerminationFee,
            isInternetAccess: dataService[0].internetAccess,
            internetAccessFee: dataService[0].internetAccessFee,
            marketType: dataService[0]?.marketType,
            minDeviceCommit: dataService[0].minDeviceCommit,
            minSessionVolume: dataService[0].minSessionVolume,
            minTerm: dataService[0].minTerm,
            isPooling: dataService[0].pooling,
            servicePlanId: dataService[0].servicePlanID,
            submarketId: dataService[0].submarketID,
            salesforceName: dataService[0].salesforceName
          }))
          if (dataService[0]?.marketType !== UNIT.MARKET_TYPE.LANDMOBILE.ID) {
            setIsLand(() => false);
          }
        } else {
          // On create designate the first selected plan
          // TODO: review static value of servicePlanId. 
          setInputValues(prevState => ({
            ...prevState,
            marketType: UNIT.MARKET_TYPE.LANDMOBILE.ID,
            servicePlanId: '36112943522',                             // first plan
            submarketId: UNIT.MARKET_TYPE.LANDMOBILE.SUBMARKET_ID
          }))
        }
      } catch (error) {
        console.error("Error fetching accounts data:", error);
      }
    };
    fetchData();
  }, []);

  // MARKET TYPE SELECTOR
  const handleMarketTypeSelector = (value) => {
    console.log("value", value)
    const selectedType = CertusServices.filter(v => v.id === value)[0]

    if (value) {
      setInputValues(prevState => ({ ...prevState, marketType: selectedType.name, submarketId: value }));
      if (selectedType.name !== UNIT.MARKET_TYPE.LANDMOBILE.ID) {
        setIsLand(() => false)
      } else {
        setIsLand(() => true)
      }
    }
  }

  const checkIfParametersNoEmpty = async () => {
    if (inputValues.planName === '') {
      onFailed("Please enter a plan name.");
      return false;
    }
    if (inputValues.activationFee === '') {
      onFailed("Please enter an activation fee.");
      return false;
    }
    if (inputValues.minDeviceCommit === '') {
      onFailed("Please enter a minimum device commit.");
      return false;
    }
    if (inputValues.minTerm === '') {
      onFailed("Please enter a minimum term.");
      return false;
    }
    if (inputValues.internetAccessFee === '') {
      onFailed("Please enter an internet access fee.");
      return false;
    }
    if (inputValues.baseFee === '') {
      onFailed("Please enter a base fee.");
      return false;
    }
    if (inputValues.earlyTerminationFee === '') {
      onFailed("Please enter an early termination fee.");
      return false;
    }
    if (inputValues.dataIncluded === '') {
      onFailed("Please enter a data included.");
      return false;
    }
    if (inputValues.dataIncrement === '') {
      onFailed("Please enter a data increment.");
      return false;
    }
    if (inputValues.dataRate === '') {
      onFailed("Please enter a data rate.");
      return false;
    }
    if (inputValues.minSessionVolume === '') {
      onFailed("Please enter a minimum session volume.");
      return false;
    }
    if (inputValues.servicePlanId === '') {
      onFailed("Please enter a service plan id.");
      return false;
    }
    if (inputValues.submarketId === '') {
      onFailed("Please enter a submarket id.");
      return false;
    }
    return true;
  }

  const handleUpdateDataService = async () => {
    setLoading(true);
    // Ensure parameters are not empty
    const parametersNotEmpty = await checkIfParametersNoEmpty();
    if (!parametersNotEmpty) {
      return;
    }

    //Update data service
    try {
      // API request to update account setting
      const update = await updateDataService(
        dataServiceId,
        inputValues.planName,
        inputValues.activationFee,
        inputValues.baseFee,
        inputValues.dataIncluded,
        inputValues.dataIncrement,
        inputValues.dataRate,
        inputValues.earlyTerminationFee,
        inputValues.isInternetAccess,
        inputValues.internetAccessFee,
        inputValues.marketType,
        inputValues.minDeviceCommit,
        inputValues.minSessionVolume,
        inputValues.minTerm,
        inputValues.isPooling,
        inputValues.servicePlanId,
        inputValues.submarketId,
      );
      if (!update) {
        msg.current.innerText = "Error : failed udpate.";
        (() => { onFailed("Failed to update data service."); })()
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

  const handleCreateDataService = async () => {
    console.log("handleCreateDataService");
    setLoading(true);
    // Set internetAccessFee = 0 if internet switch is off
    if (!inputValues.isInternetAccess && inputValues.internetAccessFee === '') {
      inputValues.internetAccessFee = 0;
    }

    // Ensure parameters are not empty
    const parametersNotEmpty = await checkIfParametersNoEmpty();
    if (!parametersNotEmpty) {
      return;
    }

    //Create data service
    try {
      // API request to update account setting
      const create = await createDataService(
        inputValues.planName,
        inputValues.activationFee,
        inputValues.baseFee,
        inputValues.dataIncluded,
        inputValues.dataIncrement,
        inputValues.dataRate,
        inputValues.earlyTerminationFee,
        inputValues.isInternetAccess,
        inputValues.internetAccessFee,
        inputValues.marketType,
        inputValues.minDeviceCommit,
        inputValues.minSessionVolume,
        inputValues.minTerm,
        inputValues.isPooling,
        inputValues.servicePlanId,
        inputValues.submarketId,
      );
      if (!create) {
        (() => { onFailed("Failed to create a new data service."); })()
        return;
      }
      else {
        //On Success Toast message
        onSuccess("Successfully created new data service");
        nav(`${PATH_NAME.DATA_SERVICE_VIEW}?id=${create?.id}` )
      }

    } catch (error) {
      if (error.message === "Data service already exists") {
        (() => { onFailed("Plan name already exists."); })()
      } else {
        console.log("request error");
        (() => { onFailed("Failed to create a new data service."); })()
      }
    }
  }

  const onFailed = (errorMessage) => {
    setFailed(true);

    setLoading(false);
    setErrorMessage(errorMessage); // Set errorMessage state
    (() => {
      toast({

        title: dataService ? 'Failed updating data service.' : errorMessage,
        status: dataService ? 'error' : 'warning',
        duration: 9000,
        isClosable: true,
      })
    })()
  }
  const onSuccess = (message = '') => {
    setFailed(false);
    setLoading(false);
    (() => {
      toast({
        title: message || 'Successfully update data service.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

  // Validate user input
  const handleIntegerInputChange = (event, inputName, maxLeftDigits) => {
    const { value } = event.target;
    // Validate input to allow only decimal with max specified digits to the left and specified decimal points
    const isValidInput = new RegExp(`^\\d{0,${maxLeftDigits}}(\\.\\d+)?$`).test(value); // Check if the input is valid
    const newValue = isValidInput ? value : inputValues[inputName]; // Use previous value if input is not valid
    // Update state based on input name
    setInputValues(prevState => ({
      ...prevState,
      [inputName]: newValue,
    }));
  };

  const handleDecimalInputChange = (event, inputName, maxLeftDigits, maxDecimalPoints) => {
    const { value } = event.target;
    // Validate input to allow only decimal with max specified digits to the left and specified decimal points
    const isValidInput = new RegExp(`^\\d{0,${maxLeftDigits}}(\\.\\d{0,${maxDecimalPoints}})?$`).test(value); // Check if the input is valid
    const newValue = isValidInput ? value : inputValues[inputName]; // Use previous value if input is not valid
    // Update state based on input name
    setInputValues(prevState => ({
      ...prevState,
      [inputName]: newValue,
    }));
  };

  const handleCurrencyInputChange = (event, inputName, maxLeftDigits, maxDecimalPoints) => {
    let { value } = event.target;
    // Remove the dollar sign if present
    value = value.replace('$', '');
    // Validate input to allow only decimal with max specified digits to the left and specified decimal points
    const isValidInput = new RegExp(`^\\d{0,${maxLeftDigits}}(\\.\\d{0,${maxDecimalPoints}})?$`).test(value); // Check if the input is valid
    const newValue = isValidInput ? value : inputValues[inputName]; // Use previous value if input is not valid
    // Update state based on input name
    setInputValues(prevState => ({
      ...prevState,
      [inputName]: newValue,
    }));
  };

  // Function to handle switch toggle
  const handlePoolingToggle = () => {
    console.log("handlePoolingToggle");
    setInputValues(prevState => ({
      ...prevState,
      isPooling: !prevState.isPooling, // Toggle isPooling state
    }));
  };

  // Function to handle switch toggle
  const handleInternetAccessToggle = () => {
    setInputValues(prevState => ({
      ...prevState,
      isInternetAccess: !prevState.isInternetAccess, // Toggle isPooling state
    }));
  };

  const handleOnChange = (value, fieldName) => {
    setInputValues(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  const ShowText = ({ errorMessage = '' }) => {
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

  return (
    <FormControl>
      <Card maxW='1000px'>
        <Flex direction='column' mb='30px' ms='10px'>
          <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
            {isCreateDataService ? "New Data Service" : "Data Service Detail : "}
            {inputValues?.salesforceName}
          </Text>
        </Flex>
        <Flex direction='column'>
          {/* Plan Name */}
          <Box>
            <InputField
              id='planName'
              label='Data Service Plan Name*'
              onChange={(event) => handleOnChange(event.target.value, 'planName')}
              placeholder={'Certus 5MB'}
              value={!!inputValues?.planName?inputValues.planName : ''}
              maxLength={120} // Limit input characters
            />
          </Box>
          {/* Market Type */}
          <Flex direction='column' mb="20px">
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'
              _hover={{ cursor: "arrow" }}>
              Market Type
            </FormLabel>
            <Select
              iconColor={textColorPrimary}
              textColor={textColorPrimary}
              fontWeight='500'
              fontSize='15px'
              variant='main'
              h='44px'
              maxh='44px'
              me='20px'
              placeholder={isLand ? UNIT.MARKET_TYPE.LANDMOBILE.ID : UNIT.MARKET_TYPE.AVIATION.ID}
              onChange={(e) => { handleMarketTypeSelector(e.target.value); }} // Handle onChange event        
            >
 
              {CertusServices.map((v, i) => {
                if ((v.name === inputValues.marketType)) return null;
                return <option key={v.id} value={v.id} fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>{v.name}</option>
              })}
            </Select>
          </Flex>
          {/* Activation fee and minimum device commit */}
          <SimpleGrid
            mb='0px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              id='activationFee'
              label='Activation Fee*'
              onChange={(event) => handleCurrencyInputChange(event, 'activationFee', 13, 2)}
              placeholder={inputValues?.activationFee ? "$" + inputValues?.activationFee : "$0.00"}
              value={!!inputValues?.activationFee?inputValues?.activationFee:''}
            />
            <InputField
              id='minDeviceCommit'
              label='Minimum Device Commit*'
              onChange={(event) => handleIntegerInputChange(event, 'minDeviceCommit', 6)}
              placeholder={inputValues.minDeviceCommit || '0'}
              value={!!inputValues?.minDeviceCommit ? inputValues?.minDeviceCommit:''}
            />
          </SimpleGrid>
          {/* Minimum term */}
          <SimpleGrid
            mb='0px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <Box>
              <InputField
                id='minTerm'
                label='Minimum Term (Month)*'
                onChange={(event) => handleIntegerInputChange(event, 'minTerm', 4)}
                placeholder={inputValues?.minTerm || '0'}
                value={!!inputValues?.minTerm ? inputValues?.minTerm:''}
              />
            </Box>
          </SimpleGrid>
          {/* Pooling */}
          {inputValues.isPooling && (
            <Flex justify="space-between" align="center">
              <Box>
                <SwitchField
                  reversed={true}
                  fontSize='sm'
                  mb='20px'
                  id='pooling'
                  label='Pooling'
                  defaultChecked={true}
                  onClick={handlePoolingToggle} // Call handlePoolingToggle when the switch is toggled
                />
              </Box>
            </Flex>
          )}
          {!inputValues.isPooling && (
            <Flex justify="space-between" align="center">
              <Box>
                <SwitchField
                  reversed={true}
                  fontSize='sm'
                  mb='20px'
                  id='pooling'
                  label='Pooling'
                  defaultChecked={false}
                  onClick={handlePoolingToggle} // Call handlePoolingToggle when the switch is toggled
                />
              </Box>
            </Flex>
          )}
          {/* Internet access */}
          {inputValues.isInternetAccess && (
            <Flex justify="space-between" align="center">
              <Box>
                <SwitchField
                  reversed={true}
                  fontSize='sm'
                  mb='20px'
                  id='internetAccess'
                  label='Internet Access'
                  defaultChecked={true}
                  onClick={handleInternetAccessToggle} // Call handleInternetAccessToggle when the switch is toggled
                />
              </Box>
            </Flex>
          )}
          {!inputValues.isInternetAccess && (
            <Flex justify="space-between" align="center">
              <Box>
                <SwitchField
                  reversed={true}
                  fontSize='sm'
                  mb='20px'
                  id='internetAccess'
                  label='Internet Access'
                  defaultChecked={false}
                  onClick={handleInternetAccessToggle} // Call handleInternetAccessToggle when the switch is toggled
                />
              </Box>
            </Flex>
          )}
          {inputValues.isInternetAccess && ( // Render InputField only if showInputField is true
            <SimpleGrid
              mb='0px'
              columns={{ sm: 1, md: 2 }}
              spacing={{ base: "20px", xl: "20px" }}>
              <Box style={{ marginLeft: '30px' }}>
                <InputField
                  id='internetAccessFee'
                  label='Internet Access Fee*'
                  onChange={(event) => handleCurrencyInputChange(event, 'internetAccessFee', 13, 2)}
                  placeholder={inputValues.internetAccessFee ? "$" + inputValues.internetAccessFee : "$0.00"}
                  value={!!inputValues?.internetAccessFee? inputValues.internetAccessFee:''}
                />
              </Box>
            </SimpleGrid>
          )}
          {/* Base fee and early termination fee */}
          <SimpleGrid
            mb='20px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              mb='0px'
              me='30px'
              id='baseFee'
              label='Monthly Fee*'
              onChange={(event) => handleCurrencyInputChange(event, 'baseFee', 13, 2)}
              placeholder={inputValues?.baseFee ? "$" + inputValues?.baseFee : "$0.00"}
              value={!!inputValues?.baseFee?inputValues.baseFee:'' }
            />
            <InputField
              mb='0px'
              me='30px'
              id='earlyTerminationFee'
              label='Early Termination Fee*'
              onChange={(event) => handleCurrencyInputChange(event, 'earlyTerminationFee', 13, 2)}
              placeholder={inputValues.earlyTerminationFee ? "$" + inputValues.earlyTerminationFee : "$0.00"}
              value={!!inputValues?.earlyTerminationFee ? inputValues.earlyTerminationFee:''}
            />
          </SimpleGrid>
          {/* Data included and data increment */}
          <SimpleGrid
            mb='20px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              mb='0px'
              me='30px'
              id='dataIncluded'
              label='Data Included (MB)*'
              onChange={(event) => handleIntegerInputChange(event, 'dataIncluded', 15)}
              placeholder={inputValues?.dataIncluded || '0'}
              value={!!inputValues?.dataIncluded?inputValues.dataIncluded:''}
            />
            <InputField
              mb='0px'
              id='dataIncrement'
              label='Data Increment (KB)*'
              onChange={(event) => handleDecimalInputChange(event, 'dataIncrement', 12, 4)}
              placeholder={inputValues?.dataIncrement || '0'}
              value={!!inputValues?.dataIncrement?inputValues.dataIncrement:''}
            />
          </SimpleGrid>
          {/* Data rate and minimum session volume */}
          <SimpleGrid
            mb='20px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              mb='0px'
              me='30px'
              id='dataRate'
              label='Data Rate per MB*'
              onChange={(event) => handleCurrencyInputChange(event, 'dataRate', 9, 6)}
              placeholder={inputValues.dataRate ? "$" + inputValues.dataRate : '$0.00'}
              value={!!inputValues?.dataRate?inputValues.dataRate:''}
            />
            <InputField
              mb='0px'
              id='minimumSessionVolume'
              label='Minimum Session Volume (KB)*'
              onChange={(event) => handleIntegerInputChange(event, 'minSessionVolume', 15)}
              placeholder={inputValues.minSessionVolume || '0'}
              value={!!inputValues?.minSessionVolume? inputValues.minSessionVolume:''}
            />
          </SimpleGrid>
          {/* Service Plans */}
          <Flex direction='column' mb="20px">
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'
              _hover={{ cursor: "arrow" }}>
              Service Plan* {/*    */}
            </FormLabel>
            <Select
              iconColor={textColorPrimary}
              textColor={textColorPrimary}
              fontWeight='500'
              fontSize='15px'
              variant='main'
              h='44px'
              maxh='44px'
              me='20px'
              value={isLand ? certusServices?.filter(i => isLand && isCreateDataService ? i.id === inputValues.submarketId : i.id === UNIT.MARKET_TYPE.LANDMOBILE.SUBMARKET_ID)[0]?.servicePlans?.filter(i => i.id === inputValues.servicePlanId)[0]?.name
                : certusServices?.filter(i => i.id === inputValues.submarketId)[0]?.servicePlans?.filter(i => i.id === inputValues.servicePlanId)[0]?.name}
              placeholder={isLand ? certusServices?.filter(i => isLand && isCreateDataService ? i.id === inputValues.submarketId : i.id === UNIT.MARKET_TYPE.LANDMOBILE.SUBMARKET_ID)[0]?.servicePlans?.filter(i => i.id === inputValues.servicePlanId)[0]?.name
                : certusServices?.filter(i => i.id === inputValues.submarketId)[0]?.servicePlans?.filter(i => i.id === inputValues.servicePlanId)[0]?.name}
              onChange={(e) => setInputValues(prevState => ({ ...prevState, servicePlanId: e.target.value }))}
            >
              {isLand ?
                certusServices?.filter(i => i.name === UNIT.MARKET_TYPE.LANDMOBILE.ID)[0]?.servicePlans
                  .filter(v => v.id !== inputValues.servicePlanId)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((v, i) => (
                    <option key={i} value={v?.id} fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>
                      {v?.name}
                    </option>
                  ))
                :
                certusServices?.filter(i => i.name === UNIT.MARKET_TYPE.AVIATION.ID)[0]?.servicePlans
                  .filter(v => v.id !== inputValues.servicePlanId)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((v, i) => (
                    <option key={i} value={v?.id} fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>
                      {v?.name}
                    </option>
                  ))}
            </Select>
          </Flex>
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
            onClick={isCreateDataService ? handleCreateDataService : handleUpdateDataService}
          >
            {isCreateDataService ? "Create Data Service" : "Update Data Service"}
          </Button>
        </Flex>
      </Card>
    </FormControl>
  );
}