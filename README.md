# Restful Auth

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5b17056ba23f4e6ba8cb75c99a32b3ae)](https://www.codacy.com/gh/Mihai925/restful-auth/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Mihai925/restful-auth&amp;utm_campaign=Badge_Grade) [![Coverage Status](https://coveralls.io/repos/github/Mihai925/restful-auth/badge.svg)](https://coveralls.io/github/Mihai925/restful-auth) [![Build Status](https://travis-ci.com/Mihai925/restful-auth.svg?branch=develop)](https://travis-ci.com/Mihai925/restful-auth)  ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## About The Project

An open-source, bring-your-own-frontend and database-agnostic (ish) tool for building simple user systems.

If you own anything that requires users, you should use this!

## What do I get?

 * Restful endpoints for the most common common user system (register, login, logut, etc)
 * Middleware for role-based access control (HasRole and IsLoggedIn)
 * Password reset capability based on random-generated tokens

## Compatibility

This library gets some of your dependencies injected and does the boring work for you, so you don't have to.

That being said, there is a limit to how many 3rd party libraries and database dialects can be supported. Take a look at the bullet points below to make sure we're compatible.

Main framework:

 * Node.js + Express.js

Database libraries and dialects:

 * [Sequelize](https://sequelize.org/):
    * MySQL
    * PostgreSQL
    * MariaDB
    * SQLite
 * [Mongoose](https://mongoosejs.com/) (MongoDB)
 * [Dynamoose](https://dynamoosejs.com/) (DynamoDB)

This should pretty much cover the most popular technologies out there. In case your favorite library isn't listed here, you're encouraged to contribute. It's very likely that adding your library and dialect here is way simpler than duplicating the whole logic in your app!

## Getting started

We're starting simple and we can either keep it simple or make it complex, it all depends on what app you build and what you need.

### Installation

 1. Install Restful Auth in your Node.js application
```shell
    npm install restful-auth
```
 2. Make sure Restful Auth can work with your database:
    * **For development**: Your ORM can just set it up. Something like [sequelize.sync](https://sequelize.org/master/manual/model-basics.html#synchronizing-all-models-at-once) would do. Same for the other supported ORMs.
    * **For production**: Take a look at the [models](https://github.com/Mihai925/restful-auth/tree/develop/models) for your ORM and set them up like you do for the rest of your app. This should be a pretty easy step and the models are very basic. You can also take a look at the ORM's documentation for how to do that.
 3. Inject your Express.js app along with the ORM in the library for the magic to happen. For example:
```javascript
    const sequelize = new Sequelize(...);
    const app = express();
    const restfulAuth = require("restful-auth");
    ...
    const auth = restfulAuth(app, {
    	type: "sequelize",
    	db: sequelize
    });

```
Easy peasy, right? Unless you have an unsupported ORM or a really REALLY old version of it, you should be fine and your app should start having some awesome endpoints for user registration, authentication, login, logout, roles and all that goodness!

## APIs

### Register a new user

Registers a new user with the application.


`POST /api/register`

#### Request Body

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique identifier for the user. |
| `password` | string | Yes | User's password. |
| `role` | string | No | User's role (if applicable). |

#### Responses

| Status Code | Description |
| --- | --- |
| `200` | User successfully created. |
| `400` | Bad request. |
| `409` | User with given `id` already exists. |
| `429` | Too many requests. |

### Login

Logs a user into the application.


`POST /api/login`

#### Request Body

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique identifier for the user. |
| `password` | string | Yes | User's password. |

#### Responses

| Status Code | Description |
| --- | --- |
| `200` | User successfully authenticated. Returns a JWT token. |
| `400` | Bad request. |
| `401` | Unauthorized. |
| `429` | Too many requests. |

### Logout

Logs a user out of the application.


`POST /api/logout`

#### Responses

| Status Code | Description |
| --- | --- |
| `200` | User successfully logged out. |
| `429` | Too many requests. |

### Reset Password

Resets a user's password.


`POST /api/reset`

#### Request Body

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique identifier for the user. |
| `token` | string | Yes | Unique token sent to the user's email. |
| `password` | string | Yes | User's new password. |

#### Responses

| Status Code | Description |
| --- | --- |
| `200` | Password successfully reset. |
| `400` | Bad request. |
| `404` | Token not found or expired. |
| `429` | Too many requests. |

## Middlewares

A middleware is a function that runs before the route handler, it is useful for checking permissions, validating data, or performing other tasks required before the request is processed.

### Available Middlewares

#### HasRole

`HasRole` middleware checks whether the user has the required role to access a route. It accepts a `role` parameter that specifies the required role. If the user has the required role, the middleware calls the next middleware or route handler. Otherwise, it sends a 404 status code.

Example:

```js
const { HasRole } = plugin.middlewares;

router.get('/admin', HasRole('admin'), (req, res) => {
  // render the admin dashboard
});
```
#### IsLoggedIn

`IsLoggedIn` middleware checks whether the user is logged in or not. It verifies the authentication token in the `Authorization` header and allows the request to proceed if the token is valid. Otherwise, it sends a 404 status code.

Example:


```js
const { IsLoggedIn } = plugin.middlewares;

router.get('/profile', IsLoggedIn(), (req, res) => {
  const userId = req.user.id;
  // fetch the user profile using the userId
  // render the user profile page
});
```

Note: In the above example, the `req.user` object is set by another middleware that verifies the authentication token and sets the user information in the `req` object.

```js
const express = require('express');
const app = express();
const ra = require('restful-auth');

// Install the plugin
app.use(ra());

// Use the middlewares
const { CreateResetToken, HasRole, IsLoggedIn } = ra.middlewares;


app.get('/admin', HasRole('admin'), (req, res) => {
  // use the HasRole middleware
});

app.get('/profile', IsLoggedIn(), (req, res) => {
  // use the IsLoggedIn middleware
});
```

### Usage
To use the middlewares provided by the plugin, you need to install it first. After installing the plugin, you can access the middlewares using the middlewares property of the returned object.

## Helper functions

### CreateResetToken

`createResetToken` generates a unique token and stores it in the database. It accepts an `id` and optional `secondsDelay` parameter. The `id` parameter is the ID of the user for whom the reset token will be created, while `secondsDelay` is the time (in seconds) for which the token should be valid (default 24 hours). This middleware is useful when implementing a password reset functionality.

Example:

```js
const CreateResetToken = plugin.CreateResetToken;

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const resetToken = await CreateResetToken(user.id);
    // send the reset token to the user's email
  }

  res.sendStatus(200);
});
```

## Contribute

We welcome contributions from the community! Here are some ways you can help improve restful-auth:

- Submit bugs and feature requests: Please use the [GitHub issue tracker](https://github.com/Mihai925/restful-auth/issues) to report any bugs or request new features.
- Review pull requests: We appreciate any feedback and review of pull requests submitted by the community.
- Write code: If you'd like to contribute code, please fork the repository and submit a pull request with your changes. Please ensure that your code adheres to the existing code style and passes the tests.
- Improve documentation: If you find any mistakes or omissions in the documentation, please submit an issue or a pull request to help us improve it.
- Spread the word: If you like restful-auth, please help us spread the word! Share the project with your friends and colleagues or give us a star on GitHub.

We are grateful for any contributions and appreciate the time and effort of the community in making restful-auth better for everyone.