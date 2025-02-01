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
export default async function accountPassSetup(email, accountNumber, password) {
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  try {
    const verify = await axios.post(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/accountRegister`,
    {
      email: email,
      account: accountNumber,
      password: password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
        "Authorization": `Bearer ${jwtToken}`,
      },
    });
    switch (verify.status) {
      case 201:
      case 200: return verify.data.status;
      default: return false;
    }
  } catch (error) {
    // Handle errors
    return false;
  }
}