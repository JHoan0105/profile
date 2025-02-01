/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { Link as Links } from 'react-router-dom';
const appversion = process.env.REACT_APP_VERSION
export default function Footer() {
  const textColor = useColorModeValue("black", "white");
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      mt='20px'
      zIndex='3'
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px={{ base: "30px", md: "50px" }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        {" "}
        {1900 + new Date().getYear()}
        <Link
          mx='3px'
          color={textColor}
          href='https://github.com/JHoan0105/'
          target='_blank'
          fontWeight='700'
        >
          Git Hub
        </Link>
      </Text>

      <Flex justifyContent='flex-end' mr='100px'>
        <List display='flex'>
          <ListItem
            me={{
              base: "20px",
              md: "44px",
            }}>
            <Link
              fontWeight='500'
              color={textColor}
              href='mailto:hoan0105@alognquinlive.com'>
              Email Me
            </Link>
          </ListItem>
          <ListItem
            me={{
              base: "20px",
              md: "44px",
            }}>
            <Link
              fontWeight='500'
              color={textColor}
              href='https://JHoan0105.github.io/reactapp/'>
              Git Hub Page
            </Link>
          </ListItem>
        </List>
        <Text as={Links} to={`/auth/sign-in`} fontWeight='500' ms='44px'>
          {'Sample'}
        </Text>
      </Flex>
    </Flex>
  );
}
