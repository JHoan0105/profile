/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright � 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Imports
import axios from 'axios';

// Default function
export default async function createDataService(planName, activationFee, baseFee, dataIncluded, dataIncrement, dataRate, earlyTerminationFee, isInternetAccess, internetAccessFee, marketType, minDeviceCommit, minSessionVolume, minTerm, isPooling, servicePlanId, submarketId) {
  console.log("createDataService");
  const controller = new AbortController();
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  try {
    const verify = await axios.post(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/provisioning/certus/templates/data`,
      {
        templateName: planName,
        activationFee: activationFee,
        baseFee: baseFee,
        dataIncluded: dataIncluded,
        dataIncrement: dataIncrement,
        dataRate: dataRate,
        earlyTerminationFee: earlyTerminationFee,
        internetAccess: isInternetAccess,
        internetAccessFee: internetAccessFee,
        marketType: marketType,
        minDeviceCommit: minDeviceCommit,
        minSessionVolume: minSessionVolume,
        minTerm: minTerm,
        pooling: isPooling,
        submarketID: submarketId,
        servicePlanID: servicePlanId,
      },
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
          "Authorization": `Bearer ${jwtToken}`
        },
      });
    console.error("verify", verify);
    console.error("error", verify.error);
    switch (verify.status) {
      case 201:
      case 200: return verify.data;
      case 400:
        console.error("error", verify.error); break;
      default: return verify.data;
    }
  } catch (error) {
    // Handle error responses
    if (error.response && error.response.status === 500) {
      throw new Error("Data service already exists");
    } else if (error.response && (error.response.status === 401)) {
      if (error.response.data === "JWT authorization error") {
        console.error("JWT authorization error:", error.response.data);
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
      if (error.response.data?.message === 'token expired') {
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
    } else {
      console.error("Other error:", error.message);
    }
    return false;
  }
}