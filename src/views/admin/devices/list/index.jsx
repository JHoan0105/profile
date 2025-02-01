/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import { AuthContext } from 'contexts/AuthContext';
import "assets/css/Searchable.css";
import getDevices from 'services/device/getDevices'

// Chakra imports
import { Flex, Switch, Text } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState, useContext } from "react";
// TYPO on SearchTableDevicesOverivew" File --- Overview
import SearchTableDevices from "views/admin/devices/list/components/SearchTableDevicesOverivew";
import { columnsDevicesOverview } from "views/admin/devices/list/variables/columnsDevicesOverview";

export default function DevicesOverview() {
  const { accountInfo } = useContext(AuthContext);
  const [devicesInfo, setDevicesInfo] = useState([])                                  // use for filters of list before passing to table
  const [deviceList, setDeviceList] = useState([]);                                   // original devive list
  accountInfo.current = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo.accountNumber;

  const [isVisible, setIsVisible] = useState(true);
  const sizeThreshold = 600; // Set your size threshold here

  const handleResize = () => {
    if (window.innerWidth < sizeThreshold) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    // Set initial visibility
    handleResize();

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const dList = await getDevices(currentAccountNumber);
      if (dList) {
        setDeviceList(() => dList);
        setDevicesInfo(() => dList);
      }
    })()
  }, []);

  return (
    <Flex direction='column' pt={{ sm: "125px", lg: "75px" }}  >
      <Card px='0px' >
        <SearchTableDevices
          tableData={deviceList || []}
          columnsData={columnsDevicesOverview}
        >
          {isVisible &&<Switch
            display='center'
            id='filter-active'
            colorScheme='brand'
            align='center'
            mt='10px'
            onChange={(e) => {
              // TODO NOTE : Using cached Device list States. For updated device list the page would need to be revisited or refresh
              if (e.target.checked)
                setDeviceList(() => deviceList.filter(v => v.active === true))
              else
                setDeviceList(() => devicesInfo)
            }}
          >
            <Text ml='5px' mt='10px' align='center' display='center' justify='center'>show active</Text>
          </Switch>}
        </SearchTableDevices>
      </Card>
    </Flex>
  );
}
