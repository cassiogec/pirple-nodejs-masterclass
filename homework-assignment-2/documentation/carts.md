# Carts

* [Add items to the cart](#add-items-to-the-cart)
* [Get items from the cart](#get-items-from-the-cart)
* [Update a item from cart](#update-a-item-from-cart)
* [Delete a item from cart](#delete-a-item-from-cart)

## Add items to the cart
**Method**: `POST`  
**URL**: `/carts`  
**Request body**  
Required: `email`, `itemId`, `quantity`

**Request example**:
```json
{
	"email": "john@doe.com",
	"itemId": "e6kzesb7efs9cjn1z7ce",
	"quantity": 1
}
```

## Get items from the cart
**Method**: `GET`  
**URL**: `/carts?email=<email>`  
**Request parameters**:  
The id of the cart  
**Request Headers**:  
`token: <tokenId>`  

**Response example**:  
```json
{
    "items": [
        {
            "id": "e6kzesb7efs9cjn1z7ce",
            "quantity": 6
        },
        {
            "id": "a8w6ow0oqsjy4oudxymw",
            "quantity": 10
        }
    ]
}
```

## Update a item from cart
**Method**: `PUT`  
**URL**: `/carts`  
**Request Headers**:  
`token: <tokenId>`  
**Request body**  
Required: `email`, `itemId`, `quantity`

**Request example**:
```json
{
	"email": "john@doe.com",
	"itemId": "a8w6ow0oqsjy4oudxymw",
	"quantity": 1
}
```

## Delete a item from cart
**Method**: `DELETE`  
**URL**: `/carts?email='email@domain.com&itemId=aaaaaaaaaaaaaaaaaaaa'`  
**Request Headers**:  
`token: <tokenId>`
**Request body**  
Required: `email`, `itemId`