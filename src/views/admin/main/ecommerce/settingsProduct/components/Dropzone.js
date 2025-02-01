// Chakra imports
import { Button, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
// Assets
import React from "react";

function Dropzone(props) {
  const { content, ...rest } = props;
  const { getRootProps, getInputProps } = useDropzone();
  const bg = useColorModeValue("gray.100", "guardianDark.100");
  const borderColor = useColorModeValue("gray.300", "whiteAlpha.100");
  return (
    <Flex
      align='center'
      justify='center'
      bg={bg}
      border='1px dashed'
      borderColor={borderColor}
      borderRadius='16px'
      w='100%'
      maxW='100%'
      h={{ base: "208px", "3xl": "300px" }}
      cursor='pointer'
      {...getRootProps({ className: "dropzone" })}
      {...rest}>
      <Input variant='main' {...getInputProps()} />
      <Button variant='no-effects'>{content}</Button>
    </Flex>
  );
}

export default Dropzone;
