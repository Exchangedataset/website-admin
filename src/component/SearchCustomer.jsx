import React, { Component } from 'react';
import {
  Icon, Input, Button, Dropdown, Table, Message,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import { postSearchCustomer } from '../ajax';
import DeleteCustomerButton from './DeleteCustomerButton';

const searchCustomerOptions = [
  {
    key: 'email',
    text: 'Email',
    value: 'email',
  },
  {
    key: 'apikey',
    text: 'API Key',
    value: 'apikey',
  },
];

export default class SearchCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchType: '',
      searchValue: '',
      searchLoading: false,
      searchResult: [],
      error: null,
    };
    this.onChangeSearchType = this.onChangeSearchType.bind(this);
    this.onChangeSearchValue = this.onChangeSearchValue.bind(this);
    this.onKeyDownSearchValue = this.onKeyDownSearchValue.bind(this);
    this.getCustomerSearchTable = this.getTable.bind(this);
    this.searchCustomer = this.searchCustomer.bind(this);
  }

  onChangeSearchType(event, data) {
    const { value } = data;
    this.setState({ searchType: value });
  }

  onChangeSearchValue(event, data) {
    const { value } = data;
    this.setState({ searchValue: value });
  }

  onKeyDownSearchValue(event) {
    if (event.key === 'Enter') {
      const { searchLoading } = this.state;
      if (!searchLoading) {
        this.searchCustomer();
      }
    }
  }

  getTable() {
    const { searchResult } = this.state;
    return searchResult.map((v) => (
      <Table.Row key={v.key}>
        <Table.Cell><Link to={`/customer/${v.key}/`}>{v.key}</Link></Table.Cell>
        <Table.Cell>{v.email}</Table.Cell>
        <Table.Cell>{v.info}</Table.Cell>
        <Table.Cell collapsing>
          <DeleteCustomerButton
            customerKey={BigNumber(v.key)}
            onDeletionComplete={this.searchCustomer}
          />
        </Table.Cell>
      </Table.Row>
    ));
  }

  searchCustomer() {
    // this will play the loading animation
    this.setState({ error: null, searchLoading: true });
    const { searchType, searchValue } = this.state;
    if (searchType === null) {
      this.setState({ error: 'Please select search type' });
      return;
    }
    postSearchCustomer(searchType, searchValue).then((res) => {
      this.setState({ searchResult: res });
    }).catch((e) => {
      this.setState({ error: e.toString() });
    }).finally(() => {
      this.setState({ searchLoading: false });
    });
  }

  render() {
    const { searchLoading, error } = this.state;

    return (
      <div>
        {
          error !== null ? (
            <Message negative>
              {error}
            </Message>
          ) : ''
        }
        <Dropdown placeholder="Search Type" selection onChange={this.onChangeSearchType} options={searchCustomerOptions} />
        <Input placeholder="Search Value" action onChange={this.onChangeSearchValue} onKeyDown={this.onKeyDownSearchValue} />
        <Button
          icon
          primary
          disabled={searchLoading}
          loading={searchLoading}
          onClick={this.searchCustomer}
        >
          <Icon name="search" />
          {' '}
          Search
        </Button>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Customer Key</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Info</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.getTable()}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
