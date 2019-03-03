# Orders

* [Create a order from the cart](#create-a-order-from-the-cart)

## Create a order from the cart
**Method**: `POST`  
**URL**: `/orders`  
**Request Headers**:  
`token: <tokenId>`  
**Request body**  
Required: `email`
```json
{
	"email": "john@doe.com"
}
```

**Response example**:  
```json
{
    "id": "g8meojjid9lg6hzsnzs6",
    "email": "john@doe.com",
    "items": [
        {
            "id": "a8w6ow0oqsjy4oudxymw",
            "quantity": 1,
            "total": 18,
            "price": 18
        }
    ],
    "total": 18
}
```