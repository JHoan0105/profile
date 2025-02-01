/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

export const formatIridiumPhoneNumber = (phoneNumberString) => {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{4})(\d{4})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  // we use 1000 bytes unit
  //const k = 1024
  const k = 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const formatToMB = (bytes) => {
  if (!+bytes) return 0

  // we use 1000 bytes unit
  //const k = 1024
  const k = 1000000

  return `${parseFloat((bytes / k).toFixed(2))}`
}

export const randomNumber = (numberSet = 8) => {
  const randomNumber = Math.random().toString().slice(2, numberSet);
  return randomNumber;
}

export const randomColor = () => {

  const randomColor = Math.floor(Math.random() * 0xFFFFFF);
  // Convert the number to a hexadecimal string and pad it with leading zeros if needed
  // const hexColor = '#' + randomColor.toString(16).padStart(6, '0');
  return randomColor;
}

export const formatYearMonth = (date) => {
  if (!(date instanceof Date)) return 'Invalid Date';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}/${month}`;
};

export const formatDate = (date) => {
  if (!(date instanceof Date)) return 'Invalid Date';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTime = (dateTime) => {
  if (!(dateTime instanceof Date)) return 'Invalid Time'
  return dateTime.toLocaleTimeString();
}

export const formatDateTime = (dateTime) => {
  if (!(dateTime instanceof Date)) return 'Invalid DateTime';
  return formatDate(dateTime) + "@" + formatTime(dateTime) + "\n"
}
export const formatDateTimeString = (dateTime) => {
  if (!(dateTime instanceof Date)) return 'Invalid DateTime';
  // Format the date part
  const optionsDate = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  // Format the time part with timezone
  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short' // This gets the timezone abbreviation
  };
  let formattedDate;
  let formattedTime
  try {
    formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(dateTime);
    formattedTime = dateTime.toLocaleTimeString('en-US', optionsTime);
  }
  catch (error) {
   //console.log(error)
  }
  return `${formattedDate} at ${formattedTime}`;
}


export const hasPast12Hours = (dateTime) => {
  if (!(dateTime instanceof Date)) return 'Invalid DateTime';
  const now = new Date();
  const twelveHoursInMillis = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  const timeDifference = dateTime - now;

  return timeDifference <= 0 && Math.abs(timeDifference) <= twelveHoursInMillis;
}