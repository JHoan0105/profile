import {
  Avatar,
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import { FaRegCommentDots } from "react-icons/fa";
import {} from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";
import {
  MdOutlineFavoriteBorder,
  MdShare,
  MdBookmarkBorder,
  MdOutlineAttachment,
  MdOutlineTagFaces,
  MdImage,
} from "react-icons/md";

// Custom components
import Card from "components/card/Card.js";
import { HSeparator } from "components/separator/Separator.js";
import React from "react";

export default function Post(props) {
  const {
    title,
    subTitle,
    rightText,
    company,
    commentBlocks,
    ...rest
  } = props;
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card p={{ base: "15px", md: "30px" }} {...rest}>
      <Box mb='0px' w='100%'>
        <Flex justify='space-between' align='center' w='100%'>
          {/* Left side containing title and subtitle */}
          <Flex direction='column'>
            <Text fontSize='md' color={textColor} fontWeight='700'>
              {title}
            </Text>
            <Text fontSize='sm' color='gray.500' fontWeight='500'>
              {subTitle}
            </Text>
          </Flex>
          {/* Right side containing the additional text */}
          <Text fontSize='sm' color='gray.500' fontWeight='500' ml="auto" mt='22px'>
            {rightText}
          </Text>
        </Flex>
      </Box>

      <Flex direction='column'>

        <HSeparator mb='26px' width='1000px' maxW='100%' />
        <Box px={{ md: "20px" }}>

          {commentBlocks}
        </Box>
      </Flex>
    </Card>
  );
}
