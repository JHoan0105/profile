/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright � 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Imports
import axios from 'axios';
import getAccountInfo from 'services/account/getAccountInfo'
// Default function  ${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}
export default async function deleteSubAccount(accountNumber, email) {
  const controller = new AbortController();
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  try {
    const account = getAccountInfo()
    if (account?.isGuardianAdmin || account?.isAccountManagement) {
      
    } else {
      window.location.href = '/error'
      return;
    }
    const verify = await axios.delete(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/deleteOrganizationSubAccount`,
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
          "Authorization": `Bearer ${jwtToken}`
        },
        data: {
          number: accountNumber,
          email: email
        },
      });
    switch (verify.status) {
      case 201:
      case 200: {
        return verify.data;
      }
      default: return verify.data;
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