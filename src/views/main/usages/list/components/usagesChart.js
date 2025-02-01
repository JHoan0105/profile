

import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";
// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';

import {
  barChartOptionsConsumption,
  barChartOptionsConsumptionLight,
} from '../variables/charts';


export default function UsagesChart(props) {
  const { yearMonth, dataConsumptions, device, ...rest } = props;
  const [lightModeData, setLightModeData] = useState();                                     // light mode chart configuration
  const [darkModeData, setDarkModeData] = useState();                                       // dark mode chart configuration
  const [updateData, setUpdateData] = useState([]);                                         // hold the selected device's data consumption

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    setLightModeData(() => {
      return { ...barChartOptionsConsumptionLight, xaxis: { ...barChartOptionsConsumptionLight.xaxis, categories: yearMonth } }
    })
    setDarkModeData(() => {
      return { ...barChartOptionsConsumption, xaxis: { ...barChartOptionsConsumption.xaxis, categories: yearMonth } }
    })
    console.log("USAGE CHART", dataConsumptions)
  }, [])

  useEffect(() => {
    setUpdateData(() => dataConsumptions)
    console.log("USAGE DATA UPDATE", dataConsumptions)
  }, [dataConsumptions])

  return (
    <Card alignItems="center" flexDirection="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          Data Usages Per Month : &nbsp;{device}
        </Text>
      </Flex>
      <Box h="240px" mt="auto" w="100%">
        {lightModeData && textColor !== 'white' ?
          <Chart
            options={lightModeData}
            series={Array.isArray(updateData) ? updateData : []}
            type='bar'
            width='100%'
            height='100%'
          />
          :
          null
        }
        {darkModeData && textColor === 'white' ?
          <Chart
            options={darkModeData}
            series={Array.isArray(updateData) ? updateData : []}
            type='bar'
            width='100%'
            height='100%'
          />
          :
          null
        }
      </Box>
    </Card>
  );
}
