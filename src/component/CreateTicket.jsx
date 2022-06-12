import React, { Component } from 'react';
import {
  Icon, Button, Message, Input,
} from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

import { postCreateTicket } from '../ajax';
import { ensureUTCDate } from '../util';

class CreateQuota extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      dateRange: [],
      quota: '',
      messageType: null,
      message: null,
    };
    this.createQuota = this.createQuota.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, { name, value }) {
    this.setState({ [name]: value });
  }

  createQuota() {
    const { apikey, onChange } = this.props;
    const { dateRange, quota: quotaStr } = this.state;
    if (dateRange.length !== 2) {
      this.setState({ messageType: 'error', message: 'Please select period' });
      return;
    }
    const [startDateLocal, endDateLocal] = dateRange;
    const startDate = ensureUTCDate(startDateLocal);
    const endDate = ensureUTCDate(endDateLocal);

    let quota;
    if (/^[1-9][0-9]*$/.test(quotaStr)) {
      const GB = new BigNumber(2).pow(30);
      quota = new BigNumber(quotaStr).multipliedBy(GB).toString(10);
    } else {
      this.setState({ messageType: 'error', message: 'Please enter quota in integer' });
      return;
    }

    this.setState({ creating: true });
    postCreateTicket(apikey, startDate, endDate, quota)
      .then((res) => {
        this.setState({ messageType: 'success', message: `Successfully created new ticket: ${res.key}` });
        onChange();
      }).catch((e) => {
        this.setState({ messageType: 'error', message: e.toString() });
      }).finally(() => {
        this.setState({ creating: false });
      });
  }

  render() {
    const {
      creating, dateRange, messageType, message,
    } = this.state;
    return (
      <div>
        {
          messageType !== null ? (
            <Message negative={messageType === 'error'} positive={messageType === 'success'}>
              {message}
            </Message>
          ) : ''
        }
        <SemanticDatepicker
          name="dateRange"
          placeholder="Date Range"
          value={dateRange}
          iconPosition="left"
          onChange={this.handleChange}
          type="range"
        />
        <Input
          name="quota"
          placeholder="quota in GB"
          onChange={this.handleChange}
        />
        <Button icon primary loading={creating} onClick={this.createQuota}>
          <Icon name="key" />
          {' '}
          Create
        </Button>
      </div>
    );
  }
}

CreateQuota.propTypes = {
  apikey: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

CreateQuota.defaultProps = {
  onChange: () => {},
};

export default CreateQuota;
