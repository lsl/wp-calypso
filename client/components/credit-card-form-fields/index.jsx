/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';
import { isEmpty, noop } from 'lodash';

/**
 * Internal dependencies
 */
import CreditCardNumberInput from 'components/upgrades/credit-card-number-input';
import PaymentCountrySelect from 'components/payment-country-select';
import EbanxPaymentFields from 'my-sites/checkout/checkout/ebanx-payment-fields';
import { Input } from 'my-sites/domains/components/form';
import InfoPopover from 'components/info-popover';
import { maskField, unmaskField, getCreditCardType } from 'lib/checkout';
import { shouldRenderAdditionalEbanxFields } from 'lib/checkout/ebanx';

export class CreditCardFormFields extends React.Component {
	static propTypes = {
		card: PropTypes.object.isRequired,
		countriesList: PropTypes.array.isRequired,
		eventFormName: PropTypes.string,
		onFieldChange: PropTypes.func,
		getErrorMessage: PropTypes.func,
		autoFocus: PropTypes.bool,
		isNewTransaction: PropTypes.bool,
	};

	static defaultProps = {
		eventFormName: 'Credit card input',
		onFieldChange: noop,
		getErrorMessage: noop,
		autoFocus: true,
		isNewTransaction: false,
	};

	createField = ( fieldName, componentClass, props ) => {
		const errorMessage = this.props.getErrorMessage( fieldName ) || [];
		return React.createElement(
			componentClass,
			Object.assign(
				{},
				{
					additionalClasses: 'credit-card-form-fields__field',
					eventFormName: this.props.eventFormName,
					isError: ! isEmpty( errorMessage ),
					errorMessage: errorMessage[ 0 ],
					name: fieldName,
					onBlur: this.handleFieldChange,
					onChange: this.handleFieldChange,
					value: this.getFieldValue( fieldName ),
					autoComplete: 'off',
				},
				props
			)
		);
	};

	getFieldValue = fieldName => this.props.card[ fieldName ] || '';

	updateFieldValues = ( fieldName, nextValue ) => {
		const previousValue = this.getFieldValue( fieldName );

		if ( previousValue === nextValue ) {
			return;
		}

		const { onFieldChange } = this.props;

		const rawDetails = {
			[ fieldName ]: unmaskField( fieldName, previousValue, nextValue ),
		};

		const maskedDetails = {
			[ fieldName ]: maskField( fieldName, previousValue, nextValue ),
		};

		if ( fieldName === 'number' ) {
			rawDetails.brand = getCreditCardType( rawDetails[ fieldName ] );
		}

		onFieldChange( rawDetails, maskedDetails );
	};

	handleFieldChange = event => {
		this.updateFieldValues( event.target.name, event.target.value );
	};

	shouldRenderEbanxFields() {
		// The add/update card endpoints do not process Ebanx payment details
		// so we only show Ebanx fields at checkout,
		// i.e., when there is a current transaction.
		return (
			this.props.isNewTransaction &&
			shouldRenderAdditionalEbanxFields( this.getFieldValue( 'country' ) )
		);
	}

	render() {
		const { translate, countriesList, autoFocus } = this.props;
		const ebanxDetailsRequired = this.shouldRenderEbanxFields();
		const creditCardFormFieldsExtrasClassNames = classNames( {
			'credit-card-form-fields__extras': true,
			'ebanx-details-required': ebanxDetailsRequired,
		} );

		return (
			<div className="credit-card-form-fields">
				{ this.createField( 'name', Input, {
					autoFocus,
					label: translate( 'Name on Card', {
						context: 'Card holder name label on credit card form',
					} ),
				} ) }

				{ this.createField( 'number', CreditCardNumberInput, {
					inputMode: 'numeric',
					label: translate( 'Card Number', {
						context: 'Card number label on credit card form',
					} ),
				} ) }

				<div className={ creditCardFormFieldsExtrasClassNames }>
					{ this.createField( 'expiration-date', Input, {
						inputMode: 'numeric',
						label: translate( 'Expiry: MM/YY', {
							comment: 'Expiry label on credit card form',
						} ),
					} ) }

					{ this.createField( 'cvv', Input, {
						inputMode: 'numeric',
						label: translate(
							'CVV {{infoPopover}}{{image/}}This is the 3-digit number printed on the ' +
								'signature panel on the back of your card.{{/infoPopover}}',
							{
								context: '3 digit security number on credit card form',
								components: {
									infoPopover: (
										<InfoPopover position="top" className="credit-card-form-fields__cvv-info" />
									),
									image: (
										<img
											className="credit-card-form-fields__cvv-illustration"
											src="/calypso/images/upgrades/cc-cvv-back.svg"
											width="42"
											height="30"
											alt="Credit card CVV location illustration"
										/>
									),
								},
							}
						),
					} ) }

					{ this.createField( 'country', PaymentCountrySelect, {
						label: translate( 'Country' ),
						countriesList,
						onChange: noop,
						onCountrySelected: this.updateFieldValues,
					} ) }

					{ ebanxDetailsRequired ? (
						<EbanxPaymentFields
							countryCode={ this.getFieldValue( 'country' ) }
							countriesList={ countriesList }
							getErrorMessage={ this.props.getErrorMessage }
							getFieldValue={ this.getFieldValue }
							handleFieldChange={ this.updateFieldValues }
						/>
					) : (
						this.createField( 'postal-code', Input, {
							label: translate( 'Postal Code', {
								context: 'Postal code on credit card form',
							} ),
						} )
					) }
				</div>
			</div>
		);
	}
}

export default localize( CreditCardFormFields );
