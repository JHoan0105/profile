import {
  Flex,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";

const Default = forwardRef((props, ref) => {
  const { id, label, extra, placeholder, type, mb, hasValue,...rest } = props;
  const textColorPrimary = useColorModeValue("black", "white");

  return (
    <Flex direction='column' mb={mb ? mb : "30px"}>
      <FormLabel
        display='inline'
        ms='10px'
        htmlFor={id}
        fontSize='sm'
        color={textColorPrimary}
        fontWeight='bold'
        _hover={{ cursor: "arrow" }}>
        {label}
        <Text fontSize='sm' fontWeight='400' ms='2px'>
          {extra}
        </Text>
      </FormLabel>
      <Input
        {...rest}
        ref={ref}
        type={type}
        id={id}
        fontWeight='500'
        variant='main'
        placeholder={placeholder || ''}
        _placeholder={{ fontWeight: "400", color: hasValue? textColorPrimary:"grey" }}
        h='44px'
        maxh='44px'
        width='100%'
      />
    </Flex>
  );
});

export default Default;
