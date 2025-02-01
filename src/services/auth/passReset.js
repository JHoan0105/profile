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
export default async function resetPass(e, p, t) {
  console.log("resetPass");
  console.log("email", e);
  console.log("password", p);
  console.log("token", t);
    try {
        const verify = await axios.post(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/passwordreset`,
            {
                email: e,
                password: p,
                token: t,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
                    //JWT not available since user is not login
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