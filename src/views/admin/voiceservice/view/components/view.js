/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports

import createVoiceService from 'services/voiceServiceTemplate/createVoiceService.js';
import getVoiceServiceListById from 'services/voiceServiceTemplate/getVoiceServiceListById.js';
import updateVoiceService from 'services/voiceServiceTemplate/updateVoiceService.js';
import createVoiceLine from 'services/voiceLine/createVoiceLine.js';
import deleteVoiceLine from 'services/voiceLine/deleteVoiceLine.js'
import {PATH_NAME } from 'variables/constants'


// Chakra imports
import {
  Flex,
  Box,
  Button,
  FormControl,
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
export default function VoiceService({ voiceServiceId, updateVoiceServiceTemplate, isCreate }) {
  // App 
  const toast = useToast();
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberToast, setRememberToast] = useState('')                                            // Track toast message to remove duplicate toast

  const nav = useNavigate();
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");

  // Define state for input values
  const [inputValues, setInputValues] = useState({
    "id": "",
    "templateName": "",
    "activationFee": "",
    "baseFee": "",
    "billingIncrement": "",
    "isuIsuRate": "",
    "isuOtherSatelliteRate": "",
    "isuPstnRate": "",
    "isuShortCodes": "",
    "isuVoiceMailRate": "",
    "pstnIsu2StageRate": "",
    "pstnIsuRate": "",
    "shortCodesIsu": "",
    "localNumberAccessFee": "",
    "twoStageAccessFee": ""
  });                                                                                               // form input values
    

  useEffect(() => {

    if (!isCreate) {
      // On update
      // load voice service plan data
      setInputValues(prevState => ({
        ...prevState,
        templateName: voiceServiceId?.templateName,
        activationFee: voiceServiceId?.activationFee,
        baseFee: voiceServiceId?.baseFee,
        billingIncrement: voiceServiceId?.billingIncrement,
        isuIsuRate: voiceServiceId?.isuIsuRate,
        isuOtherSatelliteRate: voiceServiceId?.isuOtherSatelliteRate,
        isuPstnRate: voiceServiceId?.isuPstnRate,
        isuShortCodes: voiceServiceId?.isuShortCodes,
        isuVoiceMailRate: voiceServiceId?.isuVoiceMailRate,
        pstnIsu2StageRate: voiceServiceId?.pstnIsu2StageRate,
        pstnIsuRate: voiceServiceId?.pstnIsuRate,
        shortCodesIsu: voiceServiceId?.shortCodesIsu,
        localNumberAccessFee: voiceServiceId?.localNumberAccessFee,
        twoStageAccessFee: voiceServiceId?.twoStageAccessFee,
        salesforceName: voiceServiceId?.salesforceName,
      }))
    } else {
      // setting voice line default minimum value
      setInputValues(prevState => ({
        ...prevState,
        billingIncrement: "20",
        }))
    }

  }, [voiceServiceId]);


  const checkIfParametersNoEmpty = async () => {
    if (inputValues.templateName === '') {
      onFailed("Please enter a plan name.");
      return false;
    }

    return true;
  }

  const handleVoiceService = async () => {
    setLoading(true);
    let idTout;                 // timer status
    let idToutCreate;           // create status
    let updateNewVl;            // update new voice line state
    let createnewvs;            // create new voice service state

    // Ensure parameters are not empty
    const parametersNotEmpty = await checkIfParametersNoEmpty();
    if (!parametersNotEmpty) {
      return;
    }
    if (inputValues?.billingIncrement < 20) {
      onFailed('Billing Increment cannot be less than 20 seconds.')
      return;
    }
    //Update voice service
    try {
      // create voice object to pass request
      const voiceService = {
        templateName: inputValues?.templateName,
        activationFee: inputValues?.activationFee,
        baseFee: inputValues?.baseFee,
        billingIncrement: inputValues?.billingIncrement,
        isuIsuRate: inputValues?.isuIsuRate,
        isuOtherSatelliteRate: inputValues?.isuOtherSatelliteRate,
        isuPstnRate: inputValues?.isuPstnRate,
        isuShortCodes: inputValues?.isuShortCodes,
        isuVoiceMailRate: inputValues?.isuVoiceMailRate,
        pstnIsu2StageRate: inputValues?.pstnIsu2StageRate,
        pstnIsuRate: inputValues?.pstnIsuRate,
        shortCodesIsu: inputValues?.shortCodesIsu,
        localNumberAccessFee: inputValues?.localNumberAccessFee,
        twoStageAccessFee: inputValues?.twoStageAccessFee
      }
    

      let response = '';          // request responses for create and update
      let deleteResponse = '';    // request delete responses for create and update

      if (isCreate) { // CREATE VOICE SERVICE
        console.log('CREATE VOICE SERVICE', isCreate)
        // create voice service POST
        response = await createVoiceService(voiceService)
        // Create and Assign voiceLine
        if (response && voiceServiceId?.voiceLineTemplates?.length > 0) {
          idToutCreate = setTimeout(() => {
            voiceServiceId?.voiceLineTemplates?.forEach(async v => {
              try {
                createnewvs = await createVoiceLine(response.id, v)
              } catch (error) {
                if (error.message === "") {
                  console.log("");
                  (() => { onFailed(""); })()
                } else {
                  console.error("request error", error);
                  (() => { onFailed("Failed Assigning VoiceLine"); })()
                }
              }
            })
          }, 500)
        }

        if ((response)) {
            //On Success Toast message
            onSuccess();
            window.location.href = `${PATH_NAME.VOICE_SERVICE_VIEW}?id=${response?.id}`
        } else {
          (() => { onFailed("Failed to create voice service."); })()
          clearTimeout(idToutCreate)
          return
        }
      } else { // UPDATE VOICE SERVICE
        console.log('UPDATE VOICE SERVICE', !isCreate)

        // update voice service
        let tempService = '';
        response = await updateVoiceService(voiceServiceId?.id, voiceService)

        tempService = await getVoiceServiceListById(voiceServiceId?.id)
        // delete all assigned voice line
        if (tempService?.voiceLineTemplates && response) {
          console.log('GET VOICE SERVICE TEMPLATE', tempService)
          tempService?.voiceLineTemplates?.forEach(async v => {
            try {
              deleteResponse = await deleteVoiceLine(v.id)
              console.log("DELETE VoiceLine", deleteResponse)
            } catch (error) {
              if (error.message === "") {

                (() => { onFailed(""); })()
              } else {
                console.error("request error", error);
                (() => { onFailed("Failed Deleting VoiceLine"); })()
              }
            }
          })
        }
        console.log("UPDATE CREATE VOICELINE", voiceServiceId?.voiceLineTemplates?.length)
        if ((voiceServiceId?.voiceLineTemplates?.length > 0) && response) {
          idTout = setTimeout(() => {
            // Create and Assign voiceLine
            voiceServiceId?.voiceLineTemplates?.forEach(async (v, i) => {
              const voiceLineTemp = { ...v, lineNumber: i + 1 }
              try {
                console.log("VOICELINE template", v)
                updateNewVl = await createVoiceLine(voiceServiceId?.id, voiceLineTemp)
                console.log('CREATE NEW VOICE LINE')
              } catch (error) {
                console.error("request error", error);
                (() => { onFailed("Failed Assigning VoiceLine"); })()
              }
            })
          }, 500)
        }

        console.error("Response True", response)
        if (response) {
          //On Success Toast message
          onSuccess();
          nav(`${PATH_NAME.VOICE_SERVICE_VIEW}?id=${voiceServiceId?.id}`)
        }
        else {
          onFailed("Failed to update voice service.");
        }
      }
    } catch (error) {
        console.error("request error", error);
        onFailed("Failed :" +error);
    } finally {
      if (updateNewVl) {
        clearTimeout(idTout)
      }
      if (createnewvs) {
        clearTimeout(idToutCreate)
      }
    }

  }

  const onFailed = (errorMessage) => {
    setFailed(true);
    setRememberToast(() => '')
    setLoading(false);
    setErrorMessage(errorMessage); // Set errorMessage state
    (() => {
      toast({

        title: errorMessage,
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    })()
  }
  const onWarn = (warningMessage) => {
    setLoading(false);
    if (rememberToast !== warningMessage) {
      setRememberToast(() => warningMessage)
    } else {
      setRememberToast(() => '')
      return;
    }
    (() => {
      toast({

        title: warningMessage || "Please verified form inputs.",
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = () => {
    setFailed(false);
    setRememberToast(() => '')
    setLoading(false);
    (() => {
      toast({
        title: isCreate ? 'Successfully created voice service.' : 'Successfully updated voice service.',
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
    const isValidInput = new RegExp(`^\\d{0,${maxLeftDigits}}$`).test(value); // Check if the input is valid
    const newValue = isValidInput ? value : inputValues[inputName]; // Use previous value if input is not valid
    if (value < 20) {
      onWarn("Cannot have billing increments less than 20 seconds.")
    }
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
      {errorMessage || "Failed - Update/Create voice service"}
    </Text>
  };

  return (
    <FormControl mt={{ sm: "-5px", md: "45px", lg: "0px" }} mb={{ sm:"25px", md:"40px",lg:"-5px" }}>
      <Card maxW={{ sm: "100%", md: '100%', lg: "100%", xl: "100%" }} >
        <Flex direction='column' mb='30px' ms='10px'>
          <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
            {!isCreate ? "Certus Voice Service Detail : " : "Create Certus Voice Service"}
            {inputValues.salesforceName}
          </Text>
        </Flex>
        <Flex direction='column'>
          {/* Plan Name */}
          <Box>
            <InputField
              id='templateName'
              label='Voice Service Plan Name*'
              placeholder='Certus 5MB'
              onChange={(event) => handleOnChange(event.target.value, 'templateName')}
              value={inputValues.templateName}
              maxLength={120} // Limit input characters
            />
          </Box>
          {/* Activation fee, Local Number Access Fee, Base Fee, Billing Increment */}
          <SimpleGrid
            mb='15px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              mb='0px'
              id='activationFee'
              title='Fee that is incurred when a device switches to an ACTIVE state'
              label='Activation Fee*'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'activationFee', 13, 2)}
              value={inputValues.activationFee ? "$" + inputValues.activationFee : ""}
            />
            <InputField
              id='basefee'
              label='Monthly Fee*'
              title='Monthly fee charged for each device'
              placeholder='$0'
              onChange={(event) => handleCurrencyInputChange(event, 'baseFee', 13, 2)}
              value={inputValues.baseFee ? "$" + inputValues.baseFee : ""}
            />
            <InputField
              mb='0px'
              id='accessFee'
              title='Monthly local number access fee charged for each device'
              label='Local Number Access Fee*'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'localNumberAccessFee', 13, 2)}
              value={inputValues.localNumberAccessFee ? "$" + inputValues.localNumberAccessFee : ""}
            />
            <InputField
              mb='0px'
              id='twoAccessFee'
              title='Monthly Two Stage Access Fee charged for each device'
              label='Two Stage Access Fee*'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'twoStageAccessFee', 13, 2)}
              value={inputValues.twoStageAccessFee ? "$" + inputValues.twoStageAccessFee : ""}
            />
            <InputField
              id='billingInc'
              title='Call duration billable increments (seconds)'
              label='Billing Increment*'
              placeholder='0'
              onChange={(event) => handleIntegerInputChange(event, 'billingIncrement',4)}
              value={inputValues.billingIncrement}
            />
          </SimpleGrid>

          {/* PSTN TO ISU and ISU to PSTN */}
          <SimpleGrid
            mb='15px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              id='toISUmsg'
              title='PSTN Short Code to ISU charge rate per message'
              label='PSTN to ISU SMS'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'shortCodesIsu', 9, 6)}
              value={inputValues.shortCodesIsu ? "$" + inputValues.shortCodesIsu : ""}
            />
            <InputField
              id='toPSTNmsg'
              label='ISU to PSTN SMS'
              title='	ISU to PSTN Short Code charge rate per message'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'isuShortCodes', 9, 6)}
              value={inputValues.isuShortCodes ? "$" + inputValues.isuShortCodes : ""}
            />
          </SimpleGrid>

          {/* isu Isu Rate and isu Other Satellite Rate */}
          <SimpleGrid
            mb='15px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              mb='0px'
              id='isuRate'
              title='ISU to ISU charge rate per minute'
              label='ISU to ISU'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'isuIsuRate', 9, 6)}
              value={inputValues.isuIsuRate ? "$" + inputValues.isuIsuRate : ""}
            />
            <InputField
              mb='0px'
              id='otherISU'
              title='ISU to Other satellite network charge rate per minute'
              label='ISU to other Satellite ISU'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'isuOtherSatelliteRate', 9, 6)}
              value={inputValues.isuOtherSatelliteRate ? "$" + inputValues.isuOtherSatelliteRate : ""}
            />
            {/* to PSTN rate /min and to Voice Mail rate / min */}
            <InputField
              id='toPSTNmin'
              title='ISU to PSTN charge rate per minute'
              label='ISU to PSTN'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'isuPstnRate', 9, 6)}
              value={inputValues.isuPstnRate ? "$" + inputValues.isuPstnRate : ""}
            />
            <InputField
              id='voiceMailRate'
              title='ISU to Voice Mail charge rate per minute'
              label='ISU to Voice Mail'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'isuVoiceMailRate', 9, 6)}
              value={inputValues.isuVoiceMailRate ? "$" + inputValues.isuVoiceMailRate : ""}
            />
          </SimpleGrid>

          {/* Data rate and minimum session volume */}
          <SimpleGrid
            mb='0px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <InputField
              id='toISU2Stage'
              title='PSTN to ISU via Iridium Two-Stage Platform rate per minute'
              label='PSTN to ISU Two-Stage'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'pstnIsu2StageRate', 9, 6)}
              value={inputValues.pstnIsu2StageRate ? "$" + inputValues.pstnIsu2StageRate : ""}
            />
            <InputField
              id='toISUmin'
              title='PSTN to ISU charge rate per minute'
              label='PSTN to ISU'
              placeholder='$0.00'
              onChange={(event) => handleCurrencyInputChange(event, 'pstnIsuRate', 9, 6)}
              value={inputValues.pstnIsuRate ? "$" + inputValues.pstnIsuRate : ""}
            />
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
            onClick={handleVoiceService}
          >
            {isCreate ? "Create Voice Service" : "Update Voice Service"}
          </Button>
        </Flex>
      </Card>
    </FormControl>

  );
}