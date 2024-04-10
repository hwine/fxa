/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { headers } from 'next/headers';
import Image from 'next/image';

import { formatPlanPricing } from '@fxa/payments/ui';
import { DEFAULT_LOCALE } from '@fxa/shared/l10n';

import {
  getCartData,
  getContentfulContent,
} from '../../../../../../_lib/apiClient';
import circledConfirm from '../../../../../../../images/circled-confirm.svg';
import { app } from '@fxa/payments/ui/server';

export const dynamic = 'force-dynamic';

type ConfirmationDetailProps = {
  title: string;
  detail1: string | Promise<string>;
  detail2: string;
};

const ConfirmationDetail = ({
  title,
  detail1,
  detail2,
}: ConfirmationDetailProps) => {
  return (
    <div className="row-divider-grey-200 pb-6 text-sm">
      <div className="font-semibold py-4">{title}</div>
      <div className="flex items-center justify-between text-grey-400">
        <span>{detail1}</span>
        <span>{detail2}</span>
      </div>
    </div>
  );
};

interface CheckoutParams {
  cartId: string;
  locale: string;
  interval: string;
  offeringId: string;
}

export default async function CheckoutSuccess({
  params,
}: {
  params: CheckoutParams;
}) {
  // Temporarily defaulting to `accept-language`
  // This to be updated in FXA-9404
  //const locale = getLocaleFromRequest(
  //  params,
  //  headers().get('accept-language')
  //);
  const locale = headers().get('accept-language') || DEFAULT_LOCALE;

  const contentfulDataPromise = getContentfulContent(params.offeringId, locale);
  const cartDataPromise = getCartData(params.cartId);
  const l10nPromise = app.getL10n(locale);
  const [contentful, cart, l10n] = await Promise.all([
    contentfulDataPromise,
    cartDataPromise,
    l10nPromise,
  ]);

  return (
    <>
      <section className="h-[640px]" aria-label="Payment confirmation">
        <div className="page-message-container row-divider-grey-200">
          <Image src={circledConfirm} alt="" className="w-16 h-16" />

          <h4 className="text-xl font-normal mx-0 mt-6 mb-3">
            {l10n.getString(
              'next-payment-confirmation-thanks-heading',
              'Thank you!'
            )}
          </h4>

          <p className="page-message">
            {l10n.getString(
              'next-payment-confirmation-thanks-subheading',
              {
                email: cart.email,
                product_name: contentful.purchaseDetails.productName,
              },
              `A confirmation email has been sent to ${cart.email} with details on how to get started with ${contentful.purchaseDetails.productName}.`
            )}
          </p>
        </div>

        <ConfirmationDetail
          title={l10n.getString(
            'next-payment-confirmation-order-heading',
            'Order details'
          )}
          detail1={l10n.getString(
            'next-payment-confirmation-invoice-number',
            {
              invoiceNumber: cart.invoiceNumber,
            },
            `Invoice #${cart.invoiceNumber}`
          )}
          detail2={l10n.getString(
            'next-payment-confirmation-invoice-date',
            {
              invoiceDate: l10n.getLocalizedDate(cart.createdAt / 1000),
            },
            l10n.getLocalizedDateString(cart.createdAt / 1000)
          )}
        />

        <ConfirmationDetail
          title={l10n.getString(
            'next-payment-confirmation-details-heading-2',
            'Payment information'
          )}
          detail1={l10n.getString(
            'next-payment-confirmation-amount',
            {
              amount: l10n.getLocalizedCurrency(
                cart.nextInvoice.totalAmount,
                cart.nextInvoice.currency
              ),
              interval: cart.interval,
            },
            formatPlanPricing(
              cart.nextInvoice.totalAmount,
              cart.nextInvoice.currency,
              cart.interval
            )
          )}
          detail2={l10n.getString(
            'next-payment-confirmation-cc-card-ending-in',
            {
              last4: cart.last4,
            },
            `Card ending in ${cart.last4}`
          )}
        />

        <a
          className="page-button"
          href={contentful.commonContent.successActionButtonUrl}
        >
          {contentful.commonContent.successActionButtonLabel ||
            l10n.getString(
              'next-payment-confirmation-download-button',
              'Continue to download'
            )}
        </a>
      </section>
    </>
  );
}