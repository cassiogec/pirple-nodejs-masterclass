/*
 * Request handlers
 */

// Dependencies
const tokens = require('./tokens');
const users = require('./users');
const items = require('./menu-items');
const carts = require('./carts');
const orders = require('./orders');

// Define the handlers
const handlers = {};

// Users
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Tokens
handlers.tokens = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Menu items
handlers.menuItems = (data, callback) => {
  const acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    items[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Orders
handlers.orders = (data, callback) => {
  const acceptableMethods = ['post', 'get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    orders[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Carts
handlers.carts = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    carts[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
