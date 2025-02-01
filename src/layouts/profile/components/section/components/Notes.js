import {
  Flex,
  Link,
  Text,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

// Custom components
import React from "react";

export default function Notes(props) {
  const { name, text, tags, additional, contentHeader, listItems,subListItem,subList, ...rest } = props;
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const textGray = useColorModeValue("#68769F", "secondaryGray.600");
  return (
    <Flex mb='-30px' {...rest}>
      <Flex  width='100%'>
        <div>
          <b><h1>{contentHeader}</h1></b>
          <Text fontSize='sm' color={textColor} fontWeight='500'>
            {additional}
          </Text>
          <ul>
            {listItems?.map(text => {
              return <li>{text}</li>
            })}
            {subListItem && <li>{subListItem}
              <ul style={{ paddingLeft: '20px' }}>
                {subList?.map((text, index) => {
                  return <><li key={index}>{text}</li></>;
                })}
              </ul>
            </li>
            }
          </ul>
          <br />
        </div>
      </Flex>
    </Flex>
  );
}
