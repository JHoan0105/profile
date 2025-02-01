/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports

// Imports
import axios from 'axios';

// Default function
export default async function getDatabaseStatus() {
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  const route = `https://api.status.salesforce.com/v1/instanceAliases/guardianmobility/status`;

  try {
    const response = await axios.get(route,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
          "Authorization": `Bearer ${jwtToken}`
        },
      });
    // Check response status
    switch (response.status) {
      case 201:
      case 200:
        return response.data;
      default:
        return [];
    }
  } catch (error) {
    if (error?.response?.data?.message === 'token expired') {
      throw new Error('token expired')
    }
    // Handle errors
    if (error.response && (error.response.status === 401)) {
      if (error.response.data === "JWT authorization error") {
        console.error("JWT authorization error:", error.response.data);
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
      if (error.response.data === "JWT authorization error") {
        //console.error("JWT authorization error:", error.response.data);
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
    } else {
      //console.error("Other error:", error.message);
    }
   
  } return false;
}
  