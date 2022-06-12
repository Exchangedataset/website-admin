import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Table, Dimmer, Loader, Message,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

import { postCustomerAPIKeys } from '../ajax';
import DeleteAPIKeyButton from './DeleteAPIKeyButton';
import APIKeyEnableCheckBox from './APIKeyEnableCheckbox';

class APIKeys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apikeyLoading: true,
      apikeys: [],
      error: null,
    };
    this.getTable = this.getTable.bind(this);
    this.loadAPIKeys = this.loadAPIKeys.bind(this);
  }

  componentDidMount() {
    this.loadAPIKeys();
  }

  componentDidUpdate(props) {
    const { reload: newReload } = this.props;
    if (props.reload === newReload) {
      return;
    }
    this.loadAPIKeys();
  }

  getTable() {
    const { apikeys } = this.state;
    return apikeys.map((row) => (
      <Table.Row key={row.apikey}>
        <Table.Cell><Link to={`/apikey/${row.apikey}`}>{row.apikey}</Link></Table.Cell>
        <Table.Cell collapsing positive={row.enabled}>
          <APIKeyEnableCheckBox apikey={row.apikey} enabled={row.enabled} />
        </Table.Cell>
        <Table.Cell textAlign="center">
          <DeleteAPIKeyButton apikey={row.apikey} onDeletionComplete={this.loadAPIKeys} />
        </Table.Cell>
      </Table.Row>
    ));
  }

  loadAPIKeys() {
    const { customerKey } = this.props;
    this.setState({ apikeyLoading: true });
    postCustomerAPIKeys(customerKey).then((res) => {
      this.setState({ apikeys: res });
    }).catch((e) => {
      this.setState({ error: e.toString() });
    }).finally(() => {
      this.setState({ apikeyLoading: false });
    });
  }

  render() {
    const { apikeyLoading, error } = this.state;
    return (
      <div>
        {
          error !== null ? (
            <Message negative>
              {error}
            </Message>
          ) : ''
        }
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>API key</Table.HeaderCell>
              <Table.HeaderCell>Enabled</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.getTable()}
          </Table.Body>
        </Table>
        <Dimmer active={apikeyLoading}>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

APIKeys.propTypes = {
  customerKey: PropTypes.instanceOf(BigNumber).isRequired,
  reload: PropTypes.number.isRequired,
};

export default APIKeys;
