/*
=========================================================
* Certus Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Imports
import axios from 'axios';

// Default function
export default async function updateBundle(id, accountNumber, account, billingDetail, bundleName, startDate, endDate) {
  const controller = new AbortController();
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  console.log("updateDataService(id)", id)
  try {
    const verify = await axios.put(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/provisioning/account/${accountNumber}/certus/bundle/${id}`,
      {
        account: account,
        billingDetail: billingDetail,
        bundleName: bundleName,
        startDate: startDate,
        endDate: endDate,
      },
      {
        signal: controller.signal,
        mode: "no-cors",
        credentials: "omit",
        referrerPolicy: "strict-origin-when-cross-origin",
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
      case 200: return true;
      case 400:
        console.error("error", verify.error); break;
      default: return true;
    }
  } catch (error) {
    // Handle error responses
    if (error.response && error.response.status === 400) {
      console.error("Error:", error.response.data.error);
      throw new Error(error.response.data.error);
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