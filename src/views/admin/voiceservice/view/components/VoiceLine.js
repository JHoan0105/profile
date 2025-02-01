/* eslint-disable react/jsx-no-duplicate-props */
/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import { LINE } from 'variables/constants'

// Chakra imports
import {
  Flex,
  Select,
  FormControl,
  FormLabel,
  SimpleGrid,
  Text,
  useColorModeValue,
  Button,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";

import LocalNumberCountry from '../../list/variables/LocalNumberCountry.json'
import { VOICESERVICE } from '../index.jsx'

import React, { useState, useEffect } from "react";
import { generateUUID } from 'tools/validators'



// Default function
export default function VoiceLineCard({ voiceLineInfo, updateVoiceService, isCreate, children }) {
  // Get the URL search parameters
  const toast = useToast();

  const [userInput, setUserInput] = useState({
    lineNumber: voiceLineInfo?.lineNumber,
    enableVoiceMail: voiceLineInfo?.enableVoiceMail,
    lineQuality: voiceLineInfo?.lineQuality || LINE.HIGH,
    lineType: voiceLineInfo?.lineType || LINE.POSTPAID,
    localCountry: voiceLineInfo?.localCountry || '12856426732',
    enableLocalNumber: voiceLineInfo?.enableLocalNumber,
    enableTwoStage: voiceLineInfo?.enableTwoStage || true,
    primarySafety: voiceLineInfo?.primarySafety || voiceLineInfo?.lineType ? voiceLineInfo?.lineType !== LINE.SAFETY ? false : true : true,
    maritimeSafety: voiceLineInfo?.maritimeSafety || voiceLineInfo?.lineType ? voiceLineInfo?.lineType !== LINE.SAFETY ? false : true : true
  }); // form inputs

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");
  const optionsBackGroundColor = useColorModeValue('white', 'grey');
  const optionsTextColor = useColorModeValue('black', 'white');

  useEffect(() => {
    console.log("in VOICELINE", voiceLineInfo?.lineNumber, voiceLineInfo)
    setUserInput((e) =>
    ({
      ...e,
      lineNumber: voiceLineInfo?.lineNumber,
      enableVoiceMail: voiceLineInfo?.enableVoiceMail,
      lineQuality: voiceLineInfo?.lineQuality,
      lineType: voiceLineInfo?.lineType,
      localCountry: voiceLineInfo?.localCountry ,
      enableLocalNumber: voiceLineInfo?.enableLocalNumber,
      enableTwoStage: voiceLineInfo?.enableTwoStage ,
      primarySafety: voiceLineInfo?.primarySafety ,
      maritimeSafety: voiceLineInfo?.maritimeSafety 
    })
    )


  }, [voiceLineInfo])

  const onChangeUserInput = (key, value) => {
    setUserInput(prevState => ({
      ...prevState,
      [key]: value
    }));
  }

  const onPostpaidToggle = (k) => {
    if (k === 'enableVoiceMail' && userInput.lineType !== 'POSTPAID') {
      onWarn('Voice mail only available on Postpaid.')
      return null;
    }
    if (userInput.lineType !== 'POSTPAID') {
      onWarn('Service only allowed on Postpaid.')
      return null;
    } else {
      onChangeUserInput(k, !userInput[k])
      updateVoiceService({
        type: VOICESERVICE.UPDATELINEFIELD,
        payload: {
          lineNumber: voiceLineInfo?.lineNumber,
          name: k,
          value: !userInput[k]
        }
      })
    }
  }
  const onSafetyToggle = (k) => {
    if (userInput.lineType !== 'SAFETY') {
      onWarn('Service only allowed on Safety line.')
      return null;
    } else {
      onChangeUserInput(k, !userInput[k])
      updateVoiceService({
        type: VOICESERVICE.UPDATELINEFIELD,
        payload: {
          lineNumber: voiceLineInfo?.lineNumber,
          name: k,
          value: !userInput[k]
        }
      })
    }
  }

  const onWarn = (errorMessage) => {

    (() => {
      toast({
        title: 'Voiceline',
        status: 'warning',
        description: errorMessage,
        duration: 2000,
        isClosable: true,
      })
    })()
  }
  // Chakra Color Mode
  return (
    <FormControl mb={{ base: "20px", sm: '30px', md: "40px", lg: "-10px" }}>
      <Card mt='0px' mb='20px' minW='680px'>
        {children}
        <Flex direction='column' mb='30px' ms='10px'>
          <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
            Voice Line {voiceLineInfo?.lineNumber}
          </Text>
        </Flex>
        <SimpleGrid
          columns={{ sm: 3, md: 3 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <Flex align='center' direction='column' mb="20px"  >
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'
              _hover={{ cursor: "arrow" }}>
              Quality {/*    */}
            </FormLabel>
            <Text fontWeight='bold' color={textColorPrimary} align='center' mt='10px'>
              {userInput.lineQuality}
            </Text>
          </Flex>
          <Flex direction='column' mb="20px">
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'
              _hover={{ cursor: "arrow" }}>
              Type {/*    */}
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
              value={userInput.lineType}
              placeholder={userInput.lineType}
              onChange={(e) => {
                switch (e.target.value) {
                  case LINE.PREPAID:
                    if (userInput.enableLocalNumber) {
                      onChangeUserInput('enableLocalNumber', false)
                    }
                    if (userInput.enableTwoStage) {
                      onChangeUserInput('enableTwoStage', false)
                    }
                    if (userInput.enableVoiceMail) {
                      onChangeUserInput('enableVoiceMail', false)
                    }
                    if (userInput.primarySafety) {
                      onChangeUserInput('primarySafety', false)
                    }
                    if (userInput.maritimeSafety) {
                      onChangeUserInput('maritimeSafety', false)
                    }
                    if (userInput.lineQuality !== LINE.STANDARD)
                      onChangeUserInput('lineQuality', LINE.STANDARD)

                    updateVoiceService({
                      type: VOICESERVICE.UPDATELINE, payload: {
                        lineNumber: voiceLineInfo?.lineNumber,
                        voiceLine: {
                          id: voiceLineInfo?.id,
                          name: voiceLineInfo?.name,
                          localCountry: voiceLineInfo?.localCountry, 
                          lineType: LINE.PREPAID,
                          lineNumber: voiceLineInfo?.lineNumber,
                          voiceServiceTemplate: voiceLineInfo?.voiceServiceTemplate,
                          enableLocalNumber: false,
                          enableTwoStage: false,
                          enableVoiceMail: false,
                          primarySafety: false,
                          maritimeSafety: false,
                          lineQuality: LINE.STANDARD
                        }
                      }
                    })
                    break
                  case LINE.POSTPAID:
                    if (!userInput.enableLocalNumber) {
                      onChangeUserInput('enableLocalNumber', true)
                    }
                    if (!userInput.enableTwoStage) {
                      onChangeUserInput('enableTwoStage', true)
                    }
                    if (!userInput.enableVoiceMail) {
                      onChangeUserInput('enableVoiceMail', true)
                    }
                    if (userInput.primarySafety) {
                      onChangeUserInput('primarySafety', false)
                    }
                    if (userInput.maritimeSafety) {
                      onChangeUserInput('maritimeSafety', false)
                    }
                    if (userInput.lineQuality !== LINE.HIGH)
                      onChangeUserInput('lineQuality', LINE.HIGH)
                    updateVoiceService({
                      type: VOICESERVICE.UPDATELINE, payload: {
                        lineNumber: voiceLineInfo?.lineNumber,
                        voiceLine: {
                          id: voiceLineInfo?.id,
                          name: voiceLineInfo?.name,
                          localCountry: voiceLineInfo?.localCountry, // temp
                          lineType: LINE.POSTPAID,
                          lineNumber: voiceLineInfo?.lineNumber,
                          voiceServiceTemplate: voiceLineInfo?.voiceServiceTemplate,
                          enableLocalNumber: true,
                          enableTwoStage: true,
                          enableVoiceMail: true,
                          primarySafety: false,
                          maritimeSafety: false,
                          lineQuality: LINE.HIGH
                        }
                      }
                    })
                    break
                  case LINE.SAFETY:
                    if (userInput.enableLocalNumber) {
                      onChangeUserInput('enableLocalNumber', false)
                    }
                    if (userInput.enableTwoStage) {
                      onChangeUserInput('enableTwoStage', false)
                    }
                    if (userInput.enableVoiceMail) {
                      onChangeUserInput('enableVoiceMail', false)
                    }
                    if (!userInput.primarySafety) {
                      onChangeUserInput('primarySafety', true)
                    }
                    if (!userInput.maritimeSafety) {
                      onChangeUserInput('maritimeSafety', true)
                    }
                    if (userInput.lineQuality !== 'HIGH')
                      onChangeUserInput('lineQuality', 'HIGH')
                    updateVoiceService({
                      type: VOICESERVICE.UPDATELINE, payload: {
                        lineNumber: voiceLineInfo?.lineNumber,
                        voiceLine: {
                          id: voiceLineInfo?.id,
                          name: voiceLineInfo?.name,
                          localCountry: voiceLineInfo?.localCountry, 
                          lineType: LINE.SAFETY,
                          lineNumber: voiceLineInfo?.lineNumber,
                          voiceServiceTemplate: voiceLineInfo?.voiceServiceTemplate,
                          enableLocalNumber: false,
                          enableTwoStage: false,
                          enableVoiceMail: false,
                          primarySafety: true,
                          maritimeSafety: true,
                          lineQuality: LINE.HIGH
                        }
                      }
                    })
                    break
                  default:
                    // invalid input
                    return 0
                }
                onChangeUserInput('lineType', e.target.value)
              }}
            >
              {
                [LINE.PREPAID, LINE.POSTPAID, LINE.SAFETY].map((v, i) => {
                  if (v === userInput.lineType) return null;
                  return <option key={generateUUID()} value={v} fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>
                    {v}
                  </option>
                }
                )
              }
            </Select>
          </Flex>
          <Flex direction='column' mb="20px">
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'
              _hover={{ cursor: "arrow" }}>
              Local Country ID {/*    */}
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
              value={LocalNumberCountry.find(v => v.ID === userInput.localCountry)?.Name}
              placeholder={LocalNumberCountry.find(v => v.ID === userInput.localCountry)?.Name}
              onChange={(e) => {
                updateVoiceService({
                  type: VOICESERVICE.UPDATELINEFIELD, payload:
                  {
                    lineNumber: voiceLineInfo?.lineNumber, name: 'localCountry', value: e.target.value
                  }
                });
                onChangeUserInput('localCountry', e.target.value)
              }
              }
            >
              {
                LocalNumberCountry.map((v, i) => {
                  if (userInput?.localCountry === v.ID) return null;
                  return <option key={v.ID+i} value={v.ID} fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>
                    {v.Name}
                  </option>
                })
              }
            </Select>
          </Flex>
        </SimpleGrid>
        <SimpleGrid
          columns={{ sm: 5, md: 5 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <Flex direction='column'  mt='21px'>
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'>
              Voicemail
            </FormLabel>
            <Button

              _hover={{ backgroundColor: "brand.400" }}
              px='24px'
              fontSize='sm'
              fontWeight='700'
              backgroundColor={userInput.lineType === 'POSTPAID' && userInput.enableVoiceMail ? "green.500" : "red.500"}
              onClick={() => onPostpaidToggle('enableVoiceMail')}
            >
              {userInput.lineType === 'POSTPAID' && userInput.enableVoiceMail ? "ENABLED " : "DISABLED"}
            </Button>
          </Flex>
          <Flex direction='column' >
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'>
              
              Single Stage
              <br />Dialing
            </FormLabel>
            <Button
              _hover={{ backgroundColor: "brand.400" }}
              px='24px'
              fontSize='sm'
              fontWeight='700'
              backgroundColor={userInput.lineType === 'POSTPAID' && userInput.enableLocalNumber ? "green.500" : "red.500"}
              onClick={() => onPostpaidToggle('enableLocalNumber')}
            >
              {userInput.lineType === 'POSTPAID' && userInput.enableLocalNumber ? "ENABLED " : "DISABLED"}
            </Button>
          </Flex>
          <Flex direction='column'>
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'>
              
              Two Stage <br />Dialing
            </FormLabel>
            <Button
              _hover={{ backgroundColor: "brand.400" }}
              px='24px'
              fontSize='sm'
              fontWeight='700'
              backgroundColor={userInput.lineType === 'POSTPAID' && userInput.enableTwoStage ? "green.500" : "red.500"}
              onClick={() => onPostpaidToggle('enableTwoStage')}
            >
              {userInput.lineType === 'POSTPAID' && userInput.enableTwoStage ? "ENABLED " : "DISABLED"}
            </Button>
          </Flex>
          <Flex direction='column'>
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'>
              
              Primary <br /> Safety
            </FormLabel>
            <Button
              _hover={{ backgroundColor: "brand.400" }}
              px='24px'
              fontSize='sm'
              fontWeight='700'
              backgroundColor={userInput.lineType === 'SAFETY' && userInput.primarySafety ? "green.500" : "red.500"}
              onClick={() => onSafetyToggle('primarySafety')}
            >
              {userInput.lineType === 'SAFETY' && userInput.primarySafety ? "ENABLED " : "DISABLED"}
            </Button>
          </Flex>
          <Flex direction='column'>
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'>
              
              Maritime<br /> Safety
            </FormLabel>
            <Button
              _hover={{ backgroundColor: "brand.400" }}
              px='24px'
              fontSize='sm'
              fontWeight='700'
              backgroundColor={userInput.lineType === 'SAFETY' && userInput.maritimeSafety ? "green.500" : "red.500"}
              onClick={() => onSafetyToggle('maritimeSafety')}
            >
              {userInput.lineType === 'SAFETY' && userInput.maritimeSafety ? "ENABLED " : "DISABLED"}
            </Button>
          </Flex>
        </SimpleGrid>
      </Card>
    </FormControl>
  );
}
