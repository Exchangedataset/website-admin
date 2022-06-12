import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AttentionModal from './AttentionModal';
import { postRemoveTicket } from '../ajax';

class DeleteQuotaButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      modalOpen: false,
      error: null,
    };
    this.deleteQuota = this.deleteQuota.bind(this);
  }

  deleteQuota() {
    const { apikey, ticketKey, onDeletionComplete } = this.props;
    this.setState({ deleting: true });
    postRemoveTicket(apikey, ticketKey).then(() => {
      this.setState({ modalOpen: false });
      onDeletionComplete();
    }).catch((e) => {
      this.setState({ error: e.toString() });
    }).finally(() => this.setState({ deleting: false }));
  }

  render() {
    const {
      apikey,
      ticketKey,
      startDate,
      endDate,
    } = this.props;
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
          onOK={this.deleteQuota}
        >
          <p>You are tring to delete a ticket below:</p>
          <p>
            Ticket-key:
            {' '}
            {ticketKey}
          </p>
          <p>
            API-key:
            {' '}
            {apikey}
          </p>
          <p>
            {startDate.toString()}
            {' '}
            to
            {' '}
            {endDate.toString()}
          </p>
          <p>
            If this ticket is active now, all access to API using this API-key will
            be blocked.
          </p>
          <p>Are you sure you want to delete a ticket?</p>
        </AttentionModal>
      </div>
    );
  }
}

DeleteQuotaButton.propTypes = {
  apikey: PropTypes.string.isRequired,
  ticketKey: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onDeletionComplete: PropTypes.func,
};

DeleteQuotaButton.defaultProps = {
  onDeletionComplete: () => {},
};

export default DeleteQuotaButton;
