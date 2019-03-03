// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const tokens = require('./tokens');

// Container for the users submethods
const users = {};

// Users - post
// Required data: firstName, lastName, email, streetAddress
// Optional data: none
users.post = (data, callback) => {
  // Check that all required fields are filled out
  const firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const email = typeof data.payload.email === 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().indexOf('@') > -1 ? data.payload.email.trim() : false;
  const streetAddress = typeof data.payload.streetAddress === 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false;
  const password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if (firstName && lastName && email && streetAddress && password) {
    // Make sure that the user already exist
    _data.read('users', email, (err) => {
      if (err) {
        // Hash the password
        const hashedPassword = helpers.hash(password);

        // Create the user object
        if (hashedPassword) {
          const userObject = {
            firstName,
            lastName,
            email,
            streetAddress,
            hashedPassword,
          };

          // Store the user
          _data.create('users', email, userObject, (errCreating) => {
            if (!errCreating) {
              const cartObject = {
                items: [],
              };

              _data.create('carts', email, cartObject, (errCreatingCart) => {
                if (!errCreatingCart) {
                  callback(200);
                } else {
                  callback(500, { Error: 'Could not create the new user' });
                }
              });
            } else {
              callback(500, { Error: 'Could not create the new user' });
            }
          });
        } else {
          callback(500, { Error: 'Could not hash the user\'s password' });
        }
      } else {
        // User already exist
        callback(400, { Error: 'A user with that e-mail already exist' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

// Users - get
// Required data: email
// Optional data: none
users.get = (data, callback) => {
  // Check that the email provided is valid
  const email = typeof data.queryStringObject.email === 'string' && data.queryStringObject.email.trim().length > 0 && data.queryStringObject.email.trim().indexOf('@') > -1 ? data.queryStringObject.email.trim() : false;

  if (email) {
    // Get the token from the headers
    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

    // Verify that the given token is valid for email
    tokens.verifyToken(token, email, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the user
        _data.read('users', email, (err, data) => {
          if (!err && data) {
            // Remove the hashed password from the user object before returning it to the requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, { Error: 'Missing required token in header, or token is invalid' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

// Users - put
// Required data: email
// Optional data: firstName, lastName, password, streetAddress ( at least one must be especified)
users.put = (data, callback) => {
  // Check for the required field
  const email = typeof data.payload.email === 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().indexOf('@') > -1 ? data.payload.email.trim() : false;

  // Check for the optional fields
  const firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const streetAddress = typeof data.payload.streetAddress === 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false;
  const password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if the email is invalid
  if (email) {
    // Error if nothing is sent to update
    if (firstName || lastName || password || streetAddress) {
      // Get the token from the headers
      const token = typeof data.headers.token === 'string' ? data.headers.token : false;

      // Verify that the given token is valid for the email
      tokens.verifyToken(token, email, (tokenIsValid) => {
        if (tokenIsValid) {
          // Lookup the user
          _data.read('users', email, (err, userData) => {
            if (!err && userData) {
              // Update the fields necessary
              if (firstName) {
                userData.firstName = firstName;
              }

              if (lastName) {
                userData.lastName = lastName;
              }

              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }

              if (streetAddress) {
                userData.streetAddress = streetAddress;
              }

              // Store the new updates
              _data.update('users', email, userData, (err) => {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { Error: 'Could not update the user' });
                }
              });
            } else {
              callback(400, { Error: 'The specified user does not exist' });
            }
          });
        } else {
          callback(403, { Error: 'Missing required token in header, or token is invalid' });
        }
      });
    } else {
      callback(400, { Error: 'Missing fields to update' });
    }
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

// Users - delete
// Required data: email
// Optional data: none
users.delete = (data, callback) => {
  // Check that the email provided is valid
  const email = typeof data.queryStringObject.email === 'string' && data.queryStringObject.email.trim().length > 0 && data.queryStringObject.email.trim().indexOf('@') > -1 ? data.queryStringObject.email.trim() : false;

  if (email) {
    // Get the token from the headers
    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the email
    tokens.verifyToken(token, email, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the user
        _data.read('users', email, (err, userData) => {
          if (!err && userData) {
            _data.delete('users', email, (err) => {
              if (!err) {
                // Delete each of the orders and the cart associated with the user
                const userOrders = typeof userData.orders === 'object' && userData.orders instanceof Array ? userData.orders : [];
                const ordersToDelete = userOrders.length;

                if (ordersToDelete > 0) {
                  let ordersDeleted = 0;
                  let deletionErrors = false;

                  // Loop throw the orders
                  userOrders.forEach((orderId) => {
                    // Delete the order
                    _data.delete('orders', orderId, (err) => {
                      if (err) {
                        deletionErrors = true;
                      } else {
                        ordersDeleted += 1;
                        if (ordersDeleted === ordersToDelete) {
                          if (!deletionErrors) {
                            _data.delete('carts', userData.email, (err) => {
                              if (!err) {
                                callback(200);
                              } else {
                                callback(500, { Error: 'Error encoutered while attempting to delete the user\'s cart.' });
                              }
                            });
                          } else {
                            callback(500, { Error: 'Erros encoutered while attempting to delete all of the user\'s orders. All orders may not have been deleted from the system successfully' });
                          }
                        }
                      }
                    });
                  });
                } else {
                  callback(200);
                }
              } else {
                callback(500, { Error: 'Could not delete the user' });
              }
            });
          } else {
            callback(400, { Error: 'Could not find the specified user' });
          }
        });
      } else {
        callback(403, { Error: 'Missing required token in header, or token is invalid' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

module.exports = users;
