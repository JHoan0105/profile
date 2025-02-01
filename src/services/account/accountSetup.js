/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Imports
import axios from 'axios';

export default async function accountSetup(email, accountNumber, url, user) {
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));

  try {
    const verify = await axios.post(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/accountNewUser`,
    {
      "email": email,
      "accNum": accountNumber,
      "url": url,
      "setup": user,
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
      case 200: return true;
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
    } else {
      console.error("Other error:", error.message);
    }
    return false;
  }
}