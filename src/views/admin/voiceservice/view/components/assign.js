//=========================================================
// Provisioning Portal - v1.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
/* Get voice service assignments */
import getVoiceServiceAssignments from 'services/voiceServiceAssignments/getVoiceServiceAssignments';
import assignVoiceService from 'services/voiceServiceAssignments/assignVoiceService';
import unassignVoiceService from 'services/voiceServiceAssignments/unassignVoiceService';
import { PATH_NAME } from 'variables/constants'


// Chakra imports
import {
  Button,
  Flex,
  Box,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useEffect, useState } from "react";

// Custom components
import SwitchField from "components/fields/SwitchField";
import TagsField from "components/fields/TagsField";

export default function Assignments({ voiceServiceId, accountNumber }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    isGlobalInitialState: false,
    isGlobal: false
  });                                                                                                   // set the initial Global state and user interactive state

  const [accountNumbers, setAccountNumbersData] = useState([]);                                         // initial list of account numbers
  const [selectedTags, setSelectedTags] = useState([]);                                                 // updated list of account numbers
  const [hasAssignments, setHasAssignments] = useState([])                                              // list of assigned accounts with ID (or unassign)
  const [globalSettings, setGlobalSettings] = useState([]);                                             // global settings with ID to delete
  const [initialState, setUpdateInitialState] = useState(false)                                         // track initialState to display save and delete button

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (voiceServiceId) {
          const voiceServiceAssignments = await getVoiceServiceAssignments(voiceServiceId);
          if (!!voiceServiceAssignments) {
            const recordsWithOnlyGlobalSettings = voiceServiceAssignments.filter(item => !item.hasOwnProperty("accountNumber"));
            setGlobalSettings(recordsWithOnlyGlobalSettings);
            setInputValues(prev => ({
              ...prev,
              isGlobal: voiceServiceAssignments.some(record => record.global === true),
              isGlobalInitialState: voiceServiceAssignments.some(record => record.global === true)
            }));
            const recordsWithAccountNumber = voiceServiceAssignments.filter(item => item.hasOwnProperty("accountNumber"));
            const modifiedData = recordsWithAccountNumber.map(item => { return item.accountNumber });     // create list with only account numbers
            setHasAssignments(() => recordsWithAccountNumber)
            modifiedData.sort((a, b) => a - b);
            setSelectedTags(modifiedData);
            setAccountNumbersData(modifiedData);
          } else {
            setInputValues(prev => ({
              ...prev,
              isGlobal: false,
              isGlobalInitialState: false
            }));
            setUpdateInitialState(() => false)
          }
        }
      } catch (error) {
        console.error("Error fetching accounts data:", error);
      }
    };
    fetchData();
  }, [voiceServiceId]);
  useEffect(() => {
    console.log("SELECTED TAGS UPDATE", JSON.stringify(accountNumbers) !== JSON.stringify(selectedTags))
    if (JSON.stringify(accountNumbers) !== JSON.stringify(selectedTags))
      setUpdateInitialState(() => true)
    else
      setUpdateInitialState(() => false)
  }, [accountNumbers, selectedTags])

  const handleCancel = () => {
    setInputValues(prev => ({
      ...prev,
      isGlobal: inputValues.isGlobalInitialState
    }));
    setSelectedTags(accountNumbers);
  }

  const handleSave = async () => {
    if (loading) return;                                        // Prevent multiple clicks
    setLoading(true);
    let updated = false;                                        // refresh the page when true

    // if global state is false then assign account numbers
    if (!inputValues.isGlobalInitialState && !inputValues.isGlobal) {
      try {
        let newAccountNumbers = selectedTags.filter(tag => !accountNumbers.some(acc => acc === tag));
        let removedAccountNumbers = accountNumbers.filter(account => !selectedTags.some(tag => account === tag));
        // assign account numbers that is not on intial list
        if (newAccountNumbers?.length > 0) {
          for (const record of newAccountNumbers) {
            const create = await assignVoiceService(voiceServiceId, false, typeof record==='string'? record: record?.toString());
            if (create) {
              onSuccess(`Successfully assigned account number: ${record}.`);
            } else {
              onFailed(`Failed assigning account number: ${record}.`);
            }
          }
        }
        // remove account numbers that is in the intial list but not in the user set list
        if (removedAccountNumbers?.length > 0) {
          for (const record of removedAccountNumbers) {
            const deleted = await unassignVoiceService(voiceServiceId, hasAssignments.filter(a => a.accountNumber === record)[0].id);
            if (deleted) {
              onSuccess(`Successfully removed account number: ${record}.`);
            } else {
              onFailed(`Failed removing account number: ${record}.`);
            }
          }
        }
      } catch (error) {
        // Error handling
        console.error(error)
      }
      updated = true;
    }
    // if user set Global
    if (inputValues.isGlobal && !inputValues.isGlobalInitialState) {
      try {
        // delete all assignments
        if (selectedTags?.length > 0) {
          hasAssignments?.forEach(async a => {
            await unassignVoiceService(voiceServiceId, a.id);
          })
        }
        // set Global to true
        const create = await assignVoiceService(voiceServiceId, inputValues.isGlobal, accountNumber);;
        if (create) {
          onSuccess(`Successfully setting global to ${inputValues.isGlobal}.`);
        } else {
          onFailed(`Failed setting global to ${inputValues.isGlobal}.`);
        }
      } catch (error) {
        console.error(error)
      }
      updated = true;
    }
    // if user set global false
    if (!inputValues.isGlobal && inputValues.isGlobalInitialState) {
      try {
        // remove global setting
        for (const record of globalSettings) {
          const deleted = await unassignVoiceService(voiceServiceId, record.id);
          if (deleted) {
            onSuccess(`Successfully removed Global setting.`);
          } else {
            onFailed(`Failed to remove Global setting.`);
          }  
        }
        // add any assigned account numbers
        if (selectedTags?.length > 0) {
          for (const record of selectedTags) {
            const create = await assignVoiceService(voiceServiceId, false, typeof (record)==='string'? record: record.toString());
            if (create) {
              onSuccess(`Successfully assigned account number: ${record}.`);
            } else {
              onFailed(`Failed assigning account number: ${record}.`);
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
      updated = true;
    }
    if (updated) {
      setTimeout(() => {
        window.location.href = `${PATH_NAME.VOICE_SERVICE_VIEW}?id=${voiceServiceId}`
      },600)
    }
      
  };

  const handleGlobalToggle = () => {
    setInputValues(prev => ({
      ...prev,
      isGlobal: !prev.isGlobal
    }));
  };

  const handleTagsChange = (updatedTags) => {
    setSelectedTags(updatedTags);
  };


  const onFailed = (message) => {
    setLoading(false);
    toast({
      title: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  };

  const onSuccess = (message) => {
    setLoading(false);
    toast({
      title: message,
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Card minW='680px' mb={{ base: "20px", sm: '50px', md: "60px", lg: "10px", xl:'10px' }}>
      <Flex direction='column' mb='30px' ms='10px'>
        <Text fontSize='lg' color={useColorModeValue("black", "white")} me='6px' fontWeight='700'>
          Template Assignments
        </Text>
      </Flex>
      <Flex direction='column'>
        {inputValues.isGlobal && (
          <Flex justify="space-between" align="center">
            <Box>
              <SwitchField
                reversed={true}
                fontSize='sm'
                mb='20px'
                id='global'
                label='Global'
                defaultChecked={true}
                onClick={handleGlobalToggle}
              />
            </Box>
          </Flex>
        )}
        {!inputValues.isGlobal && (
          <Flex justify="space-between" align="center">
            <Box>
              <SwitchField
                reversed={true}
                fontSize='sm'
                mb='20px'
                id='global'
                label='Global'
                defaultChecked={false}
                onClick={handleGlobalToggle}
              />
            </Box>
          </Flex>
        )}

        {!inputValues.isGlobal && (
            <TagsField
              id='templateAssignment'
              label='Account Numbers'
              mb='0px'
              h='140px'
              s={setSelectedTags}
              selectedTags={selectedTags}
              onChange={handleTagsChange}

            />
        )}
        {(initialState || (inputValues.isGlobalInitialState !== inputValues.isGlobal)) && (
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={{ base: "0px", xl: "20px" }} mt='10px'>
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
              onClick={handleCancel}
            >
              Cancel
            </Button>
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
              onClick={handleSave}
            >
              Save
            </Button>
          </SimpleGrid>
        )}
      </Flex>
    </Card>
  );
}


