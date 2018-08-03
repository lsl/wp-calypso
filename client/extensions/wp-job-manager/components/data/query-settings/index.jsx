/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { isFetchingSettings } from '../../../state/settings/selectors';
import { fetchSettings } from '../../../state/settings/actions';

class QuerySettings extends Component {
	static propTypes = {
		fetchSettings: PropTypes.func,
		fetchingSettings: PropTypes.bool,
		siteId: PropTypes.number,
	};

	UNSAFE_componentWillMount() {
		this.fetchSettings( this.props );
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		const { siteId } = this.props;

		if ( ! nextProps.siteId || siteId === nextProps.siteId ) {
			return;
		}

		this.fetchSettings( nextProps );
	}

	fetchSettings( props ) {
		const { fetchingSettings, siteId } = props;

		if ( ! fetchingSettings && siteId ) {
			props.fetchSettings( siteId );
		}
	}

	render() {
		return null;
	}
}

export default connect(
	( state, { siteId } ) => ( { fetchingSettings: isFetchingSettings( state, siteId ) } ),
	{ fetchSettings }
)( QuerySettings );
