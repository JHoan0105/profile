/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
import checkAccountNumber from 'services/account/checkAccountNumber'
import checkIMEI from 'services/device/checkIMEI'
import getDeviceProfile from 'services/device/getDeviceProfile'
import { log2 } from 'mathjs';

export function activeDevice(s) {
    if (typeof (s) !== "string") return "Invalid Type";
    const testString = /active/gi
    return s.match(testString);
}
export function restrictedError(s){
    if (typeof (s) !== "string") return 'Invalid Type';
    const testString = /RESTRICTED/gi
    return s.match(testString)
}
export function activeSIM(s) {
    if (typeof (s) !== 'string') return 'Invalid Type';
    const testString = /SIM of active/gi
    return s.match(testString);
}
export function missingFields(s) {
    if (typeof (s) !== 'string') return 'Invalid Type';
    const testString = /MISSING/gi
    return s.match(testString);
}
export function dupIMEI(s){
    if(typeof(s)!=='string') return 'Invalid Type';
    const testString =/IMEI/gi
    return s.match(testString)
}

export function dupSIM(s){
    if(typeof(s)!=='string') return 'Invalid Type';
    const testString = /SIM/gi
    return s.match(testString)
}
export function dupESN(s){
    if(typeof(s)!=='string') return 'Invalid Type';
    const testString =/ESN/gi
    return s.match(testString)
}
export function devMarketType(s){
    if(typeof(s)!=='string') return 'Invalid Type';
    const testString = /market type/gi
    return s.match(testString);
}

export function validateIMEI(i){
    const numRegEx = /^\d{0,15}$/
    if(!numRegEx.test(i) ) return false;
    if(i.length<15 || i ===undefined || i==='') return -1;
    return true;
}

export async function validateAccountNumber(a){
    const accountNumRegEx = /^[1-9]\d{0,7}$/;
    if(a.length <8) return -1
    if(!accountNumRegEx.test(a)) return false;
    return await checkAccountNumber(a);
    
}

export function alphaNumberic(s='') {
    const testString = /^[a-zA-Z0-9_]+$/
    if (testString.test(s) || s==='')
        return true;
    else
        return false;
}
export function numbersOnly(num=''){
    const numberRegX = /^(?:\d+|)$/
    if (numberRegX.test(num) || num==='') {
        return true
    } else {
        return false;
    }
}
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export function passwordValidator(p) {
  console.log("password", p);

  // Define the character pool size
  const poolSize = 26 + 26 + 10 + 21; // lowercase, uppercase, digits, symbols

  // Calculate the entropy
  const entropy = log2(Math.pow(poolSize, p.length));

  console.log("entropy: ", entropy);

  if (entropy >= 75) {
    console.log("password : true");
    // Password meets the requirements
    return p;
  } else {
    console.log("password: false");
    // Password does not meet the requirements
    return false;
  }
}

export function emailValidator(e) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(e)) {
        return e;
    } else {
        return false;
    }
}
// Validate user integer input with number of digits limit
export function integerInputValidator(value, maxLeftDigits=1){

    const isValidInput = new RegExp(`\\d{0,${maxLeftDigits}}`); // regex for integer number
    if (isValidInput.test(value)) {
        return value;
    } else {
        return false;
    }

};
//Default currency 18 digits with 2 precision point
export function decimalInputValidator(value, maxLeftDigits=10, maxPrecision=6){
    // Validate input to allow only decimal with max specified digits to the left and specified decimal points
    const isValidInput = new RegExp(`^\\d{0,${maxLeftDigits}}(\\.\\d{0,${maxPrecision}})?$`) // Check if the input is valid
    if (isValidInput.test(value)) {
        return value;
    } else {
        return false;
    }

};

export function handleCurrencyInputChange(value, maxLeftDigits=13, maxPrecision = 2){
    // Remove the dollar sign if present
    const tempValue = value.replace('$', '');
    // Validate input to allow only decimal with max specified digits to the left and specified decimal points
    const isValidInput = new RegExp(`^\\d{0,${maxLeftDigits}}(\\.\\d{0,${maxPrecision}})?$`); // Check if the input is valid
    if (isValidInput.test(tempValue)) {
        return value;
    } else {
        return false;
    }


    // Update state based on input name

};