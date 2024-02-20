/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import * as utils from 'fxa-react/lib/utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithLocalizationProvider } from 'fxa-react/lib/test-utils/localizationProvider'; // import { getFtlBundle, testAllL10n } from 'fxa-react/lib/test-utils';
// import { FluentBundle } from '@fluent/bundle';
import { usePageViewEvent } from '../../../lib/metrics';
import GleanMetrics from '../../../lib/glean';
import { viewName } from '.';
import { mockAppContext, mockSession } from '../../../models/mocks';
import { REACT_ENTRYPOINT } from '../../../constants';
import { Session, AppContext } from '../../../models';
import { SigninTokenCodeIntegration } from './interfaces';
import { Subject } from './mocks';
import { MOCK_SIGNUP_CODE } from '../../Signup/ConfirmSignupCode/mocks';
import { MOCK_EMAIL } from '../../mocks';
import { AuthUiErrors } from '../../../lib/auth-errors/auth-errors';
import VerificationReasons from '../../../constants/verification-reasons';

jest.mock('../../../lib/metrics', () => ({
  usePageViewEvent: jest.fn(),
  logViewEvent: jest.fn(),
}));

jest.mock('../../../lib/glean', () => ({
  __esModule: true,
  default: {
    loginConfirmation: {
      view: jest.fn(),
      submit: jest.fn(),
      success: jest.fn(),
    },
    isDone: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('@reach/router', () => ({
  ...jest.requireActual('@reach/router'),
  useNavigate: () => mockNavigate,
}));

let session: Session;
function render({
  integration,
  verificationReason,
}: {
  integration?: SigninTokenCodeIntegration;
  verificationReason?: VerificationReasons;
} = {}) {
  renderWithLocalizationProvider(
    <AppContext.Provider value={mockAppContext({ session })}>
      <Subject {...{ integration, verificationReason }} />
    </AppContext.Provider>
  );
}

describe('SigninTokenCode page', () => {
  beforeEach(() => {
    session = {
      verifySession: jest.fn().mockResolvedValue(true),
      sendVerificationCode: jest.fn().mockResolvedValue(true),
    } as unknown as Session;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TODO: enable l10n tests when they've been updated to handle embedded tags in ftl strings
  // TODO: in FXA-6461
  // let bundle: FluentBundle;
  // beforeAll(async () => {
  //   bundle = await getFtlBundle('settings');
  // });

  it('renders as expected', () => {
    render();
    // testAllL10n(screen, bundle);

    const headingEl = screen.getByRole('heading', { level: 1 });
    expect(headingEl).toHaveTextContent(
      'Enter confirmation code for your Mozilla account'
    );
    screen.getByText(
      `Enter the code that was sent to ${MOCK_EMAIL} within 5 minutes.`
    );
    screen.getByLabelText('Enter 6-digit code');
    screen.getByRole('button', { name: 'Confirm' });
    screen.getByRole('button', { name: 'Email new code.' });

    // initially hidden
    expect(screen.queryByRole('Code expired?')).not.toBeInTheDocument();
  });

  it('emits a metrics event on render', () => {
    render();
    expect(usePageViewEvent).toHaveBeenCalledWith(viewName, REACT_ENTRYPOINT);
    expect(GleanMetrics.loginConfirmation.view).toBeCalledTimes(1);
  });

  describe('handleResendCode submission', () => {
    async function renderAndResend() {
      render();
      await waitFor(() => {
        screen.getByText('Code expired?');
      });
      fireEvent.click(screen.getByRole('button', { name: 'Email new code.' }));
      await waitFor(() => {
        expect(session.sendVerificationCode).toHaveBeenCalled();
      });
    }
    it('on success, renders banner', async () => {
      session = mockSession();
      await renderAndResend();
      screen.getByText('Email resent.', { exact: false });
    });
    it('on throttled error, renders banner with throttled message', async () => {
      session = {
        sendVerificationCode: jest
          .fn()
          .mockRejectedValue(AuthUiErrors.THROTTLED),
      } as unknown as Session;
      await renderAndResend();
      screen.getByText('You’ve tried too many times. Please try again later.');
    });
    it('on other error, renders banner with expected default error message', async () => {
      session = {
        sendVerificationCode: jest.fn().mockRejectedValue(new Error()),
      } as unknown as Session;
      await renderAndResend();
      screen.getByText('Something went wrong. A new code could not be sent.');
    });
  });

  describe('onSubmit code submission', () => {
    function submit() {
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    }
    function submitCode(code = MOCK_SIGNUP_CODE) {
      fireEvent.change(screen.getByLabelText('Enter 6-digit code'), {
        target: { value: code },
      });
      submit();
    }
    describe('does not submit and displays tooltip', () => {
      beforeEach(() => {
        render();
      });
      async function expectNoSubmission() {
        await waitFor(() => {
          expect(session.verifySession).not.toHaveBeenCalled();
          expect(screen.getByTestId('tooltip')).toHaveTextContent(
            'Confirmation code required'
          );
          expect(GleanMetrics.loginConfirmation.submit).not.toBeCalled();
        });
      }
      it('if no input', async () => {
        submit();
        expectNoSubmission();
      });
      // Note, we don't have a test for more than 6 because the input doesn't allow this
      it('if input length is less than 6', async () => {
        // whitespace should get trimmed, so this should be a length of 5
        submitCode('12345 ');
        expectNoSubmission();
      });
      it('if input is not numeric', async () => {
        submitCode('1234z5');
        expectNoSubmission();
      });
      it('if input is scientific notation', async () => {
        submitCode('100e10');
        expectNoSubmission();
      });
    });
    it('on throttled error, renders banner with throttled message', async () => {
      session = {
        verifySession: jest.fn().mockRejectedValue(AuthUiErrors.THROTTLED),
      } as unknown as Session;
      render();
      submitCode();
      await screen.findByText(
        'You’ve tried too many times. Please try again later.'
      );
      expect(GleanMetrics.loginConfirmation.submit).toBeCalledTimes(1);
      expect(GleanMetrics.loginConfirmation.success).not.toBeCalled();
    });
    it('on other error, renders expected default error message in tooltip', async () => {
      session = {
        verifySession: jest
          .fn()
          .mockRejectedValue(AuthUiErrors.INVALID_EXPIRED_SIGNUP_CODE),
      } as unknown as Session;
      render();
      submitCode();
      expect(await screen.findByTestId('tooltip')).toHaveTextContent(
        'Invalid or expired confirmation code'
      );
      expect(GleanMetrics.loginConfirmation.submit).toBeCalledTimes(1);
      expect(GleanMetrics.loginConfirmation.success).not.toBeCalled();
    });

    describe('on success', () => {
      let hardNavigateToContentServerSpy: jest.SpyInstance;
      beforeEach(() => {
        hardNavigateToContentServerSpy = jest
          .spyOn(utils, 'hardNavigateToContentServer')
          .mockImplementation(() => {});
      });
      afterEach(() => {
        hardNavigateToContentServerSpy.mockRestore();
      });

      async function expectSuccessGleanEvents() {
        await waitFor(() => {
          expect(GleanMetrics.loginConfirmation.submit).toBeCalledTimes(1);
        });
        expect(GleanMetrics.loginConfirmation.success).toBeCalledTimes(1);
        expect(GleanMetrics.isDone).toBeCalledTimes(1);
      }
      it('default behavior', async () => {
        session = mockSession();
        render();
        submitCode();

        await expectSuccessGleanEvents();
        expect(mockNavigate).toHaveBeenCalledWith('/settings');
      });
      it('when verificationReason is a force password change', async () => {
        session = mockSession();
        render({ verificationReason: VerificationReasons.CHANGE_PASSWORD });
        submitCode();

        await expectSuccessGleanEvents();
        expect(hardNavigateToContentServerSpy).toHaveBeenCalledWith(
          '/post_verify/password/force_password_change'
        );
      });
      // it('with sync integration', () => {
      //   // TODO with sync ticket
      // });
      // it('with OAuth integration', () => {
      //   // TODO with OAuth
      // });
    });
  });
});
