/*
 * Create and export configuration variables
*/

// Container for all the enviroments

const enviroments = {};

// Staging (default) enviroment
enviroments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
  hashingSecret: 'thisIsASecret',
  maxChecks: 5,
  twilio: {
    accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    fromPhone: '+15005550006',
  },
  stripe: {
    token: 'tok_visa',
    authToken: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  },
  mailgun: {
    key: '0a0dde979c5b538f98ab12d612630ea3-7caa9475-ab3b82f6',
    sandboxDomain: 'sandboxfa8f7b5f4a6c40c4a76d25e28d9ff0c9.mailgun.org',
    fromEmail: 'mailgun@sandboxfa8f7b5f4a6c40c4a76d25e28d9ff0c9.mailgun.org',
  },
};

// Production enviroment
enviroments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  hashingSecret: 'thisIsAlsoASecret',
  maxChecks: 5,
  twilio: {
    accountSid: '',
    authToken: '',
    fromPhone: '',
  },
  stripe: {
    token: '',
    authToken: '',
  },
  mailgun: {
    key: '',
    sandboxDomain: '',
    fromEmail: '',
  },
};

// Determine which enviroment was passed as a command-line argument
const currentEnviroment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments above, if not, default to staging
const enviromentoToExport = typeof enviroments[currentEnviroment] === 'object' ? enviroments[currentEnviroment] : enviroments.staging;

// Export the module
module.exports = enviromentoToExport;
