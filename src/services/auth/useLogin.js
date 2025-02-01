/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Default function
export default async function useLogin(e, p) {
    console.log("process.env.REACT_APP_PROVISIONING_PORTAL_API_URL: ", process.env.REACT_APP_PROVISIONING_PORTAL_API_URL)
    const controller = new AbortController();
    try {
      const response = await fetch(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/login`, {
            signal: controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'localhost:3005',
                'Origin': `localhost:3000`,
            },
            body: `email=${e}&password=${p}`,
        });

        switch (response.status) {
            case 201:
            case 200:
                console.log('Authentication successful');
                break;
            case 401:
                const errorData = await response.json();
                console.log('Access blocked:', errorData.error);
                return { error: 'Access blocked', message: errorData.error };
            default:
                console.log('Unknown error test');
                // Return error object with message
                return { error: 'Unauthorized', message: 'Invalid login!' };
        }

        if (response.ok) {
            const res = await response.json();
            console.log("res.timeout", res.timeout);
            var expirationTime = new Date(Date.now() + (res.timeout * 1000)); // res.timeout is in seconds * 1000 milliseconds per second
            var expirationTimeString = expirationTime.toUTCString();
            console.log("expirationTime", expirationTimeString);
            //Store user info
            document.cookie = `token=${res.token}; expires=${expirationTimeString}; path=/;`;
            return { message: 'Valid login!' };
        } else {
            return null; // or handle other error cases
        }
    } catch (error) {
        console.error('Error during login:', error);
        return null; // or handle error cases
    }
}