/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import _ from 'underscore';
import { assert } from 'chai';
import Account from 'models/account';
import Backbone from 'backbone';
import BaseBroker from 'models/auth_brokers/base';
import Metrics from 'lib/metrics';
import Relier from 'models/reliers/relier';
import SentryMetrics from 'lib/sentry';
import sinon from 'sinon';
import User from 'models/user';
import View from 'views/post_verify/cad_qr/get_started';
import WindowMock from '../../../../mocks/window';
import $ from 'jquery';
import { MOZ_ORG_SYNC_GET_STARTED_LINK } from '../../../../../../app/scripts/lib/constants';

describe('views/post_verify/cad_qr/get_started', () => {
  let account;
  let broker;
  let metrics;
  let model;
  let notifier;
  let relier;
  let sentryMetrics;
  let user;
  let view;
  let windowMock;

  beforeEach(() => {
    windowMock = new WindowMock();
    relier = new Relier({
      window: windowMock,
    });
    broker = new BaseBroker({
      relier,
      window: windowMock,
    });
    account = new Account({
      email: 'a@a.com',
      uid: 'uid',
    });
    model = new Backbone.Model({
      account,
    });
    notifier = _.extend({}, Backbone.Events);
    sentryMetrics = new SentryMetrics();
    metrics = new Metrics({ notifier, sentryMetrics });
    user = new User();
    view = new View({
      broker,
      metrics,
      model,
      notifier,
      relier,
      user,
    });

    sinon.stub(view, 'getSignedInAccount').callsFake(() => account);
    sinon.stub(account, 'createCadReminder').callsFake(() => Promise.resolve());

    return view.render().then(() => $('#container').html(view.$el));
  });

  afterEach(function () {
    metrics.destroy();
    view.remove();
    view.destroy();
  });

  describe('render', () => {
    it('renders the view', () => {
      assert.lengthOf(view.$('.cad-qr-get-started'), 1);
      assert.lengthOf(view.$('#fxa-cad-qr-get-started-header'), 1);
      assert.lengthOf(view.$('.graphic-laptop-mobile'), 1);
      assert.lengthOf(view.$('#submit-btn'), 1);
      assert.lengthOf(view.$('#maybe-later-link'), 1);
    });
  });

  describe('without an account', () => {
    beforeEach(() => {
      account = new Account({});
      sinon.spy(view, 'navigate');
      return view.render();
    });

    it('redirects to the email first page', () => {
      assert.isTrue(view.navigate.calledWith('/'));
    });
  });

  describe('submit', () => {
    describe('success', () => {
      beforeEach(() => {
        sinon.spy(view, 'navigate');
        return view.submit();
      });

      it('redirects to ready to scan', () => {
        assert.isTrue(
          view.navigate.calledWith('/post_verify/cad_qr/ready_to_scan')
        );
      });
    });
  });

  describe('click maybe later', () => {
    describe('success', () => {
      beforeEach(() => {
        sinon.spy(view, 'navigateAway');
        return view.clickMaybeLater();
      });

      it('calls correct methods', () => {
        assert.isTrue(account.createCadReminder.calledOnce);
        assert.isTrue(
          view.navigateAway.calledOnceWith(MOZ_ORG_SYNC_GET_STARTED_LINK)
        );
      });
    });
  });
});
