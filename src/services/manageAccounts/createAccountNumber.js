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
// Default function 
export default async function createAccountNumber(number, name) {
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));

  try {
    const account = getAccountInfo()
    if (!account?.isGuardianAdmin) {
      window.location.href = '/error'
      return;
    }
    const verify = await axios.post(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/createOrganizationAccount`,
      {
        number: number,
        name: name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
          "Authorization": `Bearer ${jwtToken}`
        },
      });
    switch (verify.status) {
      case 201:
      case 200: {
        const res = verify.data;
        if (!!verify.data.token) {
          var expirationTime = new Date(Date.now() + (res.timeout * 1000));
          var expirationTimeString = expirationTime.toUTCString();
          document.cookie = `token=${res.token}; expires=${expirationTimeString}; path=/;`;
        }
        return true;
      }
      default: return false;
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