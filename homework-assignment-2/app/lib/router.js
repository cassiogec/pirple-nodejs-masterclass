// Dependencies
const handlers = require('./handlers');

// Define a request router
const router = {
  users: handlers.users,
  tokens: handlers.tokens,
  'menu-items': handlers.menuItems,
  carts: handlers.carts,
  orders: handlers.orders,
  notFound: handlers.notFound,
};

module.exports = router;
