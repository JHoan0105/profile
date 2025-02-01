/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';

// Imports
import axios from 'axios';

// Default function
export default async function getAlertRuleImeiList(accountNumber, relativeThreshold, thresholds, usageType) {
  const controller = new AbortController();
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  const route = `${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/alertruleimeilist`;
  const accountInfo = getAccountInfo();
  console.log("getAccountInfo?.isGuardianAdmin", accountInfo?.isGuardianAdmin);
  console.log("getAccountInfo?.accountNumber", accountInfo?.accountNumber);
  console.log("accountNumber", accountNumber);

  // Return auth error if not gadmin accountNumber does not match user login account number
  if (!accountInfo?.isGuardianAdmin && accountInfo.accountNumbers == null) {
    if (accountInfo?.accountNumber !== accountNumber) {
      console.error("JWT authorization error: invalid account number.");
      //Delete token cookie 
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      return false;
    }
  }

  try {
    if (!accountInfo?.isAlertManagement) {
      if (!accountInfo?.isGuardianAdmin)
        window.location.href = '/main/dashboard'
    }
    console.log(route);
    const response = await axios.post(route,
      {
        accountNumber: accountNumber,
        relativeThreshold: relativeThreshold,
        thresholds: thresholds,
        usageType: usageType,
      },
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
          "Authorization": `Bearer ${jwtToken}`
        },
      });
    console.log("AlertRuleImeiList:", response.data);
    // Check response status
    switch (response.status) {
      case 201:
      case 200:
        return response.data;
      default:
        return [];
    }
  } catch (error) {
    // Handle errors
    if (error.response && (error.response.status === 401)) {
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