// Dependencies
const util = require('util');

const emailDebug = util.debuglog('email');

const _data = require('./data');
const helpers = require('./helpers');
const tokens = require('./tokens');

// Container for all the orders methods
const orders = {};

// Orders - Post
// Required data: email
// Optional data: nome
orders.post = (data, callback) => {
  // Validate Input
  const userEmail = typeof data.payload.email === 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().indexOf('@') > -1 ? data.payload.email.trim() : false;

  if (userEmail) {
    // Get the token from the headers
    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

    // Verify that the given token is valid for email
    tokens.verifyToken(token, userEmail, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the user data
        _data.read('users', userEmail, (err, userData) => {
          if (!err && userData) {
            // Lookup the cart data
            _data.read('carts', userEmail, (err, cartData) => {
              // Check if the cart has items

              if (!err && cartData && cartData.items.length > 0) {
                let itemErrors = false;
                let count = 0;
                const orderItems = [];
                let orderTotal = 0;

                // Lookup the items data
                cartData.items.forEach((item) => {
                  _data.read('menu-items', item.id, (err, itemData) => {
                    // The price of the item times the quantity
                    let itemTotal = 0;
                    count += 1;

                    if (!err && itemData) {
                      itemTotal = item.quantity * itemData.price;

                      // Sum for the total of the order
                      orderTotal += itemTotal;

                      // Creating array of items to put in the order object
                      orderItems.push({
                        id: item.id,
                        quantity: item.quantity,
                        total: itemTotal,
                        price: itemData.price,
                      });
                    } else {
                      itemErrors = true;
                    }

                    if (count === cartData.items.length) {
                      if (!itemErrors && orderItems) {
                        const userOrders = typeof userData.orders === 'object' && userData.orders instanceof Array ? userData.orders : [];

                        // Create a random id for the order
                        const orderId = helpers.createRandomString(20);

                        // Create the check object, and include the user's phone
                        const orderObject = {
                          id: orderId,
                          email: userEmail,
                          items: orderItems,
                          total: orderTotal,
                        };

                        // It will only create the order if the payment is successful
                        helpers.performStripePayment(userEmail, orderTotal, (err) => {
                          if (!err) {
                            const emailMsg = `The payment for the order ${orderId} with the value of ${orderTotal} was aproved`;
                            const emailSubject = `Payment aproved for order ${orderId}`;

                            // Send receipt for the user after the payment, if there is an error,
                            // it will log out but will continue with the execution
                            helpers.sendEmailMailgun(userEmail, emailMsg, emailSubject, (err) => {
                              if (!err) {
                                emailDebug('\x1b[32m%s\x1b[0m', `Receipt for the order ${orderId} send to the e-mail ${userEmail}`);
                              } else {
                                emailDebug('\x1b[31m%s\x1b[0m', `Couldn't sent receipt for the order ${orderId} on the e-mail ${userEmail}`, err);
                              }
                            });

                            // Save the object
                            _data.create('orders', orderId, orderObject, (err) => {
                              if (!err) {
                                // Add the check id to the user's object
                                userData.orders = userOrders;
                                userData.orders.push(orderId);

                                // Save the new user data
                                _data.update('users', userEmail, userData, (err) => {
                                  if (!err) {
                                    const cartObject = {
                                      items: [],
                                    };

                                    _data.update('carts', userEmail, cartObject, (err) => {
                                      if (!err) {
                                        // Return the new data about the new check
                                        callback(200, orderObject);
                                      } else {
                                        callback(500, { Error: 'Could not update the cart' });
                                      }
                                    });
                                  } else {
                                    callback(500, { Error: 'Could not update the user data with the new order' });
                                  }
                                });
                              } else {
                                callback(500, { Error: 'Could not create the new order' });
                              }
                            });
                          } else {
                            callback(200, { Error: 'Could not complete the payment' });
                          }
                        });
                      } else {
                        callback(500, { Error: 'Could not find the data fo the items' });
                      }
                    }
                  });
                });
              } else {
                callback(400, { Error: 'Could not find the shopping cart or the cart is empty' });
              }
            });
          } else {
            callback(403);
          }
        });
      }
    });
  } else {
    callback(400, { Error: 'Missing required inputs or inputs are invalid' });
  }
};

// Orders - get
// Required data: id
// Optional data: none
orders.get = (data, callback) => {
  const id = typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;

  if (id) {
    // Lookup the order
    _data.read('orders', id, (err, orderData) => {
      if (!err && orderData) {
        // Get the token from the headers
        const token = typeof data.headers.token === 'string' ? data.headers.token : false;

        // Verify that the given token is valid and belogs to the user who created the order
        tokens.verifyToken(token, orderData.email, (tokenIsValid) => {
          if (tokenIsValid) {
            // Return the order data
            callback(200, orderData);
          } else {
            callback(403);
          }
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

module.exports = orders;
