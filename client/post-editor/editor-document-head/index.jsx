/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import localize from 'lib/mixins/i18n/localize';
import DocumentHead from 'components/data/document-head';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getEditorPostId, isEditorNewPost } from 'state/ui/editor/selectors';
import { getEditedPostValue } from 'state/posts/selectors';
import { getPostType } from 'state/post-types/selectors';

function EditorDocumentHead( { translate, type, typeObject, newPost } ) {
	let title;
	if ( 'post' === type ) {
		if ( newPost ) {
			title = translate( 'New Post', { textOnly: true } );
		} else {
			title = translate( 'Edit Post', { textOnly: true } );
		}
	} else if ( 'page' === type ) {
		if ( newPost ) {
			title = translate( 'New Page', { textOnly: true } );
		} else {
			title = translate( 'Edit Page', { textOnly: true } );
		}
	} else if ( newPost ) {
		if ( typeObject ) {
			title = typeObject.labels.new_item;
		} else {
			title = translate( 'New', { textOnly: true } );
		}
	} else if ( typeObject ) {
		title = typeObject.labels.edit_item;
	} else {
		title = translate( 'Edit', { textOnly: true } );
	}

	return <DocumentHead title={ title } />;
}

EditorDocumentHead.propTypes = {
	translate: PropTypes.func,
	type: PropTypes.string,
	typeObject: PropTypes.object,
	newPost: PropTypes.bool
};

export default connect( ( state ) => {
	const siteId = getSelectedSiteId( state );
	const postId = getEditorPostId( state );
	const type = getEditedPostValue( state, siteId, postId, 'type' );

	return {
		type,
		typeObject: getPostType( state, siteId, type ),
		newPost: isEditorNewPost( state )
	};
} )( localize( EditorDocumentHead ) );
