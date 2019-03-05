import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';
import moment from 'moment';

export default class LinksListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            justCopied: false
        };
    }

    componentDidMount() {
        this.clipboard = new Clipboard(this.refs.copy);

        this.clipboard.on('success', () => {
            this.setState({ justCopied: true });
            setTimeout(() => this.setState({ justCopied: false }), 1000);
        }).on('error', () => {
            alert('Unable to copy. Please, manually copy the link.');
        })
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    renderStats() {
        const visitedCount = this.props.visitedCount;
        const visitMessage = visitedCount === 1 ? 'visit' : 'visits';

        const lastVisitedAt = this.props.lastVisitedAt;
        let visitedMessage = null;

        if (typeof lastVisitedAt === 'number') {
            visitedMessage = `(visited ${ moment(lastVisitedAt).fromNow() })`;
        }
        return <p className="item__message">{visitedCount} {visitMessage} {visitedMessage}</p>;
    }

    render() {
        const _id = this.props._id;
        const url = this.props.url;
        const shortUrl = this.props.shortUrl;
        const visible = this.props.visible;

        return (
            <div className="item">
                <h2>{url}</h2>
                <p className="item__message">{shortUrl}</p>
                {this.renderStats()}
                <a className="button button--pill button--link" href={shortUrl} target="_blank">
                    Visit
                </a>
                <button className="button button--pill" ref="copy" data-clipboard-text={shortUrl}>
                    { this.state.justCopied ? 'Copied' : 'Copy' }
                </button>
                <button className="button button--pill" onClick={() =>
                    Meteor.call('links.setVisibility', _id, !visible)
                }>
                    { visible ? 'Hide' : 'Unhide' }
                </button>
            </div>
        );
    }
}

LinksListItem.propTypes = {
    _id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    shortUrl: PropTypes.string.isRequired,
    visitedCount: PropTypes.number.isRequired,
    lastVisitedAt: PropTypes.number
}
