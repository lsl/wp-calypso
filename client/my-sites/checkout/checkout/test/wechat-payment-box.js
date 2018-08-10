/**
 * @format
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'lodash';

/**
 * Internal dependencies
 */
import { WechatPaymentBox } from '../wechat-payment-box';
import {
	PLAN_BUSINESS,
	PLAN_BUSINESS_2_YEARS,
	PLAN_PREMIUM,
	PLAN_PREMIUM_2_YEARS,
	PLAN_PERSONAL,
	PLAN_PERSONAL_2_YEARS,
	PLAN_FREE,
	PLAN_JETPACK_FREE,
	PLAN_JETPACK_PERSONAL,
	PLAN_JETPACK_PERSONAL_MONTHLY,
	PLAN_JETPACK_PREMIUM,
	PLAN_JETPACK_PREMIUM_MONTHLY,
	PLAN_JETPACK_BUSINESS,
	PLAN_JETPACK_BUSINESS_MONTHLY,
} from 'lib/plans/constants';

jest.mock( 'lib/cart-values', () => ( {
	isPaymentMethodEnabled: jest.fn( false ),
	paymentMethodName: jest.fn( false ),
	cartItems: {
		hasRenewableSubscription: jest.fn( false ),
		hasRenewalItem: jest.fn( false ),
	},
} ) );

jest.mock( 'i18n-calypso', () => ( {
	localize: x => x,
	translate: x => x,
} ) );

jest.mock( '../terms-of-service', () => {
	const react = require( 'react' );
	return class TermsOfService extends react.Component {};
} );

import TermsOfService from '../terms-of-service';

jest.mock( '../payment-chat-button', () => {
	const react = require( 'react' );
	return class PaymentChatButton extends react.Component {};
} );

import PaymentChatButton from '../payment-chat-button';


// Gets rid of warnings such as 'UnhandledPromiseRejectionWarning: Error: No available storage method found.'
jest.mock( 'lib/user', () => () => {} );

const defaultProps = {
	cart: {},
	translate: identity,
	countriesList: [
		{
			code: 'US',
			name: 'United States',
		},
		{
			code: 'CN',
			name: 'China',
		},
	],
	paymentType: 'default',
	transaction: {},
	redirectTo: () => 'http://here',
};

describe( 'WechatPaymentBox - Pay Box', () => {
	test( 'has correct components and css', () => {
		const wrapper = shallow( <WechatPaymentBox { ...defaultProps } /> );
		expect( wrapper.find( '.checkout__payment-box-section' ) ).toHaveLength( 1 );
		expect( wrapper.find( '.checkout__payment-box-actions' ) ).toHaveLength( 1 );
		expect( wrapper.find( '[name="name"]' ) ).toHaveLength( 1 );
		expect( wrapper.contains( <TermsOfService /> ) );
	} );

	const businessPlans = [ PLAN_BUSINESS, PLAN_BUSINESS_2_YEARS ];

	businessPlans.forEach( product_slug => {
		test( 'should render PaymentChatButton if any WP.com business plan is in the cart', () => {
			const props = {
				...defaultProps,
				presaleChatAvailable: true,
				cart: {
					products: [ { product_slug } ],
				},
			};
			const wrapper = shallow( <WechatPaymentBox { ...props } /> );
			expect( wrapper.contains( <PaymentChatButton /> ) );
		} );
	} );

	businessPlans.forEach( product_slug => {
		test( 'should not render PaymentChatButton if presaleChatAvailable is false', () => {
			const props = {
				...defaultProps,
				presaleChatAvailable: false,
				cart: {
					products: [ { product_slug } ],
				},
			};
			const wrapper = shallow( <WechatPaymentBox { ...props } /> );
			expect( ! wrapper.contains( <PaymentChatButton /> ) );
		} );
	} );

	const otherPlans = [
		PLAN_PREMIUM,
		PLAN_PREMIUM_2_YEARS,
		PLAN_PERSONAL,
		PLAN_PERSONAL_2_YEARS,
		PLAN_FREE,
		PLAN_JETPACK_FREE,
		PLAN_JETPACK_PERSONAL,
		PLAN_JETPACK_PERSONAL_MONTHLY,
		PLAN_JETPACK_PREMIUM,
		PLAN_JETPACK_PREMIUM_MONTHLY,
		PLAN_JETPACK_BUSINESS,
		PLAN_JETPACK_BUSINESS_MONTHLY,
	];

	otherPlans.forEach( product_slug => {
		test( 'should not render PaymentChatButton if only non-business plan products are in the cart', () => {
			const props = {
				...defaultProps,
				cart: {
					products: [ { product_slug } ],
				},
			};
			const wrapper = shallow( <WechatPaymentBox { ...props } /> );
			expect( ! wrapper.contains( <PaymentChatButton /> ) );
		} );
	} );
} );

describe( 'WechatPaymentBox - Source Response Handler', () => {
	test( 'redirect on mobile', () => {
		navigator.userAgent = "iOS safari";
		const wrapper = shallow( <WechatPaymentBox { ...defaultProps } /> );
		const instance = wrapper.instance();

		location.href = 'https://test';

		instance.handleTransactionResponse( null, {  redirect_url: 'https://redirect', order_id: 1 } );

		expect( location.href ).toEqual( 'https://redirect' );

	} );
	test( 'no redirect on desktop', () => {
		navigator.userAgent = "windows";
		const wrapper = shallow( <WechatPaymentBox { ...defaultProps } /> );
		const instance = wrapper.instance();

		location.href = 'https://test';

		const response = {  redirect_url: 'https://redirect', order_id: 1 };

		instance.handleTransactionResponse( null, response );

		expect( location.href ).toEqual( 'https://test' );

		expect( instance.state.redirectUrl ).toEqual( response.redirectUrl );
		expect( instance.state.orderId ).toEqual( response.order_id );

	} );

	test( 'enable pay button on error' , () => {
		const wrapper = shallow( <WechatPaymentBox { ...defaultProps } /> );
		const instance = wrapper.instance();

		instance.handleTransactionResponse( new Error( "error" ), null );

		expect( instance.state.submitEnabled ).toBe( true );
	});

// describe( 'WechatPaymentBox - QR Code Display', () => {
// 	test( 'display a qr code', () => {
// 		const wrapper = shallow( <WechatPaymentBox { ...defaultProps } /> );
// 		expect( wrapper.find( '.checkout__payment-box-section' ) ).toHaveLength( 1 );
// 		expect( wrapper.find( '.checkout__payment-box-actions' ) ).toHaveLength( 1 );
// 		expect( wrapper.find( 'TermsOfService' ) ).toHaveLength( 1 );
// 	} );

});
