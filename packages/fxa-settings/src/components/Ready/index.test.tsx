/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Ready from '.';
import { logViewEvent, usePageViewEvent } from '../../lib/metrics';

jest.mock('../../lib/metrics', () => ({
  logViewEvent: jest.fn(),
  usePageViewEvent: jest.fn(),
}));

describe('Ready', () => {
  const customServiceName = 'Example Service';
  const viewName = 'example.my-page';
  const actionName = 'my_page';

  it('renders as expected with default values', () => {
    render(<Ready viewName={viewName} />);

    const passwordResetConfirmation = screen.getByText(
      'Your password has been reset'
    );
    const serviceAvailabilityConfirmation = screen.getByText(
      'You’re now ready to use Account Settings'
    );
    const passwordResetContinueButton = screen.queryByText('Continue');

    expect(passwordResetContinueButton).not.toBeInTheDocument();
    expect(passwordResetConfirmation).toBeInTheDocument();
    expect(serviceAvailabilityConfirmation).toBeInTheDocument();
  });

  // it renders as expected with a custom service name.
  it('renders as expected when given a service name', () => {
    render(<Ready viewName={viewName} serviceName={customServiceName} />);

    const passwordResetConfirmation = screen.getByText(
      'Your password has been reset'
    );
    const serviceAvailabilityConfirmation = screen.getByText(
      `You’re now ready to use ${customServiceName}`
    );
    const passwordResetContinueButton = screen.queryByText('Continue');

    expect(passwordResetContinueButton).not.toBeInTheDocument();
    expect(passwordResetConfirmation).toBeInTheDocument();
    expect(serviceAvailabilityConfirmation).toBeInTheDocument();
  });

  it('renders as expected when given a service name and relier continue action', () => {
    render(
      <Ready
        viewName={viewName}
        serviceName={customServiceName}
        continueHandler={() => {
          console.log('beepboop');
        }}
      />
    );

    const passwordResetConfirmation = screen.getByText(
      'Your password has been reset'
    );
    const serviceAvailabilityConfirmation = screen.getByText(
      `You’re now ready to use ${customServiceName}`
    );
    const passwordResetContinueButton = screen.getByText('Continue');

    expect(passwordResetContinueButton).toBeInTheDocument();
    expect(passwordResetConfirmation).toBeInTheDocument();
    expect(serviceAvailabilityConfirmation).toBeInTheDocument();
  });

  it('emits a metrics event on render', async () => {
    render(<Ready viewName={viewName} />);
    expect(usePageViewEvent).toHaveBeenCalledWith(viewName, {
      entrypoint_variation: 'react',
    });
  });

  it('emits a metrics event when a user clicks `Continue`', async () => {
    render(
      <Ready
        viewName={viewName}
        baseActionName={actionName}
        serviceName={customServiceName}
        continueHandler={() => {
          console.log('beepboop');
        }}
      />
    );
    const passwordResetContinueButton = screen.getByText('Continue');
    const clickViewName = `${viewName}.continue`;
    const fullActionName = `${actionName}_continue`;
    fireEvent.click(passwordResetContinueButton);
    expect(logViewEvent).toHaveBeenCalledWith(clickViewName, fullActionName, {
      entrypoint_variation: 'react',
    });
  });
});