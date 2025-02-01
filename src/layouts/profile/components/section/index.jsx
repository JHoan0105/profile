/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

import React from "react";
// Chakra imports
import { Flex, Box } from "@chakra-ui/react";
// Custom components
import Notes from "./components/Notes";
import Post from "./components/Post";
export default function Default(props) {
  const {header, subTitle, rightText, contentHeader, additional, listItems, subListItem, subList, rest } = props

  return (
      <Flex
        pt={{ base: "20px", md: "20px", xl: "20px" }}
        ml='10px'
      >
        <Post
          style={{
            maxHeight: '530px',
            overflowY: 'auto',    // Enable vertical scrolling if needed
            padding: '10px',
          }}
          title={ header}
          subTitle={subTitle}
          rightText={rightText }
          commentBlocks={
            <Box pl='8px'>
              <Notes
                contentHeader={ contentHeader}
                additional={additional }
                listItems={listItems}
                subListItem={subListItem}
                subList={subList }
                pe='20px'
              />
            </Box>
          }
        />
      </Flex>
  );
}
