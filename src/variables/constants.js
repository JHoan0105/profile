
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ACCOUNT_NUMBER_REGEX = /^[1-9]\d{0,7}$/;
export const MINIMUM_PASSWORD_REQ = 'Strong password required: Must be at least 12 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character.'
export const CHANGE_PASSWORD = 'Old password and new password cannot be the same.'
export const CONFIRM_PASSWORD = "Confirm password does not match."
export const ACCOUNT_8NUM_REGEX = /[^\d{8}]/;
export const MAX_ACTIVE_EMAILS = 5;


export const QUERY_STRING_PARAMS = {
  EMAIL: 'email',

}

export const UNIT = {
  MARKET_TYPE: {
    AVIATION: {
      ID: 'Certus Aviation',
      SUBMARKET_ID: "11567457074"
    },
    LANDMOBILE: {
      ID: 'Certus LandMobile',
      SUBMARKET_ID: "11567423394"
    }
  }
}

// Voice line constants
export const LINE = {
  PREPAID: 'PREPAID',
  POSTPAID: 'POSTPAID',
  SAFETY: 'SAFETY',
  STANDARD: 'STANDARD',
  HIGH: 'HIGH'
}

export const PATH_NAME = {
  SIGN: '/auth/sign-in',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RECOVER_PASSWORD: '/auth/forgot-password/recover',
  RECOVER_PASSWORD_SENT: '/auth/forgotpassword/Sent',
  MAIN_DASHBOARD: '/main/dashboard',
  USAGE: '/main/usages/list',
  RELEASES: '/main/release',
  USER_MAIN: '/main/users/view',
  ACCOUNT_NUMBERS: '/admin/manageaccount/list',
  USER_ADMIN: '/admin/users/view',
  USER_LIST: '/admin/users/list',
  USER_CREATE: '/admin/users/create',
  DEVICES_LIST: '/admin/devices',
  DEVICES_CREATE: '/admin/devices/create',
  DEVICE_VIEW: '/admin/devices/view',
  ALERT_LIST: '/admin/alertrules/list',
  ALERT_CREATE: '/admin/alertrules/create',
  DATA_SERVICE: '/admin/dataservice/list',
  DATA_SERVICE_CREATE: '/admin/dataservice/create',
  DATA_SERVICE_VIEW: '/admin/dataservice/view',
  VOICE_SERVICE: '/admin/voiceservice/list',
  VOICE_SERVICE_CREATE: '/admin/voiceservice/create',
  VOICE_SERVICE_VIEW: '/admin/voiceservice/view',
  SERVICE_PLAN: '/admin/serviceplan/list',
  SERVICE_PLAN_CREATE: '/admin/serviceplan/create',
  SERVICE_PLAN_VIEW: '/admin/serviceplan/view'
}