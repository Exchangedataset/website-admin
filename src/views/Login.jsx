import React from 'react';
import { Form } from 'semantic-ui-react';
import { Component } from 'react';
import { postLogin } from '../ajax';
import { Redirect } from 'react-router-dom';
import BigNumber from 'bignumber.js';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    customerKey: null,
    redirect: false,
    loading: false,
  }

  onSubmit = () => {
    const { email, password } = this.state;
    this.setState({
      loading: true,
    });
    postLogin(email, password).then((res) => {
      this.setState({
        customerKey: new BigNumber(res.customerKey),
        redirect: true,
      });
    }).catch((e) => {
      alert(e);
      this.setState({
        loading: false,
      });
    });
  };

  handleChange = (event, target) => {
    this.setState({
      [target.name]: target.value,
    })
  };

  render() {
    const { email, password, loading, customerKey, redirect } = this.state;
    return (
      <div>
        <Form>
          <Form.Input
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={this.handleChange}
          />
          <Form.Input
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={this.handleChange}
          />
          <Form.Button
            primary
            icon="user"
            content="Login"
            disabled={loading}
            loading={loading}
            onClick={this.onSubmit}
          />
        </Form>
        {
          redirect ?
            <Redirect
              // if logged in as admin then redirect to customer list
              to={customerKey.eq(-1) ?
                "/customers" :
                `/customer/${customerKey}`
              }
            /> :
            ""
        }
      </div>
    );
  }
}
