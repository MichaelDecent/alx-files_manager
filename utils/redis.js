#!/usr/bin/node

const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = createClient();
    this.connected = false;

    this.client
      .on('error', (err) => console.log(err))
      .on('connect', () => {
        this.connected = true;
      });
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    try {
      const value = await asyncGet(key);
      return value;
    } catch (error) {
      return error;
    }
  }

  async set(key, value, duration) {
    const asyncSet = promisify(this.client.set).bind(this.client);

    try {
      await asyncSet(key, value, 'EX', duration);
    } catch (error) {
      console.error(error);
    }
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);

    try {
      await asyncDel(key);
    } catch (error) {
      console.error(error);
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
