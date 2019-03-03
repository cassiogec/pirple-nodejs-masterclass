# Building a RESTful JSON API
## Homework Assignment #2
You are building the API for a pizza-delivery company. Don't worry about a frontend, just build the API. Here's the spec from your project manager: 

1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.

2. Users can log in and log out by creating or destroying a token.

3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system). 

4. A logged-in user should be able to fill a shopping cart with menu items

5. A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment.

6. When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this.

## API Documentation
| Route | Description |
| --- | --- |
|`users` | [documentation](documentation/users.md)
|`tokens` | [documentation](documentation/tokens.md)
|`menu-items` | [documentation](documentation/menu-items.md)
|`carts` | [documentation](documentation/carts.md)
|`orders` | [documentation](documentation/orders.md)

## How to order a pizza
* Create a user `POST /users`
* Log in by creating a token `POST /tokens`
* Request for the menu items `GET /menu-items`
* Add one menu item to the cart `POST /carts`
* List the menu items in the cart `GET /carts`
* Create an order `POST /orders`


## Start the application
In the terminal, inside the project folder
```
node index.js
```
Or choose between `staging` and `production` environments
```
NODE_ENV=production node index.js
```

*Update the api keys with your own before starting the application.  
These can be found in the [config.js](app/config.js) file*
