/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Imports
import axios from 'axios';
import getAccountInfo from 'services/account/getAccountInfo'

// Default function
export default async function getDevice(a) {
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  console.log("Account Number", a)
  const account = getAccountInfo();
  const page = window.location.href
  try {
    if (!account.isCertusProvisioning && !(page.includes("main/dashboard") || page.includes("main/usages"))) {
      if (!account?.isGuardianAdmin) {
        window.location.href = '/main/dashboard'
      }
    }
    const verify = await axios.get(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/provisioning/account/${a}/certus/device`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
          "Authorization": `Bearer ${jwtToken}`
        },
      });

    switch (verify.status) {
      case 201:
      case 200: return verify.data;
      case 400:
        break;
      default: return true;
    }
  } catch (error) {
    // Handle error responses
    if (error.response && error.response.status === 400) {
      console.error("Error:", error.response.data);
      const tmp = { ...error.response.data }
      throw new Error(tmp.error);

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
      // TODO : TEST WHEN RYAN TURN OFF DEVICE SERVICE -- should block response message
      console.error("Other error:", error.message);
      const tmp = error?.response?.statusText?.toString();
      if (tmp.match(/Internal Server Error/gi))
        console.error('DEVICE ERROR REDIRECT to clear response message')
        // connect ECONNREFUSED 192.168.130.25:10443
    }
    return false;
  }
}