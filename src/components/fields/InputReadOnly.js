import {
  Flex,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";

const Default = forwardRef((props, ref) => {
  const { id, label, extra, placeholder, type, mb, value,...rest } = props;
  const textColorPrimary = useColorModeValue("black", "white");

  return (
    <Flex direction='column' >

      <Input
        {...rest}
        ref={ref}
        type={type}
        id={id}
        fontWeight='500'
        variant='main'
        placeholder={value}
        _placeholder={{ fontWeight: "400", color:textColorPrimary  }}
        h='44px'
        maxh='44px'
        width='100%'
        readOnly
      />
    </Flex>
  );
});

export default Default;
