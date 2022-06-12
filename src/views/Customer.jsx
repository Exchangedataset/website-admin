import React, { Component } from 'react';
import {
  Header, Icon, Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

import APIKeys from '../component/APIKeys';
import CreateAPIKey from '../component/CreateAPIKey';

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reloadAPIKeys: 0,
    };
  }

  render() {
    const { match } = this.props;
    const { customerKey: customerKeyString } = match.params;
    const customerKey = BigNumber(customerKeyString);
    const { reloadAPIKeys } = this.state;
    return (
      <div>
        <Header size="huge" attached="top" block>
          <Icon name="user" />
          <Header.Content>
            Customer
            {' '}
            {match.params.customerKey}
          </Header.Content>
        </Header>
        <Segment attached>
          <Header size="medium">
            API-keys attributed to this customer
          </Header>
          <APIKeys customerKey={customerKey} reload={reloadAPIKeys} />
          <Header size="medium">
            Create new API-key for this customer
          </Header>
          <CreateAPIKey
            customerKey={customerKey}
            onChange={() => this.setState({ reloadAPIKeys: Math.random() })}
          />
        </Segment>
      </div>
    );
  }
}

Customer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      customerKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Customer;
