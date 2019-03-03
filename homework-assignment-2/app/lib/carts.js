// Dependencies
const _data = require('./data');
const tokens = require('./tokens');

// Container for the users submethods
const users = {};

// Cart - post
// Required data: itemId, email, quantity
// Optional data: none
users.post = (data, callback) => {
  // Check that all required fields are filled out
  const email = typeof data.payload.email === 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().indexOf('@') > -1 ? data.payload.email.trim() : false;
  const itemId = typeof data.payload.itemId === 'string' && data.payload.itemId.trim().length === 20 ? data.payload.itemId.trim() : false;
  const quantity = typeof data.payload.quantity === 'number' && data.payload.quantity > 0 ? data.payload.quantity : false;

  if (email && itemId && quantity) {
    // Get the token from the headers
    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

    // Verify that the given token is valid for email
    tokens.verifyToken(token, email, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the cart
        _data.read('carts', email, (errCart, cartData) => {
          if (!errCart) {
            // Controling if the item is already in the cart
            let itemFound = false;

            // Seraching if the item is not already in the cart
            cartData.items.forEach((item, index) => {
              // if found, adding the new quantity with the old one
              if (item.id === itemId) {
                cartData.items[index].quantity += quantity;
                itemFound = true;
              }
            });

            if (!itemFound) {
              // Creating new item object
              const newItem = {
                id: itemId,
                quantity,
              };

              // Adding the new item to the cart
              cartData.items.push(newItem);
            }

            _data.update('carts', email, cartData, (errItem) => {
              if (!errItem) {
                callback(200);
              } else {
                callback(500, { Error: 'Could not update the cart' });
              }
            });
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, { Error: 'Missing required token in header, or token is invalid' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

// Cart - get
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
        // Lookup the cart
        _data.read('carts', email, (err, data) => {
          if (!err && data) {
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

// Cart - put
// Required data: itemId, email, quantity
// Optional data: none
users.put = (data, callback) => {
  // Check that all required fields are filled out
  const email = typeof data.payload.email === 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().indexOf('@') > -1 ? data.payload.email.trim() : false;
  const itemId = typeof data.payload.itemId === 'string' && data.payload.itemId.trim().length === 20 ? data.payload.itemId.trim() : false;
  const quantity = typeof data.payload.quantity === 'number' && data.payload.quantity > 0 ? data.payload.quantity : false;

  // Error if the email is invalid
  if (email && itemId && quantity) {
    // Get the token from the headers
    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the email
    tokens.verifyToken(token, email, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the user
        _data.read('carts', email, (err, cartData) => {
          if (!err && cartData) {
            // Update the fields necessary
            cartData.items.forEach((item, index) => {
              if (item.id === itemId) {
                cartData.items[index].quantity = quantity;
              }
            });

            // Store the new updates
            _data.update('carts', email, cartData, (err) => {
              if (!err) {
                callback(200);
              } else {
                callback(500, { Error: 'Could not update the cart item' });
              }
            });
          } else {
            callback(400, { Error: 'The specified cart does not exist' });
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

// Cart - delete
// Required data: email, itemId
// Optional data: none
users.delete = (data, callback) => {
  // Check that the email provided is valid
  const email = typeof data.queryStringObject.email === 'string' && data.queryStringObject.email.trim().length > 0 && data.queryStringObject.email.trim().indexOf('@') > -1 ? data.queryStringObject.email.trim() : false;
  const itemId = typeof data.queryStringObject.itemId === 'string' && data.queryStringObject.itemId.trim().length === 20 ? data.queryStringObject.itemId.trim() : false;

  if (email && itemId) {
    // Get the token from the headers
    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the email
    tokens.verifyToken(token, email, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the cart
        _data.read('carts', email, (err, cartData) => {
          if (!err && cartData) {
            // Delete the item from the shopping cart
            cartData.items.forEach((item, index) => {
              if (item.id === itemId) {
                cartData.items.splice(index, 1);
              }
            });

            // Store the new updates
            _data.update('carts', email, cartData, (err) => {
              if (!err) {
                callback(200);
              } else {
                callback(500, { Error: 'Could not delete the cart item' });
              }
            });
          } else {
            callback(400, { Error: 'Could not find the specified cart' });
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
