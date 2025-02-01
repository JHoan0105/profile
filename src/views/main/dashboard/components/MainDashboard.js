/*
=========================================================
* Provisioning Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getDevices from 'services/device/getDevices'
import getIridiumHeartbeat from 'services/getIridiumHeartbeat'
import getDeviceInfo from 'services/device/getDeviceInfo'
import getDatabaseStatus from 'services/getDatabaseStatus'
import getUsage from 'services/alertrules/getUsage'

import { AuthContext } from 'contexts/AuthContext';

import { formatYearMonth, formatToMB } from 'tools/stringFormat'

// Chakra imports
import React, { useEffect, useState, useContext } from "react";


import ActiveDevice from './maincomponents/ActiveDevice'
import PoolStatus from './maincomponents/PoolStatus'

export default function MainDashboard({ setActiveDevice, setCertusCall, setGDatabase, ...props }) {
  const [numberActiveDevice, setNumberActiveDevice] = useState(0);                                    // total active devices
  const [devices, setDevices] = useState([]);                                                         // all devices on account
  const [poolById, setPoolById] = useState([])                                                        // hold pool usage data
  const [loadPool, setLoadPool] = useState(false)                                                     // display pool chart

  const { accountInfo } = useContext(AuthContext);                                                    // retrieve account info by context
  accountInfo.current = getAccountInfo();                                                             // update account info
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo.accountNumber;   // load account number

  useEffect(() => {
    (async () => {
      let dStatus = false;                                      // Device status
      let cStatus = false;                                      // certus status
      let devices;                                              // devices data
      try {
        devices = await getDevices(currentAccountNumber);
        console.log("deviceList", devices);
        // setting provisioning API state - any call to provisioning / billing system API
        if (!!devices || devices == 0 || devices === null) {
          setActiveDevice(() => true)
          const activeDevices = devices ? devices.filter(device => device.active == true) : [];
          setDevices(() => devices)
          setNumberActiveDevice(activeDevices?.length);
          dStatus = true;
        } else {
          setActiveDevice(() => false)
        }
      } catch (error) {
        console.error(error)
      }
      try {
        let certus = await getIridiumHeartbeat()
        // setting the Iridum API state - call outs to iridium
        if (!!certus) {
          setCertusCall(() => true)
          cStatus = true
        } else if (!!devices) {
          certus = await getDeviceInfo(currentAccountNumber, devices[0].imei)
          setCertusCall(() => true)
          cStatus = true
        } else {

          setCertusCall(() => false)
        }
      } catch (error) {
        console.error(error)
      }
      try {
        // setting the database state
        const database = await getDatabaseStatus();
        if (database?.Products?.length > 0)
          setGDatabase(() => database?.Products[0].isActive)
        else
          setGDatabase(() => false)
      } catch (error) {
        console.error(error)
      }
      // if provisioning and iridium is active get Usages for POOL
      if (dStatus && cStatus) {
        const currentMonth = formatYearMonth(new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - (0)))).replace('/', '-') + '-01'
        const toDate = (formatYearMonth(new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() + 1)))).replace('/', '-') + '-01'

        const usage = await getUsage(currentAccountNumber, currentMonth, toDate)
        if (!!usage) {
          const tmp = usage?.filter(v => v.pooled === true)
          let bundle = [];
          tmp?.forEach((p, i) => {
            if (!bundle.includes(p.bundle)) {
              bundle.push(p.bundle)
            }
          }
          )
          let mapBundle = new Map(bundle.map(u => {
            const arr = tmp.filter(v => v.bundle === u)
            return [u, arr]
          }))
          setPoolById(() => Array.from(mapBundle.values()))
          setLoadPool(() => true);
        } else {
          setLoadPool(() => true);
        }
      }
    })();
  }, []);

  // add
  const accumulate = (prev, current) => {
    return prev + current;
  }
  return (
    <>
      <ActiveDevice
        numberActiveDevice={numberActiveDevice}
        numberOfDevices={devices?.length}
      />

      {poolById?.length !== 0 ? poolById?.sort((a, b) => {
        const aValues = a.reduce((p, a) => accumulate(p, a.ratedVolume), 0)
        const bValues = b.reduce((p, a) => accumulate(p, a.ratedVolume), 0)

        return aValues === bValues ? 0 : aValues > bValues ? -1 : 1
      }).map((v, i) => {
        let isBytes = false;                      // if bundle allowance is less than 1MB use different chart for label
        if (v[0].bundleAllowance < 1000000) {
          isBytes = true;
        }
        // NOTE: When usage is over bundle Allowance UILabel(mouse-over) for overage is in negative indicating the overage amount
        let used = v[0].bundleAllowance < 1000000 ?
          Number(v.reduce((p, a) => accumulate(p, a.ratedVolume), 0))
          : Number(formatToMB(v.reduce((p, a) => accumulate(p, a.ratedVolume), 0)))

        let bundleAllowance = v[0].bundleAllowance < 1000000 ?
          Number(v[0].bundleAllowance)
          : formatToMB(v[0]?.bundleAllowance)

        let remainingOrOver = bundleAllowance - used
        if (used === 0) {
          // if nothing used dont show graph
          return null;
        }
        return < PoolStatus
          key={v[0]?.bundle}
          poolName={v[0]?.bundle}
          usage={[used, remainingOrOver]}
          isBytes={isBytes}
        />
      }
      )
        :
        !loadPool && <PoolStatus
          key='none'
          poolName='Loading Pool...'
          usage={[100, 0]}
        />
      }
    </>

  );
}
