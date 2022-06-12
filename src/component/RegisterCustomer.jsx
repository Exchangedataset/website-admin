import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Icon, Input, Button, Message,
} from 'semantic-ui-react';

import { postRegisterCustomer } from '../ajax';

export default class RegisterCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      messageType: null,
      message: null,
      registering: false,
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.createCustomer = this.createCustomer.bind(this);
  }

  onChangeEmail(event, data) {
    const { value } = data;
    this.setState({ email: value });
  }

  onChangePassword(event, data) {
    const { value } = data;
    this.setState({ password: value });
  }

  createCustomer() {
    const { email, password } = this.state;
    if (email === '' || password === '') {
      this.setState({ messageType: 'error', message: 'Email or password are missing' });
      return;
    }
    const { onRegisterDone } = this.props;

    this.setState({ registering: true });
    postRegisterCustomer(email, password).then((res) => {
      this.setState({ messageType: 'success', message: `Successfully registered new customer, key: ${res.key}` });
      onRegisterDone();
    }).catch((e) => {
      this.setState({ messageType: 'error', message: e.toString() });
    }).finally(() => {
      this.setState({ registering: false });
    });
  }

  render() {
    const { messageType, message, registering } = this.state;
    return (
      <div>
        {
          messageType !== null ? (
            <Message negative={messageType === 'error'} positive={messageType === 'success'}>
              <p>{message}</p>
            </Message>
          ) : ''
        }
        <Input placeholder="email" onChange={this.onChangeEmail} />
        <Input placeholder="password" onChange={this.onChangePassword} />
        <Button
          icon
          primary
          disabled={registering}
          loading={registering}
          onClick={this.createCustomer}
        >
          <Icon name="user" />
          {' '}
          Create
        </Button>
      </div>
    );
  }
}

RegisterCustomer.propTypes = {
  onRegisterDone: PropTypes.func,
};

RegisterCustomer.defaultProps = {
  onRegisterDone: () => {},
};
