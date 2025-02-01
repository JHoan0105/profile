/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Default function
const getAccountInfo = () => {
  /*  const tokenCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      const [header, payload, signature] = token.split(".");
  
      // Decode the payload (middle part of the token)
      const decodedPayload = atob(payload);
      try {
        const decodedToken = JSON.parse(decodeURIComponent(decodedPayload));
        return decodedToken;
      } catch (error) {
        console.error('Error decoding token:', error);
        // Navigate to login screen here
        window.location.href = '/login'; // Change the path as per your application
  
        return null;
      }
    }
    // Navigate to login screen if token is not found
    window.location.href = '/login'; // Change the path as per your application
    return null;
  };*/
  return {
    email: 'user@gmail.com',
    firstName: 'user',
    lastName: 'new',
    is2FactorEnabled: false,
    isGuardianAdmin: true,
    accountNumber: '12345678',
  }
}

export default getAccountInfo;