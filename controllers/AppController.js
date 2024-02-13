#!/usr/bin/node

const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static getStatus(request, response) {
    if (dbClient.isAlive() && redisClient.isAlive()) {
      response
        .status(200)
        .json({ redis: true, db: true })
        .end();
    }
  }

  static async getStats(request, response) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();
    response
      .status(200)
      .json({ users: usersCount, files: filesCount })
      .end();
  }
}

module.exports = AppController;