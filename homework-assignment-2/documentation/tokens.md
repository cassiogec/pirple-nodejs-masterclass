# Tokens

* [Register a token](#register-a-token)
* [Get a token](#get-a-token)
* [Update a token](#update-a-token)
* [Delete a token](#delete-a-token)

## Register a token
**Method**: `POST`  
**URL**: `/tokens`  
**Request body**  
Required: `email`, `password`

**Request example**:
```json
{
    "email": "john@doe.com",
    "password": "123456"
}
```

**Response example**:  
```json
{
    "email": "john@doe.com",
    "id": "3b8mxu1pewt13764hana",
    "expires": 1551644581752
}
```

## Get a token
**Method**: `GET`  
**URL**: `/tokens?id='<tokenId>'`

**Response example**:  
```json
{
    "email": "john@doe.com",
    "id": "3b8mxu1pewt13764hana",
    "expires": 1551644581752
}
```

## Update a token
**Method**: `PUT`  
**URL**: `/tokens`  
**Request body**  
Required: `id`
Optional: `extend`

**Request example**:
```json
{
    "id": "n43c80my13bu7btt5puz",
    "extend": true,
}
```

## Delete a token
**Method**: `DELETE`  
**URL**: `/tokens?id='<tokenId>'`  