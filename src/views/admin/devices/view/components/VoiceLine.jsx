/* eslint-disable react/jsx-no-duplicate-props */
/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import { formatIridiumPhoneNumber } from 'tools/stringFormat'
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
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";

import LocalNumberCountry from '../variables/LocalNumberCountry.json'
import { VOICELINE } from './view'

import React, { useState, useRef, useEffect } from "react";
import { generateUUID } from 'tools/validators'

// Default function
export default function VoiceLineCard({ voiceLineInfo, updateVoiceLine, template, active, children }) {

  const [userInput, setUserInput] = useState({
    deviceNumber: voiceLineInfo?.deviceNumber,
    lineNumber: voiceLineInfo?.lineNumber,
    enableVoiceMail: voiceLineInfo?.enableVoiceMail,
    lineQuality: voiceLineInfo?.lineQuality || LINE.HIGH,
    lineType: voiceLineInfo?.lineType || LINE.POSTPAID,
    localCountry: voiceLineInfo?.localCountry || '12856426732',
    enableLocalNumber: voiceLineInfo?.enableLocalNumber,
    enableTwoStage: voiceLineInfo?.enableTwoStage || false,
    primarySafety: voiceLineInfo?.primarySafety || voiceLineInfo?.lineType ? voiceLineInfo?.lineType !== LINE.SAFETY ? false : true : true,
    maritimeSafety: voiceLineInfo?.maritimeSafety || voiceLineInfo?.lineType ? voiceLineInfo?.lineType !== LINE.SAFETY ? false : true : true,
    twoStagePin: voiceLineInfo?.twoStagePin
  });

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");
  const optionsBackGroundColor = useColorModeValue('white', 'grey');
  const optionsTextColor = useColorModeValue('black', 'white');
  const twoStageIndex = useRef();

  const [twoStagePin, setTwoStagePin] = useState(['', '', '', '']); // + captain Pin (not required)

  useEffect(() => {
    setTwoStagePin(() => ['', '', '', ''])
  }, [template])

  useEffect(() => {
    console.log("in VOICELINE", voiceLineInfo)
    setUserInput((e) =>
    ({
      ...e,
      deviceNumber: voiceLineInfo?.deviceNumber,
      lineNumber: voiceLineInfo?.lineNumber,
      enableVoiceMail: voiceLineInfo?.enableVoiceMail,
      lineQuality: voiceLineInfo?.lineQuality || LINE.HIGH,
      lineType: voiceLineInfo?.lineType || LINE.POSTPAID,
      localCountry: voiceLineInfo?.localCountry || '12856426732',
      enableLocalNumber: voiceLineInfo?.enableLocalNumber,
      enableTwoStage: voiceLineInfo?.enableTwoStage,
      primarySafety: voiceLineInfo?.primarySafety,
      maritimeSafety: voiceLineInfo?.maritimeSafety,
      twoStagePin: voiceLineInfo?.twoStagePin
    })
    )
    if (voiceLineInfo?.enableTwoStage && voiceLineInfo?.twoStagePin) {
      setTwoStagePin(() => voiceLineInfo?.twoStagePin?.split(''))
    } else {
      setTwoStagePin(() => ['', '', '', ''])
    }
  }, [voiceLineInfo])

  const onChangeUserInput = (key, value) => {
    setUserInput(prevState => ({
      ...prevState,
      [key]: value
    }));
  }
  // Chakra Color Mode
  return (
    <FormControl mb={{ base: "10px", sm: '45px', md: "55px", lg: "15px" }}>
      <Card>
        {children}
        <SimpleGrid style={template ? { opacity: '0.25' } : null}>
          <Flex direction='column' mb='30px' ms='10px' >
            <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
              Voice Line {voiceLineInfo?.lineNumber}
            </Text>
          </Flex>
          <SimpleGrid
            columns={{ sm: 3, md: 3 }}
            spacing={{ base: "20px", xl: "20px" }}>
            <Flex align='center' direction='column' mb="5px"  >
              <FormLabel
                ms='10px'
                fontSize='sm'
                color={textColorPrimary}
                fontWeight='bold'
                _hover={{ cursor: "arrow" }}>
                Quality {/*    */}
                <Text fontWeight='bold' fontSize='sm' color={textColorPrimary} align='center' mb='5px'>
                  {userInput.lineQuality}
                </Text>
              </FormLabel>
            </Flex>
            <Flex align='center' direction='column' mb="5px">
              <FormLabel
                ms='10px'
                fontSize='sm'
                color={textColorPrimary}
                fontWeight='bold'
                _hover={{ cursor: "arrow" }}>
                Type {/*    */}
                <Text fontWeight='bold' fontSize='sm' color={textColorPrimary} align='center' mb='5px'>
                  {userInput.lineType}
                </Text>
              </FormLabel>

            </Flex>
            <Flex align='center' direction='column' mb="5px">
              <FormLabel
                ms='10px'
                fontSize='sm'
                color={textColorPrimary}
                fontWeight='bold'>
                Voicemail
                <Text fontWeight='bold' fontSize='sm' _hover={{ backgroundColor: "brand.400" }}
                  color={userInput.enableVoiceMail ? "green" : "red"} mb='5px' align='center'>
                  {userInput?.enableVoiceMail ? "ON" : "OFF"}
                </Text>
              </FormLabel>
            </Flex>
          </SimpleGrid>
          {(active) ?
            <Flex alignItems='center'>
              <FormLabel
                ms='12px'
                fontSize='sm'
                color={textColorPrimary}
                fontWeight='bold'>
                Iridium Phone Number
              </FormLabel>
              <Text fontWeight='bold' fontSize='sm' color={userInput?.deviceNumber ?textColorPrimary:'red'} mb='8px' >
                {formatIridiumPhoneNumber(userInput?.deviceNumber) ?? 'Please contact Guardian support.'}
              </Text>
            </Flex>
            : null
          }
          <Flex alignItems='center'>
            <FormLabel
              ms='10px'
              fontSize='sm'
              color={textColorPrimary}
              fontWeight='bold'>
              Local Access Number
            </FormLabel>
            {userInput.enableLocalNumber ? < SimpleGrid mb='20px'>
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
                disabled
                value={LocalNumberCountry.find(v => v.ID === userInput.localCountry)?.Name}
                placeholder={LocalNumberCountry.find(v => v.ID === userInput.localCountry)?.Name}
                onChange={(e) => {
                  updateVoiceLine({
                    type: VOICELINE.UPDATE, payload:
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
                    return <option key={i + v.ID + generateUUID()} value={v.ID} fontSize='15px' style={{ backgroundColor: optionsBackGroundColor, color: optionsTextColor }}>
                      {v.Name}
                    </option>
                  })
                }
              </Select>
            </SimpleGrid> :
              <Text fontSize='sm' _hover={{ backgroundColor: "brand.400" }}
                fontWeight='700' color="red" mb='5px'>
                OFF
              </Text>
            }
          </Flex>
          <SimpleGrid mt='10px'>
            <FormControl>
              <Flex alignItems="center" >
                <FormLabel
                  ms='10px'
                  fontSize='sm'
                  color={textColorPrimary}
                  fontWeight='bold'>
                  Two Stage Dialing
                </FormLabel>
                {userInput.enableTwoStage ?
                  < PinInput isDisabled={active} mx='auto' pin value={twoStagePin.join('')} onChange={(value) => {
                    setTwoStagePin(value.split(''));
                    updateVoiceLine({
                      type: VOICELINE.UPDATEFIELD, payload: { lineNumber: voiceLineInfo?.lineNumber, name: 'twoStagePin', value: value }
                    })
                  }}>
                    {[...Array(4)].map((_, index) => (
                      <PinInputField
                        ref={index === 0 ? twoStageIndex : null}
                        key={index}
                        fontSize='15px'
                        color={textColorPrimary} // Replace with your desired text color
                        borderRadius='8px'
                        borderColor='gray.300' // Replace with your desired border color
                        h={{ base: '15px', md: '25px' }}
                        w={{ base: '15px', md: '25px' }}
                        me={index < 4 ? '10px' : '0'}
                      />
                    ))}
                  </PinInput> :
                  <Text fontSize='sm' _hover={{ backgroundColor: "brand.400" }}
                    fontWeight='700' color="red" mb='5px'>
                    OFF
                  </Text>}
              </Flex>
            </FormControl>
          </SimpleGrid>
        </SimpleGrid>
      </Card>
    </FormControl>
  );
}
