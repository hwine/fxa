/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.3.0. DO NOT EDIT. DO NOT COMMIT.

import StringMetricType from '@mozilla/glean/private/metrics/string';

/**
 * A hex string of a sha256 hash of the account's uid
 *
 * Generated from `account.user_id_sha256`.
 */
export const userIdSha256 = new StringMetricType({
  category: 'account',
  name: 'user_id_sha256',
  sendInPings: ['accounts-events', 'events'],
  lifetime: 'application',
  disabled: false,
});
