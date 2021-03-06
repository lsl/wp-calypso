/** @format */

/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { REASON_AUTO_RENEWAL_FAILURE } from './constants';

/**
 * Retrieves information about whether an immediate login attempt was made for
 * the current instance of Calypso.
 *
 * @param  {Object} state - Global state tree
 * @return {bool} - Whether the client request indicates that an immediate
 *                  login attempt was made
 */
export const wasImmediateLoginAttempted = state => {
	return get( state, 'immediateLogin.attempt', false );
};

/**
 * Retrieves information about whether an immediate login attempt was
 * successful (according to query parameters provided in the client request)
 * during the current instance of Calypso.
 *
 * This and the other selectors in this file are based on information provided
 * in the URL (which can be tampered with) so it should not be used to trust
 * that the immediate login actually occurred. However, it is appropriate to
 * use it to make user interface improvements for the immediate login scenario.
 *
 * @param {Object} state - Global state tree
 * @return {bool} - Whether the client request indicates that an immediate
 *                  login attempt was successful
 */
export const wasImmediateLoginSuccessfulAccordingToClient = state => {
	return get( state, 'immediateLogin.success', false );
};

/**
 * Retrieves the reason information provided in the query parameters of
 * immediate login request.
 *
 * @param  {Object} state - Global state tree
 * @return {?String} - Reason for immediate login, or null
 */
export const getImmediateLoginReason = state => {
	return get( state, 'immediateLogin.reason', null );
};

/**
 * Retrieves the email address used for the immediate login attempt, according
 * to query parameters provided in the client request.
 *
 * @param  {Object} state - Global state tree
 * @return {?String} - Email address used for the immediate login attempt, or
 *                     null
 */
export const getImmediateLoginEmail = state => {
	return get( state, 'immediateLogin.email', null );
};

/**
 * Retrieves the language code for the immediate login attempt, according
 * to query parameters provided in the client request.
 *
 * @param  {Object} state - Global state tree
 * @return {?String} - Two-letter code for the preferred language of the user
 *                     attempting to log in, or null
 */
export const getImmediateLoginLocale = state => {
	return get( state, 'immediateLogin.locale', null );
};

/**
 * Retrieves information about whether an immediate login attempt was made from
 * a link in an auto-renewal failure email (according to query parameters
 * provided in the client request) for the current instance of Calypso.
 *
 * @param {Object} state - Global state tree
 * @return {bool} - Whether the client request indicates that an immediate
 *                  login attempt was made from an auto-renewal failure email
 */
export const wasAutoRenewalFailureImmediateLoginAttempted = state => {
	return REASON_AUTO_RENEWAL_FAILURE === getImmediateLoginReason( state );
};
