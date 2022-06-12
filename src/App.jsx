import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './views/Login';
import Customers from './views/Customers';
import Customer from './views/Customer';
import NotFound from './views/NotFound';
import APIKey from './views/APIkey';

export default class App extends Component {
  render() {
    return (
      <Container style={{ paddingTop: '1em' }}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/customers" component={Customers} />
            <Route path="/customer/:customerKey" component={Customer} />
            <Route path="/apikey/:apikey" component={APIKey} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Container>
    );
  }
}
