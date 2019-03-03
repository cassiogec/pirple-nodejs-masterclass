// Dependencies
const _data = require('./data');
const tokens = require('./tokens');

const items = {};

// Menu Items - get
// Required data: email
// Optional data: none
// List all the menu items
items.get = (data, callback) => {
  const email = typeof data.queryStringObject.email === 'string' && data.queryStringObject.email.trim().length > 0 && data.queryStringObject.email.trim().indexOf('@') > -1 ? data.queryStringObject.email.trim() : false;

  if (email) {
    // Get the token from the headers
    const token = typeof data.headers.token === 'string' ? data.headers.token : false;
    // Verify that the given token is valid for email
    tokens.verifyToken(token, email, (tokenIsValid) => {
      if (tokenIsValid) {
        const menuItemsData = [];
        // Get all the items
        _data.list('menu-items', (err, menuItems) => {
          if (!err && menuItems && menuItems.length > 0) {
            // Count to control when it has readed all the files
            let count = 0;
            let readErr = false;

            menuItems.forEach((item) => {
              // Read in the menu data
              _data.read('menu-items', item, (err, itemData) => {
                count += 1;

                if (!err && itemData) {
                  menuItemsData.push(itemData);

                  // If all the files were read
                  if (count === menuItems.length) {
                    // No erros in any read
                    if (!readErr) {
                      const objMenuItemsData = {
                        'menu-items': menuItemsData,
                      };

                      callback(200, objMenuItemsData);
                    } else {
                      callback(500, { Error: 'Could not read the data from the menu items' });
                    }
                  }
                } else {
                  readErr = true;
                }
              });
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

module.exports = items;
