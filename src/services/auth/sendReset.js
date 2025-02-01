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
export default async function changePass(e) {

    try{
        const verify = await axios.post(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/passwordforgot`,
                {
                  email: e,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6"
                        //JWT not available since user is not login
                    },
                    });
            switch(verify.status){
            case 201:
            case 200: return true;
            case 300:
            case 304: return true;
            default: return true;
            }

    }catch(error){
        // Handle errors
        return false;
      }
}