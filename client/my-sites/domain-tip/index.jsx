/**
 * External dependencies
 */
import classNames from 'classnames';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import React from 'react';

/**
 * Internal dependencies
 */
import { abtest } from 'lib/abtest';
import { getSite, getSiteSlug } from 'state/sites/selectors';
import { getDomainsSuggestions, } from 'state/domains/suggestions/selectors';
import QueryDomainsSuggestions from 'components/data/query-domains-suggestions';
import UpgradeNudge from 'my-sites/upgrade-nudge';

function getQueryObject( site, siteSlug ) {
	if ( ! site || ! siteSlug ) {
		return null;
	}
	return {
		query: siteSlug.split( '.' )[ 0 ],
		quantity: 1,
		vendor: abtest( 'domainSuggestionVendor' )
	};
}

const DomainTip = React.createClass( {

	propTypes: {
		className: React.PropTypes.string,
		siteId: React.PropTypes.number.isRequired
	},

	getDefaultProps() {
		return {
			quantity: noop
		};
	},

	shouldDisplay() {
		return true;
	},

	render() {
		if ( ! this.props.site || this.props.site.jetpack || ! this.props.siteSlug ) {
			return null;
		}
		const classes = classNames( this.props.className, 'domain-tip' );
		const { query, quantity, vendor } = getQueryObject( this.props.site, this.props.siteSlug );
		const suggestion = this.props.suggestions ? this.props.suggestions[0] : null;
		return (
			<div className={ classes } >
				<QueryDomainsSuggestions
					query={ query }
					quantity={ quantity }
					vendor={ vendor } />
				{
					suggestion && <UpgradeNudge
						shouldDisplay={ this.shouldDisplay }
						event="domain-tip"
						feature="custom-domain"
						title={ this.translate( 'Get more readers by adding a custom domain name like %(domain)s.', { args: { domain: suggestion.domain_name } } ) }
						message={ this.translate( 'Personalize your site with its own unique web address. Register %(domain)s for free with a Premium Plan', { args: { domain: suggestion.domain_name } } ) }
						href={ `/domains/add/${ this.props.siteSlug }` }
					/>
				}
			</div>
		);
	}
} );

export default connect( ( state, ownProps ) => {
	const site = getSite( state, ownProps.siteId );
	const siteSlug = getSiteSlug( state, ownProps.siteId );
	const queryObject = getQueryObject( site, siteSlug );
	return {
		suggestions: queryObject && getDomainsSuggestions( state, queryObject ),
		site: site,
		siteSlug: siteSlug
	};
} )( DomainTip );
