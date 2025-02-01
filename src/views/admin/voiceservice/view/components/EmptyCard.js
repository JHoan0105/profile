

// Chakra imports
import Card from "components/card/Card";
import React, { } from "react";


// Default function
export default function EmptyCard({children }) {
  //Get the URL search parameters
  return (
    <Card mt='0px' minW='680px' h="300px" display="flex" alignItems="center" justifyContent="center" mb={{ base: "10px", sm: '45px', md: "55px", lg: "15px" }}>
      {children }
    </Card>
  );
}