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

## Contribute