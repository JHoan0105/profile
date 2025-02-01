/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Imports
import axios from 'axios';

// Default function
export default async function deleteDevice(a, i) {
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  console.log({ "Account": a, "Device IMEI": i })
  try {
    const verify = await axios.delete(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/provisioning/account/${a}/certus/device/${i} `,
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
      default: console.log('CODE +300'); return true;
    }
  } catch (error) {
    // Handle error responses
    if (error.response && error.response.status === 400) {
      console.error("Error:", error.response.data.error);
      const tmp = { ...error.response.data }
      throw new Error(tmp.error);
      //}
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
      const tmp = { ...error.response.data }
      throw new Error(tmp.error);
    }
    return false;
  }
}