/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import { LocationProvider } from '@reach/router';
import FlowRecoveryKeyInfo from '.';
import { Meta } from '@storybook/react';
import { useFtlMsgResolver } from '../../../models';
import { withLocalization } from '../../../../.storybook/decorators';

export default {
  title: 'Components/Settings/FlowRecoveryKeyInfo',
  component: FlowRecoveryKeyInfo,
  decorators: [withLocalization],
} as Meta;

export const Default = () => {
  const ftlMsgResolver = useFtlMsgResolver();
  const localizedPageTitle = ftlMsgResolver.getMsg(
    'recovery-key-create-page-title',
    'Account Recovery Key'
  );

  return (
    <LocationProvider>
      <FlowRecoveryKeyInfo
        localizedPageTitle={localizedPageTitle}
        navigateBackward={() => {
          alert('navigating to previous page');
        }}
        navigateForward={() => {
          alert('navigating to next view within wizard');
        }}
      />
    </LocationProvider>
  );
};
