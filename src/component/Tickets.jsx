import React, { Component } from 'react';
import {
  Icon, Table, Dimmer, Loader, Popup, Progress, Message,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

import { postTickets } from '../ajax';
import { humanReadableBytes } from '../util';
import DeleteQuotaButton from './DeleteTicketButton';

const humanReadableWithPopup = (bytes) => (
  <Popup content={`${bytes} bytes`} trigger={<span style={{ borderBottom: '1px dotted' }}>{humanReadableBytes(bytes)}</span>} />
);

class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      quotas: [],
      error: null,
    };
    this.getTable = this.getTable.bind(this);
    this.loadQuotas = this.loadQuotas.bind(this);
  }

  componentDidMount() {
    this.loadQuotas();
  }

  componentDidUpdate(props) {
    const { reload: newReload } = this.props;
    if (props.reload === newReload) {
      return;
    }
    this.loadQuotas();
  }

  getTable() {
    const { apikey } = this.props;
    const { quotas } = this.state;
    return quotas.map((row) => {
      const quota = BigNumber(row.quota);
      const used = BigNumber(row.used);
      const left = quota.minus(used);
      const leftPercent = left.times(1000).dividedToIntegerBy(quota).toNumber() / 10;
      return [(
        <Table.Row key={`${row.startDate}-0`}>
          <Table.Cell rowSpan={2}>
            {row.startDate}
            <Icon name="arrow circle right" />
            {row.endDate}
          </Table.Cell>
          <Table.Cell>{humanReadableWithPopup(quota)}</Table.Cell>
          <Table.Cell>{humanReadableWithPopup(used)}</Table.Cell>
          <Table.Cell>{humanReadableWithPopup(left)}</Table.Cell>
          <Table.Cell rowSpan={2}>
            <DeleteQuotaButton
              apikey={apikey}
              ticketKey={row.ticketKey}
              startDate={row.startDate}
              endDate={row.endDate}
              onDeletionComplete={this.loadQuotas}
            />
          </Table.Cell>
        </Table.Row>
      ), (
        <Table.Row key={`${row.startDate}-1`}>
          <Table.Cell colSpan={3}>
            <Progress
              percent={leftPercent}
              error={leftPercent <= 5}
              warning={leftPercent > 5 && leftPercent <= 30}
              success={leftPercent > 30}
              progress="percent"
            />
          </Table.Cell>
        </Table.Row>
      )];
    }).flat(1);
  }

  loadQuotas() {
    const { apikey } = this.props;
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      loading: true,
    });
    postTickets(apikey).then((res) => {
      this.setState({ quotas: res });
    }).catch((e) => {
      this.setState({ error: e.toString() });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { loading, error } = this.state;
    return (
      <div>
        {
          error !== null ? (
            <Message negative>
              <Message.Header>Error occurred</Message.Header>
              {error}
            </Message>
          ) : ''
        }
        <Table celled structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan={2}>Period</Table.HeaderCell>
              <Table.HeaderCell colSpan={3}>Quota</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2} collapsing>Delete</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Limit</Table.HeaderCell>
              <Table.HeaderCell>Used</Table.HeaderCell>
              <Table.HeaderCell>Left</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.getTable()}
          </Table.Body>
        </Table>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

Tickets.propTypes = {
  apikey: PropTypes.string.isRequired,
  reload: PropTypes.number.isRequired,
};

export default Tickets;
