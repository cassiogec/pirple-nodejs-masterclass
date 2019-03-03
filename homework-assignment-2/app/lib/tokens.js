// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Container for all the tokens methods
const tokens = {};

// Verify if a given token id is currently valid for a given user
tokens.verifyToken = (id, email, callback) => {
  // Lookup the token
  _data.read('tokens', id, (err, tokenData) => {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.expires > Date.now() && tokenData.email === email) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};


// Tokens - post
// Required data: email, password
// Option data: none
tokens.post = (data, callback) => {
  const email = typeof data.payload.email === 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().indexOf('@') > -1 ? data.payload.email.trim() : false;
  const password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if (email && password) {
    // Lookup the user how matches that email
    _data.read('users', email, (err, userData) => {
      if (!err && userData) {
        // Hash the send password, and compare it to the password stored in the user object
        const hashedPassword = helpers.hash(password);

        if (hashedPassword === userData.hashedPassword) {
          // Create a new token with a random name. Set expiration date 1 hour in the future
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            email,
            id: tokenId,
            expires,
          };

          // Store the token
          _data.create('tokens', tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: 'Could not create the new token' });
            }
          });
        } else {
          callback(400, { Error: 'Password did not match the specified user\'s stored password' });
        }
      } else {
        callback(400, { Error: 'Could not find the specified user' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

// Tokens - get
// Required data: id
// Optional data: none
tokens.get = (data, callback) => {
  // Check that the id is valid
  const id = typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;

  if (id) {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
tokens.put = (data, callback) => {
  const id = typeof data.payload.id === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
  const extend = typeof data.payload.extend === 'boolean' && data.payload.extend === true;

  if (id && extend) {
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        // Check to make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          // Store the new updates
          _data.update('tokens', id, tokenData, (err) => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not update the token\'s expiration' });
            }
          });
        } else {
          callback(400, { Error: 'The token has already expired, and cannot be extended' });
        }
      } else {
        callback(400, { Error: 'Especified token does not exist' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field(s) or field(s) are invalid' });
  }
};

// Tokens - delete
// Required data: id
// Optional: none
tokens.delete = (data, callback) => {
  // Check that the id number provided is valid
  const id = typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;

  if (id) {
    // Lookup the user
    _data.read('tokens', id, (err, data) => {
      if (!err && data) {
        _data.delete('tokens', id, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not delete the token' });
          }
        });
      } else {
        callback(400, { Error: 'Could not find the specified token' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

module.exports = tokens;
