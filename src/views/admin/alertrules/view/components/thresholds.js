//=========================================================
// Provisioning Portal - v2.0.2
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import setAlertRuleThresholds from 'services/alertrules/setAlertRuleThresholds'
import {PATH_NAME } from 'variables/constants'

// Chakra imports
import {
  Box,
  Button,
  extendTheme,
  Flex,
  Text,
  useToast,
  Radio,
  RadioGroup,
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
  const { rowData } = props;
  const [inputValues, setInputValues] = useState({
    value1: '',
    value2: ''
  });
  const [addSecondThreshold, setAddSecondThreshold] = useState(false);
  const threshold2Ref = useRef(null);
  const [isPercentage, setIsPercentage] = useState(true);
  const [loading, setLoading] = useState(false);
  const accountInfo = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;
  const nav = useNavigate();
  const theme = extendTheme({
    colors: {
      brand: {
        500: "#yourColorCodeHere", // Replace with your desired color code
      },
    },
  });

  useEffect(() => {
    if (rowData && rowData.thresholds) {
      const thresholdsArray = rowData.thresholds.split(',').map(threshold => threshold.trim().replace('%', ''));
      if (rowData.relativeThreshold) { // %
        console.log("1");
        setInputValues({
          value1: thresholdsArray[0] || '',
          value2: thresholdsArray[1] || '',
        });
      } else { // MB
        console.log("2");
        setInputValues({
          value1: thresholdsArray[0] / 1000000 || '',
          value2: thresholdsArray[1] / 1000000 || '',
        });
      }

      setIsPercentage(rowData.relativeThreshold);
      console.log("isPercentage: ", rowData.relativeThreshold);

      console.log("thresholdsArray[0]: ", thresholdsArray[0]);
      console.log("thresholdsArray[1]: ", thresholdsArray[1]);
    }
  }, [rowData]);

  useEffect(() => {
    console.log("Updated value1: ", inputValues.value1);
    console.log("Updated value2: ", inputValues.value2);
    if (inputValues.value2 !== '') {
      setAddSecondThreshold(true);
    }
  }, [inputValues]);

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

    // Save new data
    try {
      const result = await setAlertRuleThresholds(
        currentAccountNumber,
        rowData.relativeThreshold,
        rowData.thresholds,
        isPercentage,
        newThresholds,
        rowData.usageType,
      )
      console.log('ALERT PAGE',result)
      if (result) {
        // On Success Toast message
        onSuccess(`Successfully update thresholds.`);
        //fetchData(); // Refresh data after enabling
      } else {
        onFailed('Failed updating thresholds.')
      }
    } catch (error) {
      const tmp = error.toString();
      console.log("Error", tmp);
      onFailed(tmp)
    }

    //Redirect to list
    nav(PATH_NAME.ALERT_LIST);
  }

  const toast = useToast();
  const onFailed = (s) => {
    setLoading(false);
    (() => {
      toast({
        title: s || 'Failed updating recipients',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = (s) => {
    setLoading(false);
    (() => {
      toast({
        title: s || 'Successfully updated recipients',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

    // Chakra Color Mode

  return (
    <Card
    mt='30px'
      flexDirection={{ base: "column", md: "column", lg: "column" }}
      alignItems='center'
    >
      <Flex direction='row'>
        <Box mr={2}>
          <InputField
            id='threshold1'
            label=''
            placeholder='0'
            value={inputValues.value1}
            onChange={(e) => setInputValues({ ...inputValues, value1: e.target.value })}
            onKeyPress={(e) => {
              const keyCode = e.keyCode || e.which;
              const keyValue = String.fromCharCode(keyCode);
              if (!/\d/.test(keyValue) && keyCode !== 8) e.preventDefault(); // keyCode 8 is backspace
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
              onChange={(e) => setInputValues({ ...inputValues, value2: e.target.value })}
              onKeyPress={(e) => {
                const keyCode = e.keyCode || e.which;
                const keyValue = String.fromCharCode(keyCode);
                if (!/\d/.test(keyValue) && keyCode !== 8) e.preventDefault(); // keyCode 8 is backspace
              }}
            />
          </Box>
        )}
        {!addSecondThreshold && (
          <Box ml={1} mt={5} mr={4}>
            <FaPlus
              style={{ cursor: 'pointer' }} // Change cursor to pointer on hover
              onClick={() => setAddSecondThreshold(true)} // Call handleClick function on click 
            />
          </Box>
        )}
        {addSecondThreshold && (
          <Box ml={1} mt={5} mr={4} >
            <FaMinus
              style={{ cursor: 'pointer' }} // Change cursor to pointer on hover
              onClick={() => {
                setInputValues({ ...inputValues, value2: '' });
                setAddSecondThreshold(false);
              }} // Call handleClick function on click 
            />
          </Box>
        )}
        <Box ml={2} mt={4}>
          <RadioGroup onChange={(value) => setIsPercentage(value === 'percentage')} value={isPercentage ? 'percentage' : 'megabytes'} colorScheme="brand">
            <Flex direction='row'>
              <Radio value='percentage' mr={2}>%</Radio>
              <Radio value='megabytes'>MB</Radio>
            </Flex>
          </RadioGroup>
        </Box>
      </Flex>
      <Button
        isLoading={loading }
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

