import React, { Component } from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Tickets from '../component/Tickets';
import CreateQuota from '../component/CreateTicket';

class APIKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listReload: 0,
    };
  }

  render() {
    const { match } = this.props;
    const { apikey } = match.params;
    const { listReload } = this.state;

    return (
      <div>
        <Header size="huge" attached="top" block>
          <Icon name="key" />
          <Header.Content>
            API key
            {' '}
            {apikey}
          </Header.Content>
        </Header>
        <Segment attached>
          <Header size="medium">
            Ticket and its quota and consumed
          </Header>
          <Tickets
            apikey={apikey}
            reload={listReload}
          />
          <Header size="medium">
            Create a new ticket
          </Header>
          <CreateQuota
            apikey={apikey}
            onChange={() => {
              this.setState({ listReload: Math.random() });
            }}
          />
        </Segment>
      </div>
    );
  }
}

APIKey.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      apikey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default APIKey;
