# Users

* [Register an user](#register-an-user)
* [Get an user](#get-an-user)
* [Update an user](#update-an-user)
* [Delete an user](#delete-an-user)

## Register an user
**Method**: `POST`  
**URL**: `/users`  
**Request body**  
Required: `firstName`, `lastName`, `email` `streetAddress`, `password`

**Request example**:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@doe.com",
    "streetAddress": "John Doe street 11",
    "password": "123456"
}
```

## Get an user
**Method**: `GET`  
**URL**: `/users?email='email@domain.com'`  
**Request Headers**:  
`token: <tokenId>`  

**Response example**:  
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@doe.com",
    "streetAddress": "John Doe street 11"
}
```

## Update an user
**Method**: `PUT`  
**URL**: `/users`  
**Request Headers**:  
`token: <tokenId>`  
**Request body**  
Required: `email`  
Optional (at least one must be given): `firstName`, `lastName`, `streetAddress` or `password`

**Request example**:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@doe.com",
    "streetAddress": "John Doe street 12",
    "password": "123456"
}
```

## Delete an user
**Method**: `DELETE`  
**URL**: `/users?email='email@domain.com'`  
**Request Headers**:  
`token: <tokenId>`  