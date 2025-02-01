// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue, 
} from '@chakra-ui/react';
import Card from 'components/card/Card';
// Custom components
import BarChart from 'components/charts/BarChart'; 

import {
  barChartDataConsumption,
  barChartOptionsConsumption,
} from 'views/main/usages/view/variables/charts';

export default function Consumption(props) {
  const { ...rest } = props; 

  const newOptions = {
    ...barChartOptionsConsumption,

    fill: {
      type: 'solid',
      colors: ["var(--chakra-colors-brand-500)", '#6AD2FF', '#E1E9F8'],
    },
    colors: ["var(--chakra-colors-brand-500)", '#6AD2FF', '#E1E9F8'],
  };
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');

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
          Data Usages Per Month
        </Text>
      </Flex>

      <Box h="240px" mt="auto" w="100%">
        <BarChart
          chartData={barChartDataConsumption}
          chartOptions={newOptions}
        />
      </Box>
    </Card>
  );
}
