//=========================================================
// Provisioning Portal - v2.0.2
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import getDataServiceAssignments from 'services/dataservicetemplateassignment/getDataServiceAssignments';
import createDataServiceAssignment from 'services/dataservicetemplateassignment/createDataServiceAssignment';
import deleteDataServiceAssignment from 'services/dataservicetemplateassignment/deleteDataServiceAssignment';

import { PATH_NAME} from 'variables/constants'

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

export default function Assignments({ dataServiceId, accountNumber }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    isGlobalInitialState: false,
    isGlobal: false
  });

  const [accountNumbers, setAccountNumbersData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [hasAssignments, setHasAssignments] = useState([])
  const [globalSettings, setGlobalSettings] = useState([]);
  const [initialState, setUpdateInitialState] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dataServiceId) {
          const dataServiceAssignments = await getDataServiceAssignments(dataServiceId);
          if (dataServiceAssignments) {
            const recordsWithOnlyGlobalSettings = dataServiceAssignments.filter(item => !item.hasOwnProperty("accountNumber"));
            setGlobalSettings(recordsWithOnlyGlobalSettings);
            setInputValues(prev => ({
              ...prev,
              isGlobal: dataServiceAssignments.some(record => record.global === true),
              isGlobalInitialState: dataServiceAssignments.some(record => record.global === true)
            }));
            const recordsWithAccountNumber = dataServiceAssignments.filter(item => item.hasOwnProperty("accountNumber"));
            setHasAssignments(() => recordsWithAccountNumber)
            const modifiedData = recordsWithAccountNumber.map(item => { return item.accountNumber });
            modifiedData.sort((a, b) => a - b);
            setSelectedTags(modifiedData);
            setAccountNumbersData(modifiedData);
          }
        }
      } catch (error) {
        console.error("Error fetching accounts data:", error);
      }
    };
    fetchData();
  }, [dataServiceId]);

  useEffect(() => {
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
    setLoading(true);
    let updated = false;
    if (!inputValues.isGlobalInitialState && !inputValues.isGlobal) {
      try {
        let newAccountNumbers = selectedTags.filter(tag => !accountNumbers.some(acc => acc === tag));
        let removedAccountNumbers = accountNumbers.filter(account => !selectedTags.some(tag => account === tag));
        if (newAccountNumbers?.length > 0) {
          for (const record of newAccountNumbers) {
            const create = await createDataServiceAssignment(dataServiceId, false, typeof (record) === 'string'? record: record.toString());
            if (create) {
              onSuccess(`Successfully assigned account number: ${record}.`);
            } else {
              onFailed(`Failed assigning account number: ${record}.`);
            }
          }
        }
        if (removedAccountNumbers?.length > 0) {
          for (const record of removedAccountNumbers) {
            const deleted = await deleteDataServiceAssignment(dataServiceId, hasAssignments.filter(a => a.accountNumber === record)[0].id);
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
    if (inputValues.isGlobal && !inputValues.isGlobalInitialState) {
      try {
        if (selectedTags?.length > 0) {
          hasAssignments?.forEach(async a => {
            await deleteDataServiceAssignment(dataServiceId, a.id);
          })
        }
        const create = await createDataServiceAssignment(dataServiceId, inputValues.isGlobal, accountNumber);;
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
    if (!inputValues.isGlobal && inputValues.isGlobalInitialState) {
      try {
        for (const record of globalSettings) {
          const deleted = await deleteDataServiceAssignment(dataServiceId, record.id);
          if (deleted) {
            onSuccess(`Successfully removed Global setting.`);
          } else {
            onFailed(`Failed removing Global setting.`);
          }
        }
        // ADD HANDLER on global is false Plus account assignments
        if (selectedTags?.length > 0 && setUpdateInitialState) {
          for (const record of selectedTags) {
            const create = await createDataServiceAssignment(dataServiceId, false, typeof (record) === 'string'? record:record?.toString());
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
        window.location.href = `${PATH_NAME.DATA_SERVICE_VIEW}?id=${dataServiceId}`
      }, 600)
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
    <Card>
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
          <div>
            <TagsField
              id='templateAssignment'
              label='Account Numbers'
              mb='0px'
              h='140px'
              s={setSelectedTags}
              selectedTags={selectedTags}
              onChange={handleTagsChange}
            />
          </div>
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


