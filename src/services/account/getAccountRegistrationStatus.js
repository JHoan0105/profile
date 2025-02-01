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
export default async function accountRegistrationStatus() {
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));

  try {
    const verify = await axios.get(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/getVerifyRegExpiry`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
          "Authorization": `Bearer ${jwtToken}`
        },
      });

    switch (verify.status) {
      case 201:
      case 200:
        return verify.data.status;
      default: return false;
    }

  } catch (error) {
    // Handle error responses
    if (error.response && error.response.status === 400) {
      console.error("Error:", error.response.data.error);
      throw new Error(error.response.data.error);
    } else if (error.response && (error.response.status === 401)) {
      console.log("error:", error.response.data);
      if (error.response.data === "JWT authorization error") {
        console.error("JWT authorization error:", error.response.data);
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
      else if (error.response.data === "JWT authorization error: access is block") {
        console.error("Error:", error.response.data);
        throw new Error(error.response.data);
        // Should this re-direct to login aswell?
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