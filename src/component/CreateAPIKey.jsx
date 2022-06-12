import React, { Component } from 'react';
import { Icon, Button, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

import { postCreateAPIKey } from '../ajax';

class CreateAPIKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apikeyCreating: false,
      messageType: null,
      message: null,
    };
    this.createNewAPIKey = this.createNewAPIKey.bind(this);
  }

  createNewAPIKey() {
    const { customerKey, onChange } = this.props;
    this.setState({ apikeyCreating: true });
    postCreateAPIKey(customerKey).then((res) => {
      onChange();
      this.setState({ messageType: 'success', message: `Successfully created new API-key: ${res.key}` });
    }).catch((e) => {
      this.setState({ messageType: 'error', message: e.toString() });
    }).finally(() => {
      this.setState({ apikeyCreating: false });
    });
  }

  render() {
    const { apikeyCreating, messageType, message } = this.state;
    return (
      <div>
        {
          messageType !== null ? (
            <Message negative={messageType === 'error'} positive={messageType === 'success'}>
              {message}
            </Message>
          ) : ''
        }
        <Button icon primary loading={apikeyCreating} onClick={this.createNewAPIKey}>
          <Icon name="add" />
          New
        </Button>
      </div>
    );
  }
}

CreateAPIKey.propTypes = {
  customerKey: PropTypes.instanceOf(BigNumber).isRequired,
  onChange: PropTypes.func,
};

CreateAPIKey.defaultProps = {
  onChange: () => {},
};

export default CreateAPIKey;
