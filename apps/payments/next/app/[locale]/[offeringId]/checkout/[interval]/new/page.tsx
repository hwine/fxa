/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { app } from '@fxa/payments/ui/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface CheckoutNewParams {
  locale: string;
  offeringId: string;
  interval: string;
}

export default async function CheckoutNew({
  params,
}: {
  params: CheckoutNewParams;
}) {
  const { offeringId, interval } = params;
  const ip = (headers().get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
  const cartService = await app.getCartService();
  const { id: cartId } = await cartService.setupCart({
    interval,
    offeringConfigId: offeringId,
    ip,
  });

  redirect(`${cartId}`);
}
