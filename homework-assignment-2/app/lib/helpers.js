/*
 * Helpers for various tasks
 *
 */

// Dependecies
const crypto = require('crypto');
const querystring = require('querystring');
const https = require('https');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  }

  return false;
};

// Parse a JSON string to a object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (strLength) => {
  strLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;

  if (strLength) {
    // Define all the possible character that could go into a string
    const possibleCharacters = 'abcdefghijklmnopqrsteuvwxyz0123456789';
    let str = '';

    for (let i = 1; i <= strLength; i += 1) {
      // Get a random character from the possible characters
      const randomCharacter = possibleCharacters
        .charAt(Math.floor(Math.random() * possibleCharacters.length));

      // Append this character to the final string
      str += randomCharacter;
    }

    return str;
  }

  return false;
};

// Perform the payment for the orders
helpers.performStripePayment = (email, amount, callback) => {
  // Validate the parameters
  email = typeof email === 'string' && email.trim().length > 0 && email.trim().indexOf('@') > -1 ? email.trim() : false;
  amount = typeof amount === 'number' && amount > 0 ? Number.parseFloat(amount) : false;

  if (email && amount) {
    // Configure the request payload
    const payload = {
      amount: 200,
      currency: 'usd',
      description: 'Pirple Payment test',
      source: config.stripe.token,
    };

    // Stringify the payload
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    const requestDetails = {
      protocol: 'https:',
      hostname: 'api.stripe.com',
      method: 'POST',
      path: '/v1/charges',
      auth: config.stripe.authToken,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // Grab the status of the sent request
      const status = res.statusCode;

      // Get the payload
      const decoder = new StringDecoder('utf-8');
      let buffer = '';

      res.on('data', (data) => {
        buffer += decoder.write(data);
      });

      res.on('end', () => {
        buffer += decoder.end();

        // Callback to successfully if the request went through
        if (status === 200 || status === 201) {
          callback(false);
        } else {
          callback(`Status code returned was ${status}, the error returned was: ${buffer}`);
        }
      });
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', (e) => {
      callback(e);
    });

    // Add the payload to the request
    req.write(stringPayload);

    // End the request, when ended it will send the request
    req.end();
  } else {
    callback('Given parameters were missing or invalid');
  }
};

// Send e-mail with mailgun
helpers.sendEmailMailgun = (to, msg, subject, callback) => {
  // Validate the parameters
  to = typeof to === 'string' && to.trim().length > 0 && to.trim().indexOf('@') > -1 ? to.trim() : false;
  msg = typeof msg === 'string' && msg.trim().length > 0 ? msg.trim() : false;
  subject = typeof subject === 'string' && subject.trim().length > 0 ? subject.trim() : false;

  if (to && msg && subject) {
    // Configure the request payload
    const payload = {
      to,
      from: `Pirple Receipt Test <${config.mailgun.fromEmail}>`,
      subject,
      text: msg,
    };

    // Stringify the payload
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    const requestDetails = {
      protocol: 'https:',
      hostname: 'api.mailgun.net',
      method: 'POST',
      path: `/v3/${config.mailgun.sandboxDomain}/messages`,
      auth: `api:${config.mailgun.key}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // Grab the status of the sent request
      const status = res.statusCode;

      // Get the payload
      const decoder = new StringDecoder('utf-8');
      let buffer = '';

      res.on('data', (data) => {
        buffer += decoder.write(data);
      });

      res.on('end', () => {
        buffer += decoder.end();

        // Callback to successfully if the request went through
        if (status === 200 || status === 201) {
          callback(false);
        } else {
          callback(`Status code returned was ${status}, the error returned was: ${buffer}`);
        }
      });
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', (e) => {
      callback(e);
    });

    // Add the payload to the request
    req.write(stringPayload);

    // End the request, when ended it will send the request
    req.end();
  } else {
    callback('Given parameters were missing or invalid');
  }
};

module.exports = helpers;
