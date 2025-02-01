/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getDeviceInfo from 'services/device/getDeviceInfo';
import getDeviceProfile from 'services/device/getDeviceProfile';
import updateDevice from 'services/device/updateDevice'
import updateActiveDeviceIdentifier from 'services/device/updateActiveDeviceIdentifier'
import updateActiveDeviceAdditionalInfo from 'services/device/updateActiveDeviceAdditionalInfo'
import createDeviceVoiceLine from 'services/device/createDeviceVoiceLine'
import updateDeviceVoiceLine from 'services/device/updateDeviceVoiceLine'
// params accountNumber, imei, lineNumber
import deleteDeviceVoiceLine from 'services/device/deleteDeviceVoiceLine'
import getVoiceLineTemplateUsingDeviceVSID from 'services/device/getVoiceLineTemplateUsingDeviceVSID'

import {PATH_NAME } from 'variables/constants'

import { numbersOnly, dupSIM, dupESN, activeSIM, restrictedError, activeDevice } from 'tools/validators'
import { generateUUID } from 'tools/validators'

import Activation from './activateWs';
import Deactivation from './deactivateWs';
import Delete from './delete'
import { AuthContext } from 'contexts/AuthContext'

//TEST ONLOGOUT

import TextField from 'components/fields/TextField';

import "react-calendar/dist/Calendar.css";
import { FaXmark } from "react-icons/fa6";
import { FaPlus, FaMinus } from 'react-icons/fa';

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
import React, { useEffect, useRef, useState, useContext, useReducer } from "react";

// Custom components
import InputField from "components/fields/InputField";
import VoiceLine from './VoiceLine';


export const VOICELINE = {
  UPDATE: 'UPDATE',
  UPDATEFIELD: 'UPDATEFIELD',
  RESET: 'RESET',
  REMOVE: 'REMOVE',
  ADD: 'ADD',
  ADDLINE: 'ADDLINE',
  REMOVELINE: 'REMOVELINE',
  NOLINE: 0,
  HIGH: "HIGH",
  HIGHONLY: "HIGH_ONLY"
}
const vLine = {

}
const dispatchVoiceService = (vLine, action) => {
  console.log("Dispatched")
  switch (action.type) {
    case VOICELINE.RESET:
      return { ...vLine, line: [] }
    case VOICELINE.REMOVELINE:
      let remainingLine = []
      if (!!vLine?.line?.filter(v => v.lineNumber == action.payload.value)[0])
        remainingLine = vLine?.line?.filter(v => v.lineNumber !== action.payload.value)
      console.log("Dispatched Remove Line", { value: action.payload.value, remaining: remainingLine, condition: !!vLine?.line?.filter(v => v.lineNumber == action.payload.value)[0] })
      return { ...vLine, line: remainingLine?.sort((a, b) => a.lineNumber - b.lineNumber) }
    case VOICELINE.UPDATE:
      console.log("Dispatch UPDATE", { ...vLine, [action.payload.name]: action.payload.value })
      return { ...vLine, [action.payload.name]: action.payload.value }
    case VOICELINE.UPDATEFIELD:
      const updateLine = vLine?.line?.map((v) => {
        if (v.lineNumber == action.payload.lineNumber) {
          return { ...v, [action.payload.name]: action.payload.value }
        } else {
          return v
        }
      })
      console.log("Dispatch LINE UPDATEFIELD", updateLine)
      return { ...vLine, line: updateLine?.sort((a, b) => a.lineNumber - b.lineNumber) }

    case VOICELINE.ADD:
      console.log("Dispatch ADD", { ...vLine, ...action.payload.info })
      return { ...vLine, ...action.payload.info }
    case VOICELINE.ADDLINE:
      console.log("DISPATCH ADDLINE", { ...vLine, line: [...vLine?.line, action.payload.line]?.sort((a, b) => a.lineNumber - b.lineNumber) })
      return { ...vLine, line: [...vLine.line, action.payload.line]?.sort((a, b) => a.lineNumber - b.lineNumber) }
    default:
      console.log("Dispatched - Default", vLine)
      return vLine
  }
}

// Default function
export default function DeviceView({ deviceId, account }) {

  // using context
  //const accountInfo = getAccountInfo();
  const { accountInfo, deviceStatusRef } = useContext(AuthContext);
  accountInfo.current = getAccountInfo();

  const toast = useToast();
  const refField = useRef()

  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedServicePlan, setSelectedServicePlan] = useState();

  const cachedVoiceLineTemplate = useRef([])

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");
  const optionsBackGroundColor = useColorModeValue('white', `grey`);

  // Define state for input values
  const [inputValues, setInputValues] = useState({});

  // Update voiceline
  const [voiceLine, updateVoiceLine] = useReducer(dispatchVoiceService, vLine)

  // Load device profile
  const [device, setDevice] = useState();
  const [deviceProfile, setDeviceProfile] = useState();
  const [deviceProfileUnfiltered, setDeviceProfileUnfiltered] = useState();
  const [scheduleTime, setScheduleTime] = useState();
  const [cancel, setCancel] = useState(false);
  const [trackToast, setTrackToast] = useState(undefined)

  // Call-out iridium callout status
  const [iridiumStatus, setIridiumStatus] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get device detail
      try {
        const deviceDetail = await getDeviceInfo(account, deviceId);

        let linetmp = [];
        if (deviceDetail?.bundleData?.voiceService) {
          if (deviceDetail?.voiceLines) {
            linetmp = deviceDetail?.voiceLines
          }
          updateVoiceLine({ type: VOICELINE.UPDATE, payload: { name: 'line', value: linetmp } })
          cachedVoiceLineTemplate.current[deviceDetail?.bundleData?.voiceService] = deviceDetail?.bundleData?.voiceServiceData
        }
        console.log("DEVICE VOICELINE", voiceLine)

        setDevice(() => deviceDetail);
        console.log("deviceDetail:", deviceDetail);
      } catch (error) {
        // Review Error 
        onFailed('Failed retreiving device info')
        console.error("Error fetching device data:", error);
      }
      // Get device profile
      try {
        const devProfile = await getDeviceProfile(account, deviceId);
        //const devProfile = false
        if (!devProfile) {
          onWarning("Iridium service call failed.")
          setIridiumStatus(() => false)
        } else {
          setIridiumStatus(() => true)
          setDeviceProfile(() => devProfile);
          setDeviceProfileUnfiltered(() => devProfile);
          updateVoiceLine({ type: VOICELINE.ADD, payload: { info: { ...devProfile?.model, ...devProfile?.profile } } })
        }

      } catch (error) {
        // Review Error 
        onFailed('Failed retreiving device Profile')
        console.error("Error fetching device data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // DEBUG
    console.log("device initialize (View)", device)
    console.log("device profile (View)", deviceProfile)
    try {
      let scheduleTime = deviceProfile?.scheduledOperations[0].scheduleTime;
      setScheduleTime(scheduleTime);
    } catch (error) {
    }
    // Initial Input
    setInputValues((e) => ({
      ...e,
      active: device?.active,
      account: device?.account,
      accountNumber: device?.accountNumber,
      imei: device?.imei,                         // Cannot Update
      sim: device?.sim || '',                           // Cannot change on Active Device
      esn: device?.esn || '',
      imsi: device?.imsi,
      tailNumber: device?.tailNumber || '',
      identifier: device?.identifier,
      id: device?.id,
      ipName: deviceProfile?.ipRanges?.filter(v => v.id === device?.ipRangeID)[0]?.name || 'None',
      bundle: device?.bundle,
      ipRangeID: device?.ipRangeID,
      salesforceName: device?.salesforceName,
      dateDeactivated: device?.dateDeactivated,
      dateActivated: device?.dateActivated,
      model: deviceProfile?.model?.name,
      marketType: deviceProfile?.submarket?.name, // Cannot Update tied to IMEI
      additionalInfo: device?.additionalInfo || undefined
    }));

    // reset toast message tracker
    setTrackToast(() => undefined)
  }, [device, deviceProfile]);

  const handleUpdateDevice = async (reload = true) => {

    setLoading(true);
    console.log("esn", inputValues?.esn);
    console.log("esn.length", inputValues?.esn?.length);

    // On first creation of devices, they are null and a service plan must be selected on update
    if (!!!inputValues?.bundle) {
      onFailed("Please select a service plan for the device to update.")
      return false;
    }

    if (device?.bundleData?.voiceService || selectedServicePlan) {
      // handle error on invalid two stage pin
      let checkTwoStagePin = true;
      voiceLine?.line?.forEach((v) => {
        if (v.twoStagePin)
          if (v.twoStagePin?.length !== 4)
            checkTwoStagePin = false
      })
      if (!checkTwoStagePin) {
        onFailed("Invalid two-stage pin set (must be 4 digits or 0 digits to disable)")
        return false;
      }
    }

    // Make Identifier Updatable on Active Device
    if (device?.active) {
      if (!(inputValues?.identifier === device?.identifier)) {
        try {
          await updateActiveDeviceIdentifier(inputValues?.accountNumber, inputValues?.imei,
            inputValues?.identifier);
          onSuccess('Successfully updated identifer')
          return false
        } catch (error) {
          console.error("Failed to update identifer")
          onFailed("Failed to update identifer")
        }
      }
      // Make AdditionalInfo Updatable on Active Device
      if (!(inputValues?.additionalInfo === device?.additionalInfo)) {
        try {
          await updateActiveDeviceAdditionalInfo(inputValues?.accountNumber, inputValues?.imei,
            inputValues?.additionalInfo);
          onSuccess('Successfully updated device user detail.')
          return false
        } catch (error) {
          console.error("Failed to update device user detail.")
          onFailed("Failed to update device user detail.")
        }
      }
      onFailed("Error - Cannot update active device.")
      return false;
    }

    // variables to process voice lines on update
    const cachedDeviceVoiceLine = JSON.stringify(device?.voiceLines || 0)
    const userUpdatedVoiceLine = !!voiceLine?.line?.length ? JSON.stringify(voiceLine?.line) : '0'
    const cachedArrLength = device?.voiceLines?.length || '0'
    const userLinesArr = voiceLine?.line?.length || '0'
    const cachedLineOne = JSON.stringify(device.voiceLines?.filter(l => l.lineNumber == 1)[0] || 0)
    const userLineOne = JSON.stringify(voiceLine?.line?.filter(l => l.lineNumber == 1)[0] || 0)
    const cachedLineTwo = JSON.stringify(device?.voiceLines?.filter(l => l.lineNumber == 2)[0] || 0)
    const userLineTwo = JSON.stringify(voiceLine?.line?.filter(l => l.lineNumber == 2)[0] || 0)

    // Ensure parameters are valid
    if (inputValues?.sim?.length < 19) {
      onFailed('Invalid SIM.')
      return false;
    }
    // If identifier is null then fail
    if (inputValues?.marketType === 'Certus Aviation' && inputValues?.identifier === '') {
      if (inputValues?.tailNumber === '') {
        onFailed('Invalid tail number.')
        return false;
      }
      // If activation market type and identifier is null then identifier = Tail Number
      inputValues.identifier = inputValues?.tailNumber;
    } else if (device?.identifier === '') {
      // If identifier is null then identifier = esn
      inputValues.identifier = inputValues?.esn;
    }
    //Update Device
    try {
      // API request to update device *** MARKET TYPE of CERTUS AVIATION / CERTUS MOBILE may return error on call

      const update = await updateDevice(inputValues?.accountNumber, inputValues.imei,
        inputValues.bundle,
        inputValues.sim,
        inputValues.ipRangeID,
        inputValues.model,
        inputValues.esn,
        inputValues.tailNumber,
        inputValues?.identifier,
        '', // IMSI
        inputValues?.additionalInfo
      );

      if (!update) {
        onFailed("Failed to update device.");
        return false;
      }
      //On Success Toast message
      if (cachedDeviceVoiceLine === userUpdatedVoiceLine) {
        onSuccess('Update submitted successfully.');
        if (!!!device?.bundle) {
          window.location.href = `${PATH_NAME.DEVICE_VIEW}?account=${inputValues?.accountNumber}&id=${device?.imei}`
        } else {
          return true;
        }
      }
    } catch (error) {
      console.log('Update :', error)
      const tmp = error.toString();
      /* REVIEW error messages on Failed update */
      // Deactivation Error / Activation error
      if (tmp.match(/active/gi)) {
        onFailed('Cannot update active unit')
      } else if (activeSIM(tmp)) {
        onFailed("Cannot update active unit.")
      } else if (restrictedError(tmp)) {
        onFailed("Retricted field(s) update - Possible mismatch")
      } else if (activeDevice(tmp)) {
        onFailed("Device is active - Cannot update")
      } else if (dupSIM(tmp)) {
        onFailed("Duplicate SIM error")
        refField.current.focus();
      } else if (dupESN(tmp)) {
        onFailed("Duplicate ESN error")

      } else { // additional validators here
        console.log("request error");
        onFailed("http error");
      }
      return false;
    }
    // only handle device voiceline if it exist on bundle -- If Service Plan updated than all previous lines will be removed (Ryan - revisit and verify this on live testing)
    if (device?.bundleData?.voiceService || selectedServicePlan) {
      const vline = voiceLine?.line?.map((v) => {
        if (!!!v.twoStagePin)
          return { "lineNumber": v.lineNumber }
        return { "lineNumber": v.lineNumber, "twoStagePin": v.twoStagePin }
      })

      // Delete voice lines 
      if (((cachedDeviceVoiceLine !== '0') ||
        (cachedArrLength > userLinesArr) ||
        (cachedLineOne !== '0' && userLineOne === '0') ||
        (cachedLineTwo !== '0' && userLineTwo === '0')) && !!!selectedServicePlan) {
        try {
          device?.voiceLines?.sort((a, b) => a.lineNumber - b.lineNumber)?.forEach(async v => {
            // line retained
            try {
              if (userLinesArr < 1) {
                await deleteDeviceVoiceLine(inputValues.accountNumber, device?.imei, v.lineNumber)
              } else if (cachedLineOne !== '0' && userLineOne === '0' && v.lineNumber == 1) {
                await deleteDeviceVoiceLine(inputValues.accountNumber, device?.imei, v.lineNumber)
              } else if (cachedLineTwo !== '0' && userLineTwo === '0' && v.lineNumber == 2) {
                await deleteDeviceVoiceLine(inputValues.accountNumber, device?.imei, v.lineNumber)
              }
              //onSuccess("Successfully removed voiceline(s)")
            } catch (error) {
              throw new Error(error)
            }
          })
        } catch (error) {
          console.error(error)
          onFailed("FAILED TO DELETE VOICELINE")
          return false
        }
        // of there is no update to voiceline then return else continue
      }
      // Only create voiceline if none exist, if cachedLines = 2 then Update
      if (((userLinesArr !== 0 && cachedArrLength < 2) &&
        ((cachedLineOne !== userLineOne) ||
          (cachedLineTwo !== userLineTwo)) && vline?.length !== 0)) {
        try {
          if (cachedLineOne === '0' && cachedLineTwo === '0') {
            await createDeviceVoiceLine(inputValues?.accountNumber, device?.imei, vline)
          }
          else if (cachedLineOne === '0' ||
            ((cachedLineOne !== userLineOne) && !!selectedServicePlan))
            await createDeviceVoiceLine(inputValues?.accountNumber, device?.imei, [vline?.filter(v => v.lineNumber == 1)[0]])
          else if (cachedLineTwo === '0' ||
            ((cachedLineTwo !== userLineTwo) && !!selectedServicePlan))
            await createDeviceVoiceLine(inputValues?.accountNumber, device?.imei, [vline?.filter(v => v.lineNumber == 2)[0]])
          onSuccess('Successfully created voiceline')
        } catch (error) {
          console.error(error)
          onFailed("FAILED TO CREATE VOICELINE")
          return false
        }
      }

      // Update Voice lines
      if (((cachedDeviceVoiceLine !== userUpdatedVoiceLine && cachedArrLength === userLinesArr) &&
        (cachedDeviceVoiceLine !== '0' && userUpdatedVoiceLine !== '0' && cachedArrLength != 0 && userLinesArr != 0)) && !!!selectedServicePlan) {
        try {
          console.log("UPDATE DEVICE VOICELINE")
          // Update deviceVoiceLine
          await updateDeviceVoiceLine(inputValues?.accountNumber, device?.imei, vline)
          onSuccess('Successfully update voiceline')
        } catch (error) {
          console.error(error)
          onFailed("FAILED TO UPDATE VOICELINE")
          return false
        }
      }
    }
    onSuccess('Successfully updated device')
    if (reload || !!!device?.bundle)
      window.location.href = `${PATH_NAME.DEVICE_VIEW}?account=${inputValues?.accountNumber}&id=${device?.imei}`
    else {
      return true
    }

  }


  const handleSelectedServicePlan = async (serviceplanID) => {
    try {
      const servicePlan = await getVoiceLineTemplateUsingDeviceVSID(inputValues?.accountNumber, serviceplanID)
      if (servicePlan?.voiceService && servicePlan?.voiceServiceData?.voiceServiceLines && !(device?.bundleData?.voiceService === servicePlan?.voiceService)) {
        cachedVoiceLineTemplate.current[servicePlan?.voiceService] = servicePlan?.voiceServiceData?.voiceServiceLines
        setSelectedServicePlan(() => servicePlan?.voiceService)
      } else {
        setSelectedServicePlan(() => '')
      }

      if (device?.bundle === serviceplanID) {
        let linetmp = [];
        // CHECK ServicePlan has VoiceService
        if (device?.bundleData?.voiceService) {
          if (device?.voiceLines) {
            linetmp = device?.voiceLines
          }
          updateVoiceLine({ type: VOICELINE.UPDATE, payload: { name: 'line', value: linetmp } })
        }
      }
    } catch (error) {
      console.error(error)
    }

  }

  const onFailed = (errorMessage) => {
    setFailed(true);

    setLoading(false);
    setErrorMessage(errorMessage); // Set errorMessage state
    (() => {
      toast({

        title: errorMessage || 'Failed updating device.',
        status: device ? 'error' : 'warning',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = (s) => {
    setFailed(false);
    setLoading(false);
    (() => {
      toast({
        title: s || 'Successfully update device.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

  const onWarning = (s) => {
    if (trackToast === s) {
      return;
    } else {
      setTrackToast(() => s)
    }
    setFailed(false);
    (() => {
      toast({
        title: s || 'Refresh to reset device settings or Update device required to save settings',
        status: 'warning',
        duration: 15000,
        isClosable: true,
      })
    })()
  }

  // Function to handle on changes
  const handleOnChange = (value, fieldName) => {
    console.log("fieldName", fieldName);
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

  const onChangeIMEI = (e) => {
    if (!numbersOnly(e)) return;
    handleOnChange(e, 'imei')
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
      {errorMessage || "Failed to update device"}
    </Text>
  };

  return (
    <>
      <Flex mb={{ sm: "25px", md: "35px", lg: "unset", xl: "unset" }} mt={{ sm: "unset", md: "50px", lg: "unset" }}>
        <FormControl>
          <Card >
            <Flex direction='column' mb='30px' ms='10px'>
              <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
                {"Device Detail"}<br></br>
              </Text>
            </Flex>
            <Flex direction='column'>
              {/* Service Plan */}
              {deviceId ? <Flex direction='column' mb="20px">
                <FormLabel
                  ms='10px'
                  fontSize='sm'
                  color={textColorPrimary}
                  fontWeight='bold'
                  _hover={{ cursor: "arrow" }}
                >
                  Service Plan
                </FormLabel>
                <Select
                  iconColor={textColorPrimary}
                  textColor={textColorPrimary}
                  fontWeight='500'
                  fontSize='15px'
                  id='bundleID'
                  variant='main'
                  h='44px'
                  maxh='44px'
                  me='20px'
                  placeholder={deviceProfileUnfiltered?.bundles?.filter(v => v.id === inputValues?.bundle)[0]?.bundleName || 'NONE'} // Set value here
                  isDisabled={!!device?.active || !iridiumStatus}
                  onChange={(e) => {
                    updateVoiceLine({ type: VOICELINE.RESET })
                    const selectedValue = e.target.value;
                    console.log("Selected bundle value:", selectedValue);
                    setInputValues(prevState => ({ ...prevState, bundle: selectedValue }))
                    // cache selected voiceservice if exist
                    handleSelectedServicePlan(selectedValue);

                  }}
                >
                  {iridiumStatus && deviceProfile?.bundles ? (
                    <>
                      {deviceProfile.bundles
                        .sort((a, b) => a.bundleName.localeCompare(b.bundleName)) // Sort alphabetically
                        .map((v, i) => {
                          if (v.id !== inputValues?.bundle) {
                            return (
                              <option key={v.id + i} value={v.id} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>
                                {/*console.log(`key: ${i}, v.id: ${v.id}, v.bundleName: ${v.bundleName}`)*/}
                                {v.bundleName}
                              </option>
                            );
                          } else {
                            return null;
                          }

                        })
                      }
                    </>
                  ) : (
                    <option key={generateUUID()} value='noBundle' style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>
                      Please Contact Guardian Support Line
                    </option>
                  )}
                </Select>
              </Flex> : null}
              {/* IMEI and SIM */}
              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* IMEI */}
                <Box>
                  <InputField
                    mb='20px'
                    id='imei'
                    label='IMEI'
                    onChange={(event) => onChangeIMEI(event.target.value)}
                    placeholder={inputValues?.imei || device?.imei}
                    maxLength={15} // Limit input characters
                    readOnly
                    style={{ color: 'gray' }}
                  />
                </Box>
                {/* SIM - Only allow update of SIM if device NOT active, device has NEVER been Activated */}
                <Box>
                  {(!device?.active && !device?.dateActivated && !device?.dateDeactivated) ?
                    <InputField
                      ref={refField}
                      mb='20px'
                      id='sim'
                      label='SIM'
                      onChange={(event) => {
                        if (numbersOnly(event.target.value))
                          handleOnChange(event.target.value, 'sim')
                      }}
                      placeholder={'subscriber identity module'}
                      value={!!inputValues?.sim ? inputValues?.sim : undefined}
                      maxLength={19} // Limit input characters
                    />
                    :
                    <InputField
                      ref={refField}
                      mb='20px'
                      id='sim'
                      label='SIM'
                      placeholder={inputValues?.sim || device?.sim}
                      style={{ color: 'gray' }}
                      readOnly={!!device?.active}
                    />
                  }
                </Box>
              </SimpleGrid>
              {/* IMSI and ESN */}
              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* ESN */}
                <Box>
                  <InputField
                    mb='20px'
                    id='serialNumber'
                    label='ESN'
                    maxLength={50} // Limit input characters
                    placeholder={'serial number'}
                    value={(!!inputValues?.esn) ? inputValues?.esn : ''}
                    onChange={(event) => handleOnChange(event.target.value, 'esn')}
                    readOnly={!!device?.active}
                    onClick={() => { if (!!device?.active) onWarning('Cannot update ESN on an active device.') }}
                  />
                </Box>
                {/* IMSI */}
                <Box>
                  <InputField
                    mb='20px'
                    id='imsi'
                    label='IMSI'
                    placeholder={inputValues?.imsi}
                    style={{ color: 'gray' }}
                    readOnly
                  />
                </Box>
              </SimpleGrid>
              {/* Model and Market Type */}
              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* Model */}
                <Box>
                  <InputField
                    mb='20px'
                    id='modelType'
                    label='Model'
                    placeholder={inputValues?.model}
                    readOnly
                    style={{ color: 'gray' }}
                  />
                </Box>
                {/* Market Type */}
                <Box>
                  <InputField
                    mb='20px'
                    id='marketType'
                    label='Market Type'
                    placeholder={inputValues?.marketType}
                    readOnly
                    style={{ color: 'gray' }}
                  />
                </Box>
              </SimpleGrid>
              {/* Tail Number and Identifier */}
              <SimpleGrid
                mb='0px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* Tail Number */}
                {(device?.marketType === 'Certus Aviation') || (device?.submarketID === '11567457074') || deviceProfile?.submarket.id === '11567457074' ?
                  <Box>
                    <InputField
                      mb='20px'
                      id='tailNumber'
                      label='Tail Number*'
                      placeholder={'tail number'}
                      value={(!!inputValues?.tailNumber) ? inputValues?.tailNumber : ''}
                      onChange={(e) => handleOnChange(e.target.value, 'tailNumber')}
                      maxLength={10}
                      readOnly={!!device?.active}
                      onClick={() => { if (!!device?.active) onWarning('Cannot update tail number on an active device.') }}
                    />
                  </Box>
                  : null}
                {/* Identifier */}
                <Box>
                  <InputField
                    mb='20px'
                    id='identifier'
                    label='Identifier / Alias*'
                    value={!!inputValues?.identifier ? inputValues?.identifier : ''}
                    placeholder={'identifier'}
                    onChange={(e) => handleOnChange(e.target.value, 'identifier')}
                    maxLength={50}
                  />
                </Box>
              </SimpleGrid>
              {/* IP Range */}
              {inputValues?.ipRangeID ? <Flex direction='column' mb="0px">
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
                  id='ipRangeID'
                  variant='main'
                  h='44px'
                  maxh='44px'
                  me='20px'
                  isDisabled={!!device?.active || !iridiumStatus}
                  //value={deviceProfile?.ipRanges?.filter(v => v.id === device?.ipRangeID)[0]?.name} // Set value here
                  placeholder={inputValues?.ipName || deviceProfile?.ipRanges?.filter(v => v.id === device?.ipRangeID)[0]?.name}
                  onChange={(e) => {
                    const ipValue = e.target.value.split(';')
                    setInputValues(prevState => ({ ...prevState, ipRangeID: parseInt(ipValue[0]), ipName: ipValue[1] }))
                  }
                  } // Handle onChange event    
                >
                  <>{deviceProfile?.ipRanges.map((v, i) => {
                    if (v.id !== inputValues?.ipRangeID)
                      return (
                        <option
                          key={i + v.id}
                          value={v.id + ';' + v.name}
                          fontSize='15px'
                          style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>
                          {v.name}
                        </option>
                      )
                  })
                  }</>
                </Select>
              </Flex> : null}
              {/* Activation and Deactivation Date */}
              <SimpleGrid
                mb='0px'
                mt='20px'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: "20px", xl: "20px" }}>
                {/* Activation Date */}
                {device?.dateActivated ?
                  <InputField
                    mb='20px'
                    id='activatedDate'
                    label='Date Activated'
                    placeholder={device?.dateActivated}
                    readOnly
                    style={{ color: 'gray' }}
                  /> : null}
                {/* Deactivation Date if any */}
                {device?.dateDeactivated ?
                  <InputField
                    mb='20px'
                    fontSize="sm"
                    id='dateDeactivated'
                    label='Deactivation Date'
                    placeholder={device?.dateDeactivated || 'Leave Blank for End of Plan on Deactivation'}
                    readOnly
                    style={{ color: 'gray' }}
                  />
                  : null}
              </SimpleGrid>
              {/* Additional Info */}
              <SimpleGrid
                mb='20px'
                spacing={{ base: "20px", xl: "20px" }}>
                <TextField
                  h="80px"
                  mb="0px"
                  id="Description"
                  placeholder="Device notes..."
                  label="Description"
                  value={!!inputValues?.additionalInfo ? inputValues?.additionalInfo : undefined}
                  onChange={(e) => setInputValues(prev => ({ ...prev, additionalInfo: e.target.value }))}
                />
              </SimpleGrid>
              {/* Save button */}
              <ShowText errorMessage={errorMessage} />
              {(accountInfo.current?.isGuardianAdmin || accountInfo.current?.isCertusProvisioning) ? (
                <Button
                  isDisabled={!iridiumStatus}
                  isLoading={loading}
                  width='100%'
                  variant='brand'
                  color='white'
                  fontSize='sm'
                  fontWeight='500'
                  _hover={{ bg: "brand.600" }}
                  _active={{ bg: "brand.500" }}
                  _focus={{ bg: "brand.500" }}
                  onClick={handleUpdateDevice}
                >
                  {"Update Device"}
                </Button>
              ) : null}
            </Flex>
          </Card>
        </FormControl>
      </Flex>
      {/* Column Right */}
      <Flex direction='column'>
        {!device?.active && device?.bundle && (
          <Activation
            iridiumStatus={iridiumStatus}
            imei={deviceId}
            accountNumber={account}
            setActive={deviceStatusRef?.current}
            updateLines={handleUpdateDevice}
            state={{
              status: device?.active,
              cancelStatus: cancel,
              activationDate: device?.dateActivated
            }}
          />
        )}
        {(device?.active && (accountInfo.current?.isGuardianAdmin || accountInfo.current?.isCertusProvisioning)) && (
          <Deactivation
            iridiumStatus={iridiumStatus}
            imei={deviceId}
            accountNumber={account}
            setActive={deviceStatusRef?.current}
            state={{
              status: device?.active,
              scheduleTime: scheduleTime,
              cancelStatus: cancel,
              activationDate: device?.dateActivated
            }}
          />
        )}

        {/* check here for Device voiceLine otherwise output Voiceline Template from attached voiceService on Bundle */}
        {/* true here means voiceservice exist on Device's serviceplan */}
        {device?.bundle === inputValues?.bundle && device?.bundleData?.voiceService ?
          // Check to if device has voiceline settings -- this is from device and loaded on to voiceLine.line
          device?.voiceLines ?
            (() => {
              const deviceActiveLine = device?.voiceLines?.sort((a, b) => a.lineNumber - b.lineNumber)[0]?.lineNumber
              const templateVoiceLine = device?.bundleData?.voiceServiceData?.voiceServiceLines?.sort((a, b) => a.lineNumber - b.lineNumber)
                .filter(v => v.lineNumber != deviceActiveLine)[0]
              return (<>{
                device?.voiceLines?.sort((a, b) => a.lineNumber - b.lineNumber).map((v) => {
                  if (voiceLine?.line?.filter(l => l.lineNumber == v.lineNumber)[0]?.device)
                    return <VoiceLine
                      key={generateUUID()}
                      active={device?.active ?? false}
                      voiceLineInfo={v}
                      updateVoiceLine={updateVoiceLine}
                    >
                      {!!!device?.active && <Box position="absolute" top="5" right="5" fontWeight="bold">
                        <FaXmark
                          color={textColorPrimary}
                          size='30'
                          title="Remove Device's Voice Line"
                          style={{
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            console.log("REMOVE LINE FROM DEVICE X-Mark")
                            onWarning();
                            updateVoiceLine({ type: VOICELINE.REMOVELINE, payload: { value: v.lineNumber } })
                          }
                          }
                        />
                      </Box>}
                    </VoiceLine>
                  else {
                    const removedDeviceLine = v.lineNumber
                    const templateVoiceLine = device?.bundleData?.voiceServiceData?.voiceServiceLines?.filter(i => i.lineNumber == removedDeviceLine)[0]
                    return !!device?.active ? <VoiceLine
                      key={generateUUID()}
                      active={device?.active}
                      voiceLineInfo={templateVoiceLine}
                      updateVoiceLine={updateVoiceLine}
                      template={!!!voiceLine?.line?.filter(v => v.lineNumber == templateVoiceLine.lineNumber)[0]}
                    >
                      {!!!voiceLine?.line?.filter(v => v.lineNumber == templateVoiceLine.lineNumber)[0] && !!!device?.active ? <FaPlus
                        color={textColorPrimary}
                        size='100'
                        style={{
                          cursor: 'pointer',
                          position: 'absolute', /* Positions the icon absolutely within the card */
                          top: '50%', /* Center vertically */
                          left: '50%', /* Center horizontally */
                          transform: 'translate(-50%, -50%)', /* Adjust position to center the icon */
                          'zIndex': '3'
                        }}
                        title="Add Voice Line"
                        onClick={() => {
                          if (deviceProfile?.model.voiceQuality === 'HIGH_ONLY' && !(templateVoiceLine?.lineQuality === 'HIGH')) {
                            onWarning("Cannot add voiceline to device with HIGH ONLY voice quality.")
                          } else {
                            onWarning("Refresh to reset device setting's or Update Device to apply new Voiceline Template settings");
                            updateVoiceLine({ type: VOICELINE.ADDLINE, payload: { line: templateVoiceLine } })
                          }
                        }}
                      />
                        :
                        !!!device?.active && <Box position="absolute" top="5" right="5" fontWeight="bold">
                          <FaMinus
                            color={textColorPrimary}
                            size='20'
                            title="Remove Voice Line Template"
                            style={{
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              onWarning("Refresh to reset device setting's or Update Device to apply new Voiceline Template settings");
                              updateVoiceLine({ type: VOICELINE.REMOVELINE, payload: { value: templateVoiceLine?.lineNumber } })
                            }
                            }
                          />
                        </Box>
                      }
                    </VoiceLine> :
                      null
                  }
                })}
                {!!!device?.active && device?.voiceLines?.length <= 1 && templateVoiceLine ?
                  <VoiceLine
                    key={generateUUID()}
                    active={device?.active}
                    voiceLineInfo={templateVoiceLine}
                    updateVoiceLine={updateVoiceLine}
                    template={!!!voiceLine?.line?.filter(v => v.lineNumber == templateVoiceLine.lineNumber)[0]}
                  >
                    {!!!voiceLine?.line?.filter(v => v.lineNumber == templateVoiceLine.lineNumber)[0] ? <FaPlus
                      color={textColorPrimary}
                      size='100'
                      style={{
                        cursor: 'pointer',
                        position: 'absolute', /* Positions the icon absolutely within the card */
                        top: '50%', /* Center vertically */
                        left: '50%', /* Center horizontally */
                        transform: 'translate(-50%, -50%)', /* Adjust position to center the icon */
                        'zIndex': '3'
                      }}
                      title="Add Voice Line"
                      onClick={() => {
                        if (!!!device?.active) {
                          if (deviceProfile?.model.voiceQuality === VOICELINE.HIGHONLY && !(templateVoiceLine?.lineQuality === VOICELINE.HIGH)) {
                            onWarning("Cannot add voiceline to device with HIGH ONLY voice quality.")
                          } else {
                            onWarning("Update device to save line settings.");
                            updateVoiceLine({ type: VOICELINE.ADDLINE, payload: { line: templateVoiceLine } })
                          }
                        } else {
                          onWarning("Cannot add voiceline to an active devices.");
                        }
                      }}
                    />
                      :
                      !!!device?.active && <Box position="absolute" top="5" right="5" fontWeight="bold">
                        <FaMinus
                          color={textColorPrimary}
                          size='20'
                          title="Remove Voice Line Template"
                          style={{
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            onWarning("Update device to save line settings.");
                            updateVoiceLine({ type: VOICELINE.REMOVELINE, payload: { value: templateVoiceLine?.lineNumber } })
                          }
                          }
                        />
                      </Box>
                    }
                  </VoiceLine>
                  : null
                }
              </>)
            })()
            :
            // voiceLine template from VoiceService
            !!!device?.active && device?.bundleData?.voiceServiceData?.voiceServiceLines?.sort((a, b) => a.lineNumber - b.lineNumber)
              ?.map((v, i) => {
                console.log("VOICELINES UP", { voiceline: voiceLine?.line[i]?.lineNumber, line: v?.lineNumber })
                if (i < 2 && v?.lineNumber !== device?.voiceLines?.sort((a, b) => a.lineNumber - b.lineNumber)[0]?.lineNumber)
                  return <VoiceLine
                    key={generateUUID()}
                    active={device?.active}
                    voiceLineInfo={v}
                    updateVoiceLine={updateVoiceLine}
                    template={!(voiceLine?.line?.filter(i => i.lineNumber == v.lineNumber)[0])}
                  >
                    {!(voiceLine?.line?.filter(i => i.lineNumber == v.lineNumber)[0]) ? <FaPlus
                      color={textColorPrimary}
                      size='100'
                      style={{
                        cursor: 'pointer',
                        position: 'absolute', /* Positions the icon absolutely within the card */
                        top: '50%', /* Center vertically */
                        left: '50%', /* Center horizontally */
                        transform: 'translate(-50%, -50%)', /* Adjust position to center the icon */
                        'zIndex': '3'
                      }}
                      title="Add Voice Line Template"
                      onClick={() => {
                        if (deviceProfile?.model.voiceQuality === VOICELINE.HIGHONLY && !(v?.lineQuality === VOICELINE.HIGH)) {
                          onWarning("Cannot add voiceline to device with HIGH ONLY voice quality.")
                        } else {
                          if (!!!device?.active)
                            updateVoiceLine({ type: VOICELINE.ADDLINE, payload: { line: v } })
                          else
                            onWarning("Cannot add voiceline to an active devices.")
                        }
                      }}
                    />
                      :
                      !!!device?.active && <Box position="absolute" top="5" right="5" fontWeight="bold">
                        <FaMinus
                          color={textColorPrimary}
                          size='20'
                          title="Remove Voice Line Template"
                          style={{
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            updateVoiceLine({ type: VOICELINE.REMOVELINE, payload: { value: v.lineNumber } })
                          }
                          }
                        />
                      </Box>
                    }
                  </VoiceLine>
                else
                  return null // Only display 2 voiceline template
              })
          :
          // handle Dynamically pull service plans with Voice services to apply to device on Update
          !!!device?.active && cachedVoiceLineTemplate.current[selectedServicePlan]?.sort((a, b) => a.lineNumber - b.lineNumber)
            ?.map((v, i) => {
              if (i < 2)
                return <VoiceLine
                  key={generateUUID()}
                  active={device?.active}
                  voiceLineInfo={v}
                  updateVoiceLine={updateVoiceLine}
                  template={!(voiceLine?.line?.filter(i => i.lineNumber == v.lineNumber)[0])}
                >
                  {!(voiceLine?.line?.filter(i => i.lineNumber == v.lineNumber)[0]) ? <FaPlus
                    color={textColorPrimary}
                    size='100'
                    style={{
                      cursor: 'pointer',
                      position: 'absolute', // Positions the icon absolutely within the card 
                      top: '50%', // Center vertically 
                      left: '50%',// Center horizontally 
                      transform: 'translate(-50%, -50%)', //Adjust position to center the icon 
                      'zIndex': '3'
                    }}
                    title="Add Voice Line Template"
                    onClick={() => {
                      if (deviceProfile?.model.voiceQuality === 'HIGH_ONLY' && !(v?.lineQuality === 'HIGH')) {
                        onWarning("Cannot add voiceline to device with HIGH ONLY voice quality.")
                      } else {
                        if (!!!device?.active)
                          updateVoiceLine({ type: VOICELINE.ADDLINE, payload: { line: v } })
                        else
                          onWarning("Cannot add voiceline to an active devices.")
                      }

                    }}
                  />
                    :
                    !!!device?.active ? <Box position="absolute" top="5" right="5" fontWeight="bold">
                      <FaMinus
                        color={textColorPrimary}
                        size='20'
                        title="Remove Voice Line Template"
                        style={{
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          updateVoiceLine({ type: VOICELINE.REMOVELINE, payload: { value: v.lineNumber } })
                        }
                        }
                      />
                    </Box> : null
                  }
                </VoiceLine>
              else
                return null // Only display 2 voiceline template
            })
        }
        {(!device?.active && (accountInfo.current?.isGuardianAdmin || accountInfo.current?.isCertusProvisioning)) && (
          <Delete imei={deviceId} accountNumber={account} iridiumStatus={iridiumStatus} />
        )}
      </Flex>
    </>
  );
}
