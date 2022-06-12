import { API_URL } from './variables';

const get = (dir) => window.fetch(API_URL + dir, {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'error',
  referrer: 'no-referrer',
});

const post = (dir, data) => window.fetch(API_URL + dir, {
  method: 'POST',
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'error',
  referrer: 'no-referrer',
  body: JSON.stringify(data),
});

const formatResponse = (res) => res.json().then((json) => {
  if ('error' in json) {
    throw new Error(json.error);
  }
  return json;
});

export const postLogin = (email, password) => post('/login', { email, password }).then((res) => formatResponse(res));

export const postSearchCustomer = (type, query) => post('/customer/search', { type, query }).then((res) => formatResponse(res));
export const postRegisterCustomer = (email, password) => post('/customer/register', { email, password }).then((res) => formatResponse(res));
export const postRemoveCustomer = (customerKey) => post('/customer/remove', { customerKey: customerKey.toString() }).then((res) => formatResponse(res));

export const postCustomerAPIKeys = (customerKey) => post('/apikey/list', { customerKey: customerKey.toString() }).then((res) => formatResponse(res));
export const postCreateAPIKey = (customerKey) => post('/apikey/create', { customerKey: customerKey.toString() }).then((res) => formatResponse(res));
export const postRemoveAPIKey = (apikey) => post('/apikey/remove', { apikey }).then((res) => formatResponse(res));
export const postSetAPIKeyEnabled = (apikey, enabled) => post('/apikey/enabled', { apikey, enabled: enabled.toString() }).then((res) => formatResponse(res));

export const postTickets = (apikey) => post('/ticket/list', { apikey }).then((res) => formatResponse(res));
export const postCreateTicket = (apikey, startDate, endDate, quota) => post('/ticket/create', { start_date: startDate, end_date: endDate, quota, apikey }).then((res) => formatResponse(res));
export const postRemoveTicket = (apikey, key) => post('/ticket/remove', { apikey, key: key.toString() }).then((res) => formatResponse(res));
