import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AttentionModal from './AttentionModal';
import { postRemoveAPIKey } from '../ajax';

class DeleteAPIKeyButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      modalOpen: false,
      error: null,
    };
    this.deleteAPIKey = this.deleteAPIKey.bind(this);
  }

  deleteAPIKey() {
    const { apikey, onDeletionComplete } = this.props;
    this.setState({ deleting: true });
    postRemoveAPIKey(apikey).then(() => {
      this.setState({ modalOpen: false });
      onDeletionComplete();
    }).catch((e) => {
      this.setState({ error: e.toString() });
    }).finally(() => this.setState({ deleting: false }));
  }

  render() {
    const { apikey } = this.props;
    const { deleting, modalOpen, error } = this.state;
    return (
      <div>
        <Button
          basic
          negative
          icon="close"
          content="DELETE"
          onClick={() => this.setState({ modalOpen: true })}
        />
        <AttentionModal
          open={modalOpen}
          waiting={deleting}
          error={error}
          onCancel={() => this.setState({ modalOpen: false })}
          onOK={this.deleteAPIKey}
        >
          <p>You are tring to delete API-key shown below:</p>
          <p>{apikey}</p>
          <p>Are you sure you want to delete this API-key?</p>
          <p>ALL tickets associated with this API-key must be deleted before deletion.</p>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>This is permanent and cannot be undone.</p>
        </AttentionModal>
      </div>
    );
  }
}

DeleteAPIKeyButton.propTypes = {
  apikey: PropTypes.string.isRequired,
  onDeletionComplete: PropTypes.func,
};

DeleteAPIKeyButton.defaultProps = {
  onDeletionComplete: () => {},
};

export default DeleteAPIKeyButton;
