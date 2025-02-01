/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import { AuthContext } from 'contexts/AuthContext';
import "assets/css/Searchable.css";
import getDevices from 'services/device/getDevices'
import UsagesChart from "views/main/usages/list/components/usagesChart";

import getUsage from 'services/alertrules/getUsage'

import { formatToMB, formatYearMonth } from 'tools/stringFormat'

// Chakra imports
import React, { useEffect, useState, useContext, useReducer, useLayoutEffect } from "react";
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import SearchTableDeviceUsages from "views/main/usages/list/components/SearchTableDeviceUsages";
import { columnsDevicesUsages } from "views/main/usages/list/variables/columnsDeviceUsages";

// Constants to update usage data
export const DATA = {
  UPDATE: 'UPDATE',
  RESET: 'RESET',
  REMOVE: 'REMOVE',
  ADD: 'ADD'
}
// bar chart data 
const barData = []

// device data list
const deviceData = []

// BAR CHART DATA
const dispatchBarData = (barData, action) => {
  console.log("DISPATCH")
  switch (action.type) {
    case DATA.RESET:
      return
    case DATA.UPDATE:
      const tmp = action.payload.value.map(v => { return formatToMB(v) })
      console.log("UPDATE BAR DATA", { ...barData, data: tmp })
      return [{ name: 'Usage (MB)', color: '#FF8000', data: tmp }]
    default:
      console.log("DISPATCH DEFAULT")
      return barData
  }

}

// DEVICE's DATA
const dispatchDeviceUsage = (deviceData, action) => {
  console.log("DISPATCH")
  switch (action.type) {
    case DATA.RESET:
      return
    case DATA.ADD:
      console.log("ADD DEVICE DATA", action.payload.value)
      return action.payload.value
    default:
      console.log("DISPATCH DEFAULT")
      return deviceData
  }
}

export default function DevicesOverview() {
  const { accountInfo } = useContext(AuthContext);                                  // retrieve account info using context
  const [showChart, setShowChart] = useState(false);                                // show Chart state
  const [deviceRequest, setDeviceRequest] = useState([]);                           // to hold all devices under requested account number 
  const [usageRequest, setUsageRequest] = useState([]);                             // contains past 12 months usages under requested account number
  const [selected, setSelected] = useState();                                       // user select state


  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo.accountNumber;
  // update bar chart data consumption and listing of device data
  const [barDataConsumption, updateBarDataConsumption] = useReducer(dispatchBarData, barData)
  const [deviceDataUsage, updateDeviceDataUsage] = useReducer(dispatchDeviceUsage, deviceData)

  // building the array to hold string value of date for the past 12 months with array index base
  let yearMonths = ['', '', '', '', '', '', '', '', '', '', '', '']
  yearMonths.forEach((v, i) => {
    yearMonths[i] = formatYearMonth(new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - (i))))
  })

  useLayoutEffect(() => {
    (async () => {
      try {
        const deviceUsages = await getDevices(currentAccountNumber);
        setDeviceRequest(() => deviceUsages)
      } catch (error) {
        console.error(error)
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (deviceRequest?.length > 0) {
        try {
          const monthlyUsagesByIMEI = await getUsage(currentAccountNumber,
                                                    yearMonths[11].replace('/', '-') + '-01',
                                                    (formatYearMonth(new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() + 1)))).replace('/', '-') + '-01')

          setUsageRequest(() => monthlyUsagesByIMEI)

        } catch (error) {
          console.error(error)
        }
      }
    })()
  }, [deviceRequest])

  useEffect(() => {
    if (usageRequest?.length > 0) {
      let bias = 12 - (new Date().getMonth()) - 1;
      try {

        // provide collected / combine Devices - Get Usages include devices nolonger under accountNumber
        const uniqueIMEI = new Set();
        deviceRequest?.forEach((v) => {
          uniqueIMEI.add(v.imei)
        })
        usageRequest?.forEach(v => {
          uniqueIMEI.add(v.imei)
        })

        // temporarily hold the usages of devices
        const updateUsageByDevice = [];
        let counter = 0;

        // build data structure of temporary usages data of devices
        uniqueIMEI?.forEach((v) => {
          const tmpDevice = deviceRequest?.filter(d => d.imei === v)[0]?.active;
          updateUsageByDevice[counter++] = {
            imei: v,
            active: tmpDevice === undefined ? -1 : tmpDevice ? 1 : 0, // -1 for devices no longer under customer account
            monthlyUsages: [
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 },
              { planSize: 0, usage: 0 }
            ],
            monthlyDataUsages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          }
        });
        // setting the required device's data onto the data structure
        updateUsageByDevice?.forEach((u, idx) => {
          usageRequest?.sort((a, b) => a.imei - b.imei)?.forEach((v, i) => {
            if (v.imei === u.imei) {
              const index = (((new Date(v.dateFrom).getUTCMonth()) + bias) % 12) === -1 ? 0 : (((new Date(v.dateFrom).getUTCMonth()) + bias) % 12)
              updateUsageByDevice[idx].monthlyUsages[index] = { planSize: v.bundleAllowance, usage: v.ratedVolume, bundleUniqueName: v?.bundle, isPool: v?.pooled }
              updateUsageByDevice[idx].monthlyDataUsages[index] = v.ratedVolume
            }
          })
          updateUsageByDevice[idx].currentMonthUsage = updateUsageByDevice[idx]?.monthlyDataUsages[11]
          updateUsageByDevice[idx].previousMonthUsage = updateUsageByDevice[idx]?.monthlyDataUsages[10]
          updateUsageByDevice[idx].planSize = updateUsageByDevice[idx].monthlyUsages[11]?.planSize
          updateUsageByDevice[idx].isPool = updateUsageByDevice[idx].monthlyUsages[11]?.isPool
          updateUsageByDevice[idx].bundleUniqueName = updateUsageByDevice[idx].monthlyUsages[11]?.bundleUniqueName
        })
        console.log("UPDATE USAGE BY DEVICE", updateUsageByDevice)
        // cache the past 12 months device usages
        updateDeviceDataUsage({ type: DATA.ADD, payload: { value: updateUsageByDevice.sort((a, b) => a.imei - b.imei) } })

      } catch (error) {
        console.error("Server Error", error)
      }
    }
  }, [usageRequest])

  const handleViewClick = (imei) => {
    if (imei) {

      setShowChart(true);                           // set the ShowChart state highlighting the row
      console.log("UPDATE IMEI", imei)
      // update the bar data with the selected device usage data from the cached past 12 months device usage
      updateBarDataConsumption({ type: DATA.UPDATE, payload: { value: deviceDataUsage?.filter(v => v.imei === imei)[0].monthlyDataUsages } }) 
    }
    setSelected(() => imei)
  };

  return (
    <Flex direction='column' pt={{ sm: "125px", lg: "75px" }}  >
      <Card px='0px' >
        <SearchTableDeviceUsages
          tableData={deviceDataUsage || []}
          columnsData={columnsDevicesUsages}
          onViewClick={handleViewClick} // Pass the function to handle view click
        />
      </Card>
      {showChart && (
        <Flex mt={{ sm: '45px', md: "60px", lg: "10px" }} >
          <UsagesChart yearMonth={yearMonths.reverse()} dataConsumptions={barDataConsumption} device={selected} />
        </Flex>
      )}

    </Flex>
  );
}

