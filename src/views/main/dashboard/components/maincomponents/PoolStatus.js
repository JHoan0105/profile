/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports


// Chakra import
import { Text, useColorModeValue, useTheme } from '@chakra-ui/react';

import React, { useEffect } from "react";

import ReactApexChart from "react-apexcharts";

// Custom components
import Card from 'components/card/Card';
import {
  donutChartOptionsGeneral,
  donutChartOptionsForRemaining,
  donutChartOptionsGeneralBytes,
  donutChartOptionsForRemainingBytes
} from '../../variables/chart'

export default function PoolStatus(props) {
  const { poolName, usage, isBytes,...rest } = props;


  // Chakra Color Mode
  const textColorMode = useColorModeValue('secondaryGray.900', 'white');
  const theme = useTheme();
  const textColor = textColorMode.includes('.')
    ? theme.colors[textColorMode.split('.')[0]][textColorMode.split('.')[1]]
    : textColorMode;

  useEffect(() => {
    console.log('Usage', usage)
  }, [])
  return (
    <Card
      minH='400px'
      justifyContent='center'
      alignItems="center"
      flexDirection="column"
      textAlign="center"
      w="100%"
      {...rest}
    >
      <Text
        color={textColor}
        fontSize="lg"
        fontWeight="700"
        mb="10px"
        mx="auto"
      >
        {poolName}
      </Text>
      { /* index 1 when negative value use different option     */}
        
  
      {isBytes ?
        <ReactApexChart
          options={usage[1] < 0 ? donutChartOptionsForRemainingBytes : donutChartOptionsGeneralBytes}
          height='325px'
          series={!!usage ? usage : [0, 0]}
          type='donut'
        />
        :
        <ReactApexChart
          options={usage[1] < 0 ? donutChartOptionsForRemaining : donutChartOptionsGeneral}
          height='325px'
          series={!!usage ? usage : [0, 0]}
          type='donut'
        />
      }
    </Card>
  );
}
