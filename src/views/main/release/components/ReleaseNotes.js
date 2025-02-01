import {
  Flex,
  Link,
  Text,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

// Custom components
import React from "react";

export default function ReleaseNotes(props) {
  const { name, text, tags, time, ...rest } = props;
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const textGray = useColorModeValue("#68769F", "secondaryGray.600");
  return (
    <Flex mb='30px' {...rest}>
      <Flex  width='100%'>
        <div>
          <h1>Release Notes - Version 2.0</h1>
          <Text fontSize='md' color={textColorSecondary} fontWeight='500'>
            {time}
          </Text>
          <h2>New Features</h2>
          <ul>
            <li><strong>Device Voice Line Support</strong>: Added support for voice line functionality on devices.</li>
            <li><strong>Active Device Identifier Updates</strong>: Users can now update active device identifiers directly.</li>
            <li><strong>Usage Report Functionality</strong>: Introduced the ability to generate usage reports.</li>
          </ul>
          <br />
          <h2>Improvements</h2>
          <ul>
            <li><strong>Enhanced User Experience Notifications</strong>: Improved notifications for a smoother experience during device updates.</li>
            <li><strong>Intuitive Messaging</strong>: Made messaging clearer and more user-friendly regarding device updates.</li>
            <li><strong>Consistent User Interface Theme</strong>: Streamlined the UI for a cohesive look and feel.</li>
            <li><strong>Typographical Corrections</strong>: Fixed various typos throughout the application.</li>
          </ul>
        </div>
      </Flex>
    </Flex>
  );
}
