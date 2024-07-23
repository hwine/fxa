/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.3.0. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * User engaged the set password form after authenticating with third party auth
 *
 * Generated from `third_party_auth_set_password.engage`.
 */
export const engage = new EventMetricType(
  {
    category: 'third_party_auth_set_password',
    name: 'engage',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User submitted the set password form after authenticating with third party auth
 *
 * Generated from `third_party_auth_set_password.submit`.
 */
export const submit = new EventMetricType(
  {
    category: 'third_party_auth_set_password',
    name: 'submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User was able to successfully the set password form after authenticating with
 * third party auth
 *
 * Generated from `third_party_auth_set_password.success`.
 */
export const success = new EventMetricType(
  {
    category: 'third_party_auth_set_password',
    name: 'success',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User viewed the set password screen after authenticating with third party auth
 *
 * Generated from `third_party_auth_set_password.view`.
 */
export const view = new EventMetricType(
  {
    category: 'third_party_auth_set_password',
    name: 'view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
