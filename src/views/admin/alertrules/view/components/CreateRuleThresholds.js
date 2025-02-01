//=========================================================
// Certus Portal - v2.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import setDeviceAlertRule from 'services/alertrules/setDeviceAlertRule'
import setPoolAlertRule from 'services/alertrules/setPoolAlertRule'
import { RULES } from '../CreateAlertRule'
import { PATH_NAME } from 'variables/constants'

// Chakra imports
import {
  Radio,
  RadioGroup,
  Box,
  Button,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Custom components
import InputField from "components/fields/InputField";

// Icons
import { FaPlus, FaMinus } from 'react-icons/fa';

// Default function
export default function ThresholdsData(props) {
  const { ruleData, updateRule } = props;
  const [inputValues, setInputValues] = useState({
    value1: '',
    value2: ''
  });
  const [addSecondThreshold, setAddSecondThreshold] = useState(false);
  const threshold2Ref = useRef(null);
  const [isPercentage, setIsPercentage] = useState(true);
  const accountInfo = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;
  const nav = useNavigate();

  useEffect(() => {
    if (ruleData && ruleData.thresholds) {
      const thresholdsArray = ruleData.thresholds.split(',').map(threshold => threshold.trim().replace('%', ''));
      if (ruleData.relativeThreshold) { // %
        setInputValues({
          value1: thresholdsArray[0] || '',
          value2: thresholdsArray[1] || '',
        });
      } else { // MB
        setInputValues({
          value1: thresholdsArray[0] / 1000000 || '',
          value2: thresholdsArray[1] / 1000000 || '',
        });
      }

      console.log("value1: ", inputValues.value1);
      console.log("value2: ", inputValues.value2);

      setIsPercentage(ruleData.relativeThreshold);
      console.log("isPercentage: ", isPercentage);

      if (inputValues.value2 !== '') {
        setAddSecondThreshold(true);
      }
    }
  }, [ruleData]);

  useEffect(() => {
    if (addSecondThreshold && threshold2Ref.current) {
      threshold2Ref.current.focus();
    }
  }, [addSecondThreshold]);

  const handleSaveThreshold = async () => {
    console.log("handleSaveThreshold");
    console.log("inputValues.value2", inputValues.value2);
    console.log("inputValues.value1", inputValues.value1);
    let newThresholds;

    if (inputValues.value2 === '' && isPercentage) {
      newThresholds = `${inputValues.value1}%`
    } else if (inputValues.value2 === '' && !isPercentage) {
      newThresholds = `${inputValues.value1 * 1000000}`
    } else if (isPercentage) {
      newThresholds = `${inputValues.value1}%,${inputValues.value2}%`
    } else if (!isPercentage) {
      newThresholds = `${inputValues.value1 * 1000000},${inputValues.value2 * 1000000}`
    }

    //Make sure value 1 is not empty
    if (inputValues.value1 === '') {
      console.log("Enter one threshold value.");
      onFailed('Enter one threshold value.')
      return;
    }

    //Make sure value 1 is not 0
    if (inputValues.value1 === '0') {
      console.log("Enter threshold value greater than 0.");
      onFailed('Enter threshold value greater than 0.')
      return;
    }

    //If two values, ensure value 2 is greated than value 1
    if (inputValues.value2 !== '' && (inputValues.value2 <= inputValues.value1)) {
      console.log("Second threshold must be higher than first threshold.");
      onFailed('Second threshold must be higher than first threshold.')
      return;
    }
    updateRule({ type: RULES.UPDATE, payload: { name: 'thresholds', value: newThresholds } })

    try {
      ruleData.deviceList.forEach(async i => {
        if (i.id && i?.imei) {
          await setDeviceAlertRule(
            currentAccountNumber,
            ruleData.groupId,
            i.imei,
            isPercentage,
            newThresholds,
            true
          )
        } else if (i.id && i?.poolID) {
          await setPoolAlertRule(
            currentAccountNumber,
            ruleData.groupId,
            i.poolID,
            isPercentage,
            newThresholds,
            true
          )
        }
      })

      // On Success Toast message
      onSuccess(`Successfully created new rule.`);
      //Redirect to list
      nav(PATH_NAME.ALERT_LIST);
      //fetchData(); // Refresh data after enabling
    } catch (error) {
      const tmp = error.toString();
      console.log("Error", tmp);
      onFailed(`Failed to create new rule.`);
    }
  }

  const toast = useToast();
  const onFailed = (s) => {
    (() => {
      toast({
        title: s || 'Failed creating new alert rule',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = (s) => {
    (() => {
      toast({
        title: s || 'Successfully created new alert rule',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

  // Chakra Color Mode
  return (
    <Card
      p='10px'
      py='0px'
      flexDirection={{ base: "column", md: "column", lg: "column" }}
      alignItems='center'
      mt='0px'
    >
      <Flex direction='row'  >
        <Box mr={2}>
          <InputField
            id='threshold1'
            label=''
            placeholder='0'
            value={inputValues.value1}
            readOnly={addSecondThreshold ? true : false}
            onChange={(e) => {
              setInputValues({ ...inputValues, value1: e.target.value });
              updateRule({ type: RULES.UPDATE, payload: { name: 'thresholdValue1', value: e.target.value } })
            }}
            onKeyPress={(e) => {
              const keyCode = e.keyCode || e.which;
              const keyValue = String.fromCharCode(keyCode);
              if (!/\d/.test(keyValue) && keyCode !== 8) e.preventDefault();
            }}
          />
        </Box>
        {(inputValues.value2 !== '' || addSecondThreshold) && (
          <Box mr={2}>
            <InputField
              id='threshold2'
              label=''
              placeholder='0'
              value={inputValues.value2}
              onChange={(e) => {
                setInputValues({ ...inputValues, value2: e.target.value })
                updateRule({
                  type: RULES.UPDATE, payload: {
                    name: 'thresholdValue2', value: e.target.value
                  }
                })
              }
              }
              ref={threshold2Ref}
              onKeyPress={(e) => {
                const keyCode = e.keyCode || e.which;
                const keyValue = String.fromCharCode(keyCode);
                if (!/\d/.test(keyValue) && keyCode !== 8) e.preventDefault();
              }}
            />
          </Box>
        )}
        {inputValues.value1 ? !addSecondThreshold ? (
          <Box ml={1} mt={4} mr={4} marginTop={5}>
            <FaPlus
              style={{ cursor: 'pointer' }} // Change cursor to pointer on hover
              onClick={() => setAddSecondThreshold(true)} // Call handleClick function on click 
            />
          </Box>
        ) : (
          <Box ml={1} mt={4} mr={4} marginTop={5}>
            <FaMinus
              style={{ cursor: 'pointer' }} // Change cursor to pointer on hover
              onClick={() => {
                setInputValues(p => ({ ...p, value2: '' }));
                updateRule({ type: RULES.UPDATE, payload: { name: 'thresholdValue2', value: '' } });
                setAddSecondThreshold(false)
              }} // Call handleClick function on click 
            />
          </Box>
        ) :
          null}
        <Box ml={2} mt={4}>
          <RadioGroup colorScheme="brand" onChange={(value) => setIsPercentage(value === 'percentage')} value={isPercentage ? 'percentage' : 'megabytes'}>
            <Flex direction='row'>
              <Radio value='percentage' mr={2}>%</Radio>
              <Radio value='megabytes'>MB</Radio>
            </Flex>
          </RadioGroup>
        </Box>
      </Flex>
      <Button
        width='160px'
        variant='brand'
        color='white'
        fontSize='sm'
        fontWeight='500'
        _hover={{ bg: "brand.600" }}
        _active={{ bg: "brand.500" }}
        _focus={{ bg: "brand.500" }}
        onClick={() => handleSaveThreshold()} // Call handleClick function on click
      >
        Save Thresholds
      </Button>
      <Text
        fontSize='xs'
        mt='30px'
        mx='20px'
        textAlign='center'
      >
        *Usage alert email may be up to 24 hours delayed from when the actual threshold is met/exceeded.
      </Text>
    </Card>
  );
}

