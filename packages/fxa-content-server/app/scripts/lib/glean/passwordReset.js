/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v10.0.3. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * Create New Password Submit
 * User attemps to submit the create new password form'
 *
 * Generated from `password_reset.create_new_submit`.
 */
export const createNewSubmit = new EventMetricType(
  {
    category: 'password_reset',
    name: 'create_new_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Create New Password Success (FE)
 * View of the "Your Password has been reset" page'
 *
 * Generated from `password_reset.create_new_success_view`.
 */
export const createNewSuccessView = new EventMetricType(
  {
    category: 'password_reset',
    name: 'create_new_success_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Create New Password View
 * View of the create new password form (from the Forgot Password link)'
 *
 * Generated from `password_reset.create_new_view`.
 */
export const createNewView = new EventMetricType(
  {
    category: 'password_reset',
    name: 'create_new_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Forgot Password w/ Recovery Key Create New Password Submit
 * User attempts to submit the create new password form'
 *
 * Generated from `password_reset.recovery_key_create_new_submit`.
 */
export const recoveryKeyCreateNewSubmit = new EventMetricType(
  {
    category: 'password_reset',
    name: 'recovery_key_create_new_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Forgot Password Recovery Key Create New Password View
 * A view of the form to change the account password, viewable after submitting
 * a valid recovery key'
 *
 * Generated from `password_reset.recovery_key_create_new_view`.
 */
export const recoveryKeyCreateNewView = new EventMetricType(
  {
    category: 'password_reset',
    name: 'recovery_key_create_new_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Forgot Password w/ Recovery Key Create New Password Success (FE)
 * User successfully submits a new password and views the "your password has
 * been reset" page'
 *
 * Generated from `password_reset.recovery_key_create_success_view`.
 */
export const recoveryKeyCreateSuccessView = new EventMetricType(
  {
    category: 'password_reset',
    name: 'recovery_key_create_success_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Forgot Password Confirm Recovery Key Submit
 * Submit the form of recovery key for forgot password flow.'
 *
 * Generated from `password_reset.recovery_key_submit`.
 */
export const recoveryKeySubmit = new EventMetricType(
  {
    category: 'password_reset',
    name: 'recovery_key_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Forgot Password Confirm Recovery Key View
 * A view of the form to confirm recovery key through the forgot password form.'
 *
 * Generated from `password_reset.recovery_key_view`.
 */
export const recoveryKeyView = new EventMetricType(
  {
    category: 'password_reset',
    name: 'recovery_key_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Create New Password Submit
 * Submit the create new password form'
 *
 * Generated from `password_reset.submit`.
 */
export const submit = new EventMetricType(
  {
    category: 'password_reset',
    name: 'submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Password Reset View
 * View of the form asking the user to confirm that they want to reset.'
 *
 * Generated from `password_reset.view`.
 */
export const view = new EventMetricType(
  {
    category: 'password_reset',
    name: 'view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
