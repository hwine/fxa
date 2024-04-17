/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
  expect,
  test,
  PASSWORD,
  NEW_PASSWORD,
  FORCE_PWD_EMAIL_PREFIX,
} from '../../lib/fixtures/standard';

test.describe('severity-2 #smoke', () => {
  test.describe('post verify - force password change sync', () => {
    test.use({
      emailOptions: [
        { prefix: FORCE_PWD_EMAIL_PREFIX, password: NEW_PASSWORD },
      ],
    });
    test('force change password on login - sync', async ({
      emails,
      target,
      syncBrowserPages,
    }) => {
      const [email] = emails;
      await target.authClient.signUp(email, PASSWORD, {
        lang: 'en',
        preVerified: 'true',
      });
      const { page, login, postVerify, connectAnotherDevice } =
        syncBrowserPages;
      await page.goto(
        `${target.contentServerUrl}?context=fx_desktop_v3&service=sync`,
        {
          waitUntil: 'load',
        }
      );
      await login.fillOutEmailFirstSignIn(email, PASSWORD);
      await login.fillOutSignInCode(email);

      //Verify force password change header
      expect(await postVerify.isForcePasswordChangeHeader()).toBe(true);

      //Fill out change password
      await postVerify.fillOutChangePassword(PASSWORD, NEW_PASSWORD);
      await postVerify.submit();

      //Verify logged in on connect another device page
      await expect(connectAnotherDevice.fxaConnected).toBeEnabled();
    });
  });
});
