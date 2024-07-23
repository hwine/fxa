/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.3.0. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * User clicks "Start browsing" on "Connect another device page"
 *
 * Generated from `cad.startbrowsing_submit`.
 */
export const startbrowsingSubmit = new EventMetricType(
  {
    category: 'cad',
    name: 'startbrowsing_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User clicks "connect another device" to proceed to "connect Firefox on another
 * device" screen with QR code
 *
 * Generated from `cad.submit`.
 */
export const submit = new EventMetricType(
  {
    category: 'cad',
    name: 'submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User views the Connect another device page after EITHER registering or signing
 * into Sync - this is only specific to the Sync flow
 *
 * Generated from `cad.view`.
 */
export const view = new EventMetricType(
  {
    category: 'cad',
    name: 'view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
