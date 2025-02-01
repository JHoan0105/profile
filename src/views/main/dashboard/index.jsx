/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
import getMaintenanceStatus from 'services/getMaintenance';


import React, { useRef, useState, useEffect } from "react";
// Chakra imports
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";

// Custom components
import PortalStatus from "./components/PortalStatus";
import Maintenance from './components/Maintenance';

import MainDashboard from './components/MainDashboard';                          // Contain Pool Status and Active Devices Charts 

import { formatDateTimeString, hasPast12Hours } from 'tools/stringFormat'

export default function Default() {

  const [activeDevice, setActiveDevice] = useState(false)                         // GUARDIAN Provisioning API state is passed to PortalStatus for display and is set on request for data from the MainDashboard charts
  const [certusCallout, setCertusCall] = useState(false)                          // IRIDIUM API state is passed to PortalStatus for display and is set on request for data from the MainDashboard charts
  const [gDatabase, setGDatabase] = useState(false)                               // SF API state is passed to PortalStatus for display and is set on request for data from the MainDashboard charts
  const [maintenanceStatus, setMaintenanceStatus] = useState({});                 // Maintenance Status
  const [maintenanceEnded, setMaintenanceEnded] = useState(false);                // To Display Mainenance after maintenance completed within 12 Hours

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    (async () => {
      try {
        let main
        const maintenance = await getMaintenanceStatus();
        if (!!maintenance) {

          const currentTime = new Date()
          // filter maintenance prior to maintenance
          main = maintenance?.filter(v => {
            const start = new Date(v.startTime)
            return start < currentTime
          })?.sort((a, b) => {
            return new Date(a.startTime) - new Date(b.startTime)
          })[0]

          // filter maintenance durring and after maintenance
          const completed = maintenance?.filter(v => {
            const end = new Date(v.endTime)
            return end > currentTime
          })?.sort((a, b) => {
            return new Date(b.startTime) - new Date(a.startTime)
          })[0]
          
          if (!!main) {
            setMaintenanceStatus(() => main)
            setMaintenanceEnded(() => false)
            // display completed Maintenance message within 12hours period
          }else if (!!completed && hasPast12Hours(new Date(completed?.endTime))) {
            setMaintenanceStatus(() => completed)
            setMaintenanceEnded(() => true)
          } else {
            setMaintenanceStatus(() => main )
          }
          
        } else {
          setMaintenanceStatus(() => main)
        }

      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  useEffect(() => {
    console.log({ deviceStatus: activeDevice, certusStatus: certusCallout, database: gDatabase, maintenance: maintenanceEnded, maintenanceStatus: maintenanceStatus })

  }, [activeDevice, certusCallout, gDatabase, maintenanceStatus])

  return (
    <>
      <Flex mb={{ sm: "-85px", md: "-20px", lg: "-67px", xl: "-67px", "2xl": "-67px" }} mt={{ sm: "122px", md: "122px", lg: "75px", xl: "75px", "2xl": "75px" }}>
        <PortalStatus
          activeDevice={activeDevice}
          certusCallout={certusCallout}
          gDatabase={gDatabase}
        />
      </Flex >
      <Flex mb={{ sm: "-28px", md: "-8px", lg: "-58px", xl: "-58px", "2xl": "-58px" }} mt={{ sm: "128px", md: "83px", lg: "79px", xl: "79px", "2xl": "79px" }}>
        {
          !!maintenanceStatus
            ?
            < Maintenance description={maintenanceStatus?.description}
              startTime={formatDateTimeString(new Date(maintenanceStatus?.startTime))}
              endTime={formatDateTimeString(new Date(maintenanceStatus?.endTime))}
              completed={certusCallout && (hasPast12Hours(maintenanceStatus?.endTime) && maintenanceEnded)}
            />
            :
            null
        }
      </Flex>
      <SimpleGrid
        mt={!!maintenanceStatus ? '70px' : '58px'}
        columns={{ sm: 2, md: 2, lg: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <MainDashboard
          setActiveDevice={setActiveDevice}
          setCertusCall={setCertusCall}
          setGDatabase={setGDatabase}
        />
      </SimpleGrid>
    </>
  );
}
