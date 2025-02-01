/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

export function encodeIt(s) {
    return btoa(encodeURIComponent(s))
}
export function decodeIt(s) {
    return decodeURIComponent(atob(s));
}

export function jsonIt(s) {
    return JSON.parse(s)
}
export function jsonToString(o) {
    return JSON.stringify(o)
}