# Building a RESTful JSON API
## Homework Assignment #1
Please create a simple "Hello World" API. Meaning:

1. It should be a RESTful JSON API that listens on a port of your choice. 

2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want. 

## Usage
In the terminal, inside the project folder
`node index.js`
Or choose between `staging` and `production` environments
`NODE_ENV=production node index.js`

Using curl, do a request on the path /hello
`curl localhost:3000/hello`
And it will return the status 200 and the JSON
```json
{
  "message" : "Hello, I am up!"
}
```
If requested any other path, the server will return the status 404