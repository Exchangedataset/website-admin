import React from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react';

import RegisterCustomer from '../component/RegisterCustomer';
import SearchCustomer from '../component/SearchCustomer';

export default function Customers() {
  return (
    <div>
      <div>
        <Header size="huge" attached="top" block>
          <Icon name="user" />
          <Header.Content>
            Search Customer
          </Header.Content>
        </Header>
        <Segment attached>
          <SearchCustomer />
        </Segment>
      </div>
      <div>
        <Header size="huge" attached="top" block>
          <Icon name="user" />
          <Header.Content>
            Create New Customer
          </Header.Content>
        </Header>
        <Segment attached>
          <RegisterCustomer />
        </Segment>
      </div>
    </div>
  );
}
