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
import ReleaseNotes from "./components/ReleaseNotes";
import Post from "./components/Post";
export default function Default() {


  const title = 'Release v2.0'


  return (
    <>
      <Flex
        pt={{ base: "130px", md: "80px", xl: "80px" }} width='1200px'>
          <Flex >
            <Post
              style={{
                maxHeight: '530px',
                overflowY: 'auto',    // Enable vertical scrolling if needed
                padding: '10px',
              }}
              title="NEWS"
              subTitle="Releases"
              commentBlocks={
                <Box pl='8px'>
                  <ReleaseNotes
                    title={title}
                    tags={["release notes"]}
                    time='September 23, 2024'
                    pe='20px'
                  />
                </Box>
              }
            />
          </Flex>
      </Flex>
    </>
  );
}
