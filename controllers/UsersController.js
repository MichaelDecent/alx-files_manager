#!/usr/bin/node

const dbClient = require('../utils/db');

class UserController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      response.end();
      return;
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      response.end();
      return;
    }

    const checkEmail = await dbClient.checkExistingEmail(email);

    if (checkEmail) {
      response.status(400).json({ error: 'Already exists' });
      response.end();
      return;
    }

    const newUser = await dbClient.createUser(email, password);
    if (!newUser) {
      response.status(500).json({ error: 'Failed to create new user' });
      response.end();
      return;
    }
    response.status(201).json({ id: newUser.insertedId, email });
    response.end();
  }
}

module.exports = UserController;
