# Menu Items

* [Get the menu items](#get-the-menu-items)

## Get the menu items
**Method**: `GET`  
**URL**: `/menu-items`  
**Request Headers**:  
`token: <tokenId>`  
**Request body**  
Required: `email`

**Response example**:  
```json
{
    "menu-items": [
        {
            "id": "a8w6ow0oqsjy4oudxymw",
            "description": "Margherita",
            "price": 18
        },
        {
            "id": "d24vlii9hdldgv8gh022",
            "description": "Pepperoni",
            "price": 20
        },
        {
            "id": "e6kzesb7efs9cjn1z7ce",
            "description": "BBQ Chicken",
            "price": 25
        },
        {
            "id": "jtoenr0sgb8b2g4c7fhb",
            "description": "Hawaiian",
            "price": 22
        },
        {
            "id": "ndidn93y23ithlw07yuq",
            "description": "Meat-Lover’s",
            "price": 25
        }
    ]
}
```