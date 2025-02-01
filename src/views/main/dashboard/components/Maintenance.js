import { Flex, Text, Box, useColorModeValue } from "@chakra-ui/react";
// Assets

// Custom components
import Card from "components/card/Card.js";
import React, { useEffect} from "react";
import { GiHazardSign } from "react-icons/gi";
import { VSeparator } from "components/separator/Separator";
import { MdConstruction } from "react-icons/md";
export default function PortalStatus(props) {
  const { startTime, endTime, description, completed, ...rest } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  useEffect(() => {
    console.log("COMPLETED", completed)
  },[])
  return (
    <Card
      flexDirection='row'
      pb='0px'
      mb='0px'
      minHeight='60px'
      {...rest}>
      <Flex pr='20px' align='center' mb='15px'>
        <GiHazardSign size='24px' color='orange' />
      </Flex>
      <VSeparator mb='15px' />
      <Box justify='space-between' align='center' w='100%' mb='10px'>
        <Flex display='center' justify='center' align='center'>
          <MdConstruction color='orange' />
          <Text
            align='center'
            textAlign='center'
            color={textColor}
            fontSize='sm'
            fontWeight='500'>
            Maintenance Notice
          </Text>
          <MdConstruction color='orange' />
        </Flex>
        <Text
          align='center'
          textAlign='center'
          color={textColor}
          fontSize='sm'
          fontWeight='500'>
          {description}
        </Text>
        {!completed ?  
          <>
          <Text
          align='center'
          textAlign='center'
          color={textColor}
          fontSize='sm'
          fontWeight='500'>
          Start Time : {startTime}
        </Text>
        <Text
          align='center'
          textAlign='center'
          color={textColor}
          fontSize='sm'
          fontWeight='500'>
          End Time : {endTime}
            </Text>
        </>
          :
          <Text
            align='center'
            textAlign='center'
            color={textColor}
            fontSize='sm'
            fontWeight='500'>
            Maintenance Completed on {endTime}
          </Text>
        }
      </Box>

      <VSeparator mb='15px' />
      <Flex pl='20px' align='center' mb='15px'>
        <GiHazardSign size='24px' color='orange' />
      </Flex>

    </Card>
  );
}
