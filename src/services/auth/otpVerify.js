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
export default async function otpVerify(n, e) {
    const controller = new AbortController();
    const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    const accountInfo = getAccountInfo();
    const route = `${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/auth/otp/new`;

    try {      
        console.log(route);
        const send = await axios.post(route,
                {
                  origin: "FrontEnd ENVDEVJH",
                  username: accountInfo.email,
                  email: accountInfo.email,      
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

            switch(send.status){
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