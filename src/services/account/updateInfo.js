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
export default async function updateInfo(i, fn, ln, p, tfa) {

    const controller = new AbortController();
    try {
        const verify = await axios.post(`${process.env.REACT_APP_CERTUS_API_URL}/userupdate`,
            {
                user: {
                    id: i,
                    firstname: fn,
                    lastname: ln,
                    position: p,
                    _2fa: tfa
                }
            },
            {
                signal: controller.signal,
                mode: "no-cors",
                credentials: "omit",
                referrerPolicy: "strict-origin-when-cross-origin",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
                },
            });
        switch (verify.status) {
            case 201:
            case 200: return true;
            default: return true;
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