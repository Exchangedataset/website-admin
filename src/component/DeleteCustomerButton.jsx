import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';

import AttentionModal from './AttentionModal';
import { postRemoveCustomer } from '../ajax';

class DeleteCustomerButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      modalOpen: false,
      error: null,
    };
    this.deleteCustomer = this.deleteCustomer.bind(this);
  }

  deleteCustomer() {
    const { customerKey, onDeletionComplete } = this.props;
    this.setState({ deleting: true });
    postRemoveCustomer(customerKey).then(() => {
      this.setState({ modalOpen: false });
      onDeletionComplete();
    }).catch((e) => {
      this.setState({ error: e.toString() });
    }).finally(() => this.setState({ deleting: false }));
  }

  render() {
    const { customerKey } = this.props;
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
          onOK={this.deleteCustomer}
        >
          <p>WARNING!</p>
          <p>You are tring to delete a customer account with Customer Key below:</p>
          <p>{customerKey.toString()}</p>
          <p>DO NOT DELETE THE ACCOUNT UNLESS THE CUSTOMER TOLD YOU TO DO SO.</p>
          <p>This will delete customer information, and the ownership of API-keys will be irreversibly revoked.</p>
          <p>
            API-keys this customer owned can be used to access API after deletion,
            {' '}
            but the customer can no longer alter the settings of it and
            also you MUST NOT even if the customer asked, after their account has been deleted.
          </p>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>This is permanent and cannot be undone.</p>
          <p>Are you sure you want to proceed?</p>
        </AttentionModal>
      </div>
    );
  }
}

DeleteCustomerButton.propTypes = {
  customerKey: PropTypes.instanceOf(BigNumber).isRequired,
  onDeletionComplete: PropTypes.func,
};

DeleteCustomerButton.defaultProps = {
  onDeletionComplete: () => {},
};

export default DeleteCustomerButton;
