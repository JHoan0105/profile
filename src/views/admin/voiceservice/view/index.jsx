/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports

import getVoiceServiceListById from 'services/voiceServiceTemplate/getVoiceServiceListById.js';
import getAccountInfo from 'services/account/getAccountInfo';
import { PATH_NAME, LINE } from 'variables/constants'

import View from "views/admin/voiceservice/view/components/view";
import Delete from "views/admin/voiceservice/view/components/delete";
import Assign from "views/admin/voiceservice/view/components/assign";
import VoiceLineCard from './components/VoiceLine'
import EmptyCard from './components/EmptyCard'

import { FaPlus, FaMinus } from 'react-icons/fa';

// Chakra imports
import { Box, Flex, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import React, { useReducer, useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation hook

export const VOICESERVICE = {
  UPDATE: 'UPDATE',
  UPDATEFIELD: 'UPDATEFIELD',
  RESET: 'RESET',
  REMOVE: 'REMOVE',
  ADD: 'ADD',
  ADDLINE: 'ADDLINE',
  REMOVELINE: 'REMOVELINE',
  UPDATELINE: 'UPDATELINE',
  UPDATELINEFIELD: 'UPDATELINEFIELD'
}

const vService = {
  "id": "",
  "name": "",
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
  "twoStageAccessFee": "",
  "numberVoiceLine": 0,
  "voiceLineTemplates": [
  ]
}

const dispatchVoiceService = (vService, action) => {
  console.log("DISPATCH CALLED")
  console.log("Number of Voice Line", vService?.numberVoiceLine)
  console.log("Number of VoiceLines arrlength", vService?.voiceLineTemplates?.length)
  console.log("VOICE LINES DETAILS", { ...vService?.voiceLineTemplates })
  let vLineTemplateNumber = {};
  let removedOldVLineTemplateNumber = [];
  let vline = {};
  switch (action.type) {
    case VOICESERVICE.RESET:
      return
    case VOICESERVICE.UPDATE:
      console.log('UPDATE VOICESERVICE', action.payload.voiceService)
      return action.payload.voiceService
    case VOICESERVICE.UPDATEFIELD:
      console.log('UPDATE FIELD VOICESERVICE', { [action.payload.name]: action.payload.value })
      return { ...vService, [action.payload.name]: action.payload.value }

    case VOICESERVICE.REMOVE:
      return

    case VOICESERVICE.ADD:
      console.log("ON START VOICESERVICE", action.payload.voiceService)
      return { ...action.payload.voiceService }

    case VOICESERVICE.ADDLINE:
      const voiceLineTemp = [];
     
      const numberOfLines = vService?.voiceLineTemplates?.length
      if ((numberOfLines < vService.numberVoiceLine) || (numberOfLines === 0)) {
        voiceLineTemp.push({
          "id": "",
          "name": "",
          "voiceServiceTemplate": "",
          "enableVoiceMail": true,
          "lineNumber": numberOfLines + 1,
          "lineQuality": LINE.HIGH,
          "lineType": LINE.POSTPAID,
          "localCountry": "12856426732", // Canada
          enableLocalNumber: true,
          enableTwoStage: true,
          primarySafety: false,
          maritimeSafety: false,
        })
      }
      let newVService;
      if (vService.voiceLineTemplates) {
        newVService = { ...vService, numberVoiceLine: vService.numberVoiceLine++, voiceLineTemplates: [...vService.voiceLineTemplates, ...voiceLineTemp].sort((a, b) => a.lineNumber - b.lineNumber) }
      } else {
        newVService = { ...vService, numberVoiceLine: vService.numberVoiceLine++, voiceLineTemplates: [...voiceLineTemp] }
      }
      console.log("NUMBER OF VOICELINE TEMPLATES", voiceLineTemp.length)
      return newVService

    case VOICESERVICE.REMOVELINE:
      console.log("REMOVE LINE NUMBER", action.payload.value)
      removedOldVLineTemplateNumber = vService.voiceLineTemplates?.filter(v => v.lineNumber !== action.payload.value).sort((a, b) => a.lineNumber - b.lineNumber)
      console.log("BEFORE UPDATE REMOVE LINE", removedOldVLineTemplateNumber)
      const tmp = removedOldVLineTemplateNumber.map((v, i) => {
        return { ...v, lineNumber: i + 1 }
      })
      console.log("AFTER UPDATE REMOVE LINE", tmp)

      return { ...vService, numberVoiceLine: vService.numberVoiceLine--, voiceLineTemplates: tmp }

    case VOICESERVICE.UPDATELINE:
      // without original
      removedOldVLineTemplateNumber = vService.voiceLineTemplates.filter(v => v.lineNumber !== action.payload.lineNumber);
      console.log("UPDATE LINE", action.payload.voiceLine)
      console.log('remove OLD LINE NUMBER', removedOldVLineTemplateNumber)
      console.log('SORT LINE NUMBER', [...removedOldVLineTemplateNumber, action.payload.voiceLine].sort((a, b) => a.lineNumber - b.lineNumber))
      return { ...vService, voiceLineTemplates: [...removedOldVLineTemplateNumber, action.payload.voiceLine].sort((a, b) => a.lineNumber - b.lineNumber) }

    case VOICESERVICE.UPDATELINEFIELD:
      console.log('ACTION', action)
      console.log('vSERVICE', vService?.voiceLineTemplates)
      vLineTemplateNumber = vService?.voiceLineTemplates?.find(v => v.lineNumber === action.payload.lineNumber)
      console.log("ORIGINAL", vLineTemplateNumber)

      removedOldVLineTemplateNumber = vService?.voiceLineTemplates?.filter(v => v.lineNumber !== action.payload.lineNumber)
      vline = { ...vLineTemplateNumber, [action.payload.name]: action.payload.value }
      console.log('SORT LINE NUMBER', [...removedOldVLineTemplateNumber, vline].sort((a, b) => a.lineNumber - b.lineNumber))

      return { ...vService, voiceLineTemplates: [...removedOldVLineTemplateNumber, vline].sort((a, b) => a.lineNumber - b.lineNumber) }

    default:
      console.log("DISPATCH DEFAULT")
      return vService
  }
}


// Default function
export default function VoiceSettings() {

  const accountInfo = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;
  //et the URL search parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nav = useNavigate();

  const vServiceId = searchParams.get("id");                                                            // retrieve the voice service data from param. if null it is Create

  const isCreateVoiceService = vServiceId ? false : true;                                               // page state - Create or View/update

  const [voiceService, updateVoiceService] = useReducer(dispatchVoiceService, vService)

  const [lineCount, setLineCount] = useState(0)                                                         // Track number of voicelines added and removed

  const textColorPrimary = useColorModeValue("black", "white");

  useEffect(() => {

    // CHECK voiceServiceId
    if (vServiceId) {
      const fetchData = async () => {
        try {
          // update with call to fetch voice service
          const voiceService = await getVoiceServiceListById(vServiceId);
          updateVoiceService({ type: VOICESERVICE.ADD, payload: { voiceService: ({ ...voiceService, numberVoiceLine: voiceService?.voiceLineTemplates?.length ?? 0 }) } })
          if (!voiceService?.voiceLineTemplates) {
            updateVoiceService({ type: VOICESERVICE.UPDATEFIELD, payload: {voiceLineTemplates: []}})
          }
          setLineCount(() => voiceService?.voiceLineTemplates?.length || 0)
          if (!voiceService) {
            nav(PATH_NAME.VOICE_SERVICE)
          }
          console.log('VoiceService variable', voiceService)
        } catch (error) {
          console.error("Error fetching account data:", error);
          if (error?.toString() === 'Error: token expired') {
            nav('/')
          }
        }
      }
      fetchData();

      updateVoiceService({ type: VOICESERVICE.UPDATEFIELD, payload: { name: 'numberVoiceLine', value: voiceService?.voiceLineTemplates?.length ?? 0 } })
      setLineCount(() => voiceService?.voiceLineTemplates?.length ?? 0)
    } else {
      // need to reset template here
      setLineCount(() => 0)
    }

  }, [vServiceId])

  // make sure lineCount and numberVoiceline is equal or re-render
  useEffect(() => {
    console.log("UPDATE VOICE LINE COUNT - numberVoiceLine", lineCount)
    if (lineCount < 0) {
      setLineCount(() => voiceService.numberVoiceLine)
    }
    if (!voiceService.voiceLineTemplates)
      updateVoiceService({ type: VOICESERVICE.UPDATEFIELD, payload: { name: 'numberVoiceLine', value: lineCount } })
    if (voiceService?.voiceLineTemplates?.length < lineCount) {
      updateVoiceService({ type: VOICESERVICE.ADDLINE })
    }
  }, [lineCount, voiceService.numberVoiceLine])

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} h="max-content">
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2, lg: 2, xl: 2, "2xl": 2 }}
        minChildWidth={{ base: "100%", md: "100%", lg: "700px", xl: "700px" }} // Minimum width for columns
        spacing={{ base: "20px", xl: "20px" }}>
        {/* Column Left */}
        <Flex direction='column'>
          <View voiceServiceId={voiceService} updateVoiceServiceTemplate={updateVoiceService} isCreate={isCreateVoiceService} />
        </Flex>
        {/* Column Right */}
        <Flex direction='column'>
          {// Voice Line 1
            !voiceService.voiceLineTemplates || (!voiceService.voiceLineTemplates?.filter((i) => i.lineNumber === 1)[0] && lineCount < 1) ?
              <EmptyCard>
                <FaPlus
                  color={textColorPrimary}
                  size='100'
                  style={{
                    cursor: 'pointer',
                  }}
                  title="Add Voice Line"
                  onClick={() => {
                    updateVoiceService({ type: VOICESERVICE.ADDLINE })
                    updateVoiceService({
                      type: VOICESERVICE.UPDATEFIELD, payload: {
                        name: 'numberVoiceLine',
                        value: 1
                      }
                    })
                    setLineCount((e) => ++e)
                  }
                  }
                />
              </EmptyCard>
              :
              <VoiceLineCard voiceLineInfo={voiceService.voiceLineTemplates?.filter((i) => i.lineNumber === 1)[0]}
                updateVoiceService={updateVoiceService} isCreate={isCreateVoiceService} >
                <Box position="absolute" top="5" right="5" fontWeight="bold">
                  <FaMinus
                    color={textColorPrimary}
                    size='20'
                    title="Remove Voice Line"
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={() => {

                      updateVoiceService({ type: VOICESERVICE.REMOVELINE, payload: { value: 1 } })
                      updateVoiceService({
                        type: VOICESERVICE.UPDATEFIELD, payload: {
                          name: 'numberVoiceLine',
                          value: 1
                        }
                      })
                      setLineCount(e => --e)
                    }
                    }
                  />
                </Box>
              </VoiceLineCard>
          }
          {// Voice Line 2
            !voiceService.voiceLineTemplates || (!voiceService.voiceLineTemplates?.filter((i) => i.lineNumber === 2)[0] && lineCount < 2 )? 
              <EmptyCard>
                <FaPlus
                  color={textColorPrimary}
                  size='100'
                  style={{
                    cursor: 'pointer',
                  }}
                  title="Add Voice Line"
                  onClick={() => {
                    updateVoiceService({ type: VOICESERVICE.ADDLINE })
                    updateVoiceService({
                      type: VOICESERVICE.UPDATEFIELD, payload: {
                        name: 'numberVoiceLine',
                        value: 2
                      }
                    })
                    setLineCount((e) => ++e)
                  }
                  }
                />
              </EmptyCard>
              :
              <VoiceLineCard voiceLineInfo={voiceService.voiceLineTemplates?.filter((i) => i.lineNumber === 2)[0]}
                updateVoiceService={updateVoiceService} isCreate={isCreateVoiceService} >
                <Box position="absolute" top="5" right="5" fontWeight="bold">
                  <FaMinus
                    color={textColorPrimary}
                    size='20'
                    title="Remove Voice Line"
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={() => {

                      updateVoiceService({ type: VOICESERVICE.REMOVELINE, payload: { value: 2 } })
                      updateVoiceService({
                        type: VOICESERVICE.UPDATEFIELD, payload: {
                          name: 'numberVoiceLine',
                          value: 2
                        }
                      })
                      setLineCount(e => --e)
                    }
                    }
                  />
                </Box>
              </VoiceLineCard>
          }
          {// Voice Line 3
            !voiceService.voiceLineTemplates || (!voiceService.voiceLineTemplates?.filter((i) => i.lineNumber === 3)[0] && lineCount < 3) ?
              <EmptyCard>
                <FaPlus
                  color={textColorPrimary}
                  size='100'
                  style={{
                    cursor: 'pointer',
                  }}
                  title="Add Voice Line"
                  onClick={() => {
                    updateVoiceService({ type: VOICESERVICE.ADDLINE })
                    updateVoiceService({
                      type: VOICESERVICE.UPDATEFIELD, payload: {
                        name: 'numberVoiceLine',
                        value: 3
                      }
                    })
                    setLineCount((e) => ++e)
                  }
                  }
                />
              </EmptyCard>
              :
              <VoiceLineCard voiceLineInfo={voiceService.voiceLineTemplates?.filter((i) => i.lineNumber === 3)[0]}
                updateVoiceService={updateVoiceService} isCreate={isCreateVoiceService}>
                <Box position="absolute" top="5" right="5" fontWeight="bold">
                  <FaMinus
                    color={textColorPrimary}
                    size='20'
                    title="Remove Voice Line"
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      updateVoiceService({ type: VOICESERVICE.REMOVELINE, payload: { value: 3 } })
                      updateVoiceService({
                        type: VOICESERVICE.UPDATEFIELD, payload: {
                          name: 'numberVoiceLine',
                          value: 3
                        }
                      })
                      setLineCount(e => --e)
                    }
                    }
                  />
                </Box>
              </VoiceLineCard>
          }
          {!isCreateVoiceService && <Assign voiceServiceId={vServiceId} accountNumber={currentAccountNumber} />}
          {(searchParams && vServiceId) && (<Delete voiceServiceId={vServiceId} accountNumber={currentAccountNumber} />)}
        </Flex>
      </SimpleGrid>
    </Box>
  );
}

