/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'contexts/AuthContext';

//CLEAN UP on Logging user out // User failed Auth
export default function OnLogOut() {
    const { accountInfo } = useContext(AuthContext);
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    sessionStorage.clear();
    accountInfo.current = {};
    const navOut = useNavigate('/auth')
    navOut();
}
