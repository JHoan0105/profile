// Chakra imports
import { Flex, Box, Text, useColorModeValue, SimpleGrid } from '@chakra-ui/react';
import CircularProgress from 'components/charts/CircularProgress';
import { VSeparator } from 'components/separator/Separator';

// Custom components
import Card from 'components/card/Card';

export default function ProfitEstimation(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardColor = useColorModeValue('secondaryGray.200', 'guardianDark.100');
  return (
    <Card
      p="20px"
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
        Data Usage
      </Text>
      <Text
        color={textColor}
        fontSize="sm"
        fontWeight="500"
        maxW="200px"
        mx="auto"
      >
        Display devices which are over usage limits.
      </Text>
      <Flex
        justifyContent="center"
        alignItems="center"
        w="100%"
        px="10px"
        mb="8px"
      />
      <Box w="140px" mx="auto" mb="20px" mt="10px">
        <CircularProgress title="MB" percentage={80} />
      </Box>
      <Card bg={cardColor} flexDirection="row" p="15px" px="20px" mt="auto">
        <Flex direction="column" py="5px">
          <Text
            fontSize="xs"
            color={textColor}
            fontWeight="700"
            mb="5px"
            align="left"
          >
             IMEI
          </Text>
          <SimpleGrid
            mb='0px'
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: "20px", xl: "5px" }}>
            {/* IMEI */}
            <Box>
              <Text fontSize="xs" color={textColor} fontWeight="500">
                300058030005100
              </Text>
            </Box>
            {/* Percentage */}
            <Box>
              <Text fontSize="xs" color={textColor} fontWeight="500">
                55%
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color={textColor} fontWeight="500">
                300058030005110
              </Text>
            </Box>
            {/* Percentage */}
            <Box>
              <Text fontSize="xs" color={textColor} fontWeight="500">
                75%
              </Text>
            </Box>
          </SimpleGrid>
        </Flex>
      </Card>
    </Card>
  );
}
