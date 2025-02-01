/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Notes: Hide visibility in src/components/sidebar/components/Links.js

// Guardian imports
// Auth / SignIn
import SignInCentered from 'views/auth/signIn/SignInCentered.jsx';
import NewUserPassword from 'views/auth/newUser/NewUserPassword';
import ForgotPasswordCentered from 'views/auth/forgotPassword/ForgotPasswordCentered.jsx';
import ForgotPasswordRecovery from 'views/auth/forgotPassword/ForgotPasswordRecover.jsx';
import RecoveryEmailSent from 'views/auth/forgotPassword/RecoveryEmailSent.jsx';
import VerificationCentered from 'views/auth/verification/VerificationCentered.jsx';


// Error page
import ErrorPage from 'views/Error.jsx'

// Main / Dashboard
import DashboardMain from 'views/main/dashboard';
import Releases from 'views/main/release'

// Device Provisioning
import DeviceList from 'views/admin/devices/list'
import DeviceView from 'views/admin/devices/view'
import DeviceCreate from 'views/admin/devices/view/components/create'

// Alert Rules
import AlertRules from 'views/admin/alertrules/list'
import AlertRulesView from 'views/admin/alertrules/view';
import AlertRulesCreate from 'views/admin/alertrules/view/CreateAlertRule.jsx';

// Main / Usages
import DeviceUsage from 'views/main/usages/list'

// Admin / Manage Account
import AccountList from 'views/admin/manageaccount/list';
import AccountView from 'views/admin/manageaccount/view'
import CreateAccount from 'views/admin/manageaccount/createaccount'

// Admin / Users
import UsersList from 'views/admin/users/list';
import AccountSettings from 'views/admin/users/view'
import CreateNewUser from 'views/admin/users/createNewUser';

// Admin / Data Service
import DataServiceList from 'views/admin/dataservice/list';
import DataServiceView from 'views/admin/dataservice/view';

// Admin / Voice Service
import VoiceServiceList from 'views/admin/voiceservice/list';
import VoiceServiceView from 'views/admin/voiceservice/view';


// Admin / Service Plan
import ServicePlanList from 'views/admin/serviceplan/list';
import ServicePlanView from 'views/admin/serviceplan/view';

import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdLock, MdManageAccounts, MdAdminPanelSettings } from 'react-icons/md';

const routes = [
  // // --- System Admin ---
  {
    name: 'Main',
    path: '/main/account',
    icon: (
      <Icon
        as={MdAdminPanelSettings}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    collapse: true,
    items: [
      {
        name: 'Dashboard',
        layout: '/main',
        path: '/dashboard',
        exact: false,
        component: <DashboardMain />,
      },
      {
        name: 'Device Provisioning',
        layout: '/admin',
        path: '/devices',
        exact: false,
        component: <DeviceList />,
      },
      {
        name: 'Alert Rules',
        layout: '/admin',
        path: '/alertrules/list',
        exact: false,
        component: <AlertRules />,
      },
      {
        name: 'Usages',
        layout: '/main',
        path: '/usages/list',
        exact: false,
        component: <DeviceUsage />,
      },
      // Invisible items in the sidebar
      {
        name: 'Device View',
        layout: '/admin',
        path: '/devices/view',
        exact: false,
        component: <DeviceView />,
      },
      {
        name: 'New Device',
        layout: '/admin',
        path: '/devices/create',
        exact: false,
        component: <DeviceCreate />,
      },
      {
        name: 'Alert Rules ',
        layout: '/admin',
        path: '/alertrules/view',
        exact: false,
        component: <AlertRulesView />,
      },
      {
        name: 'Create Alert Rules',
        layout: '/admin',
        path: '/alertrules/create',
        exact: false,
        component: <AlertRulesCreate />,
      },
      {
        name: 'Release',
        layout: '/main',
        path: '/release',
        exact: false,
        component: <Releases />,
      },
    ]
  },
  // // --- Customer Administrator ---
  {
    name: 'Administrator',
    path: '/admin/account',
    icon: (
      <Icon
        as={MdManageAccounts}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    collapse: true,
    items: [
      {
        name: 'Account Numbers',
        layout: '/admin',
        path: '/manageaccount/list',
        exact: false,
        component: <AccountList />,
      },
      {
        name: 'User',
        layout: '/admin',
        path: '/users/list',
        exact: false,
        component: <UsersList />,
      },
      {
        name: 'Certus Data Service',
        layout: '/admin',
        path: '/dataservice/list',
        exact: false,
        component: <DataServiceList />,
      },
      {
        name: 'Certus Voice Service',
        layout: '/admin',
        path: '/voiceservice/list',
        exact: false,
        component: <VoiceServiceList />,
      },
      {
        name: 'Service Plan',
        layout: '/admin',
        path: '/serviceplan/list',
        exact: false,
        component: <ServicePlanList />,
      },
      // Invisible items in the sidebar
      {
        name: 'User \'s Settings',
        layout: '/admin',
        path: '/users/view',
        exact: false,
        component: <AccountSettings />,
      },
      {
        name: 'Create New User',
        layout: '/admin',
        path: '/users/create',
        exact: false,
        component: <CreateNewUser />,
      },
      {
        name: 'Account Number',
        layout: '/admin',
        path: '/manageaccount/view',
        exact: false,
        component: <AccountView />,
      },
      {
        name: 'Create Account',
        layout: '/admin',
        path: '/manageaccount/createaccount',
        exact: false,
        component: <CreateAccount />,
      },
      {
        name: 'Certus Data Service ',
        layout: '/admin',
        path: '/dataservice/view',
        exact: false,
        component: <DataServiceView />,
      },
      {
        name: 'Certus Data Service ',
        layout: '/admin',
        path: '/dataservice/create',
        exact: false,
        component: <DataServiceView />,
      },
      {
        name: 'Certus Voice Service ',
        layout: '/admin',
        path: '/voiceservice/view',
        exact: false,
        component: <VoiceServiceView />,
      },
      {
        name: 'Service Plan ',
        layout: '/admin',
        path: '/serviceplan/view',
        exact: false,
        component: <ServicePlanView />,
      },
      {
        name: 'Service Plan ',
        layout: '/admin',
        path: '/serviceplan/create',
        exact: false,
        component: <ServicePlanView />,
      },
      {
        name: 'User \'s Settings',
        layout: '/main',
        path: '/users/view',
        exact: false,
        component: <AccountSettings />,
      },
    ]
  },
  {
    // --- Error Page ---
    name: 'Error',
    path: '/error',
    collapse: true,
    items: [
      {
        name: 'Error',
        layout: '/',
        path: '/error',
        component: <ErrorPage />,
      }
    ]
  },
  // --- Authentication ---
  {
    name: 'Authentication',
    path: '/auth',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      // --- Sign In ---
      {
        name: 'Sign In',
        path: '/sign-in',
        collapse: true,
        items: [
          {
            name: 'Centered',
            layout: '/auth',
            path: '/sign-in',
            component: <SignInCentered />,
          },
        ],
      },
      // --- Sign Up ---
      {
        name: 'Sign Up',
        path: '/sign-up',
        collapse: true,
        items: [
          {
            name: 'NewUser',
            layout: '/auth',
            path: 'users/newaccount',
            exact: false,
            component: <NewUserPassword />,
          },
        ],
      },
      // --- Verification ---
      {
        name: 'Verification',
        path: '/verification',
        collapse: true,
        items: [
          {
            name: 'Centered',
            layout: '/auth',
            path: '/verification',
            component: <VerificationCentered />,
          },
        ],
      },
      // --- Forgot Password ---
      {
        name: 'Forgot Password',
        path: '/forgot-password',
        collapse: true,
        items: [
          {
            name: 'Centered',
            layout: '/auth',
            path: '/forgot-password',
            component: <ForgotPasswordCentered />,
          },
          {
            name: 'Recover',
            layout: '/auth',
            path: '/forgot-password/recovery',
            component: <ForgotPasswordRecovery />,
          },
          {
            name: 'RecoverySent',
            layout: '/auth',
            path: '/forgot-password/Sent',
            component: <RecoveryEmailSent />,
          },
        ],
      },
    ],
  },
];

export default routes;
