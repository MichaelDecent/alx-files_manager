#!/usr/bin/node
const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    this.db = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });

    this.connected = false;
    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    try {
      await this.client.connect();
      const usersCount = await this.client.db(this.db).collection('users').countDocuments();
      return usersCount;
    } catch (error) {
      console.error('Error counting documents in users collection:', error);
      return null;
    }
  }

  async nbFiles() {
    try {
      await this.client.connect();
      const filesCount = await this.client.db(this.db).collection('files').countDocuments();
      return filesCount;
    } catch (error) {
      console.error('Error counting documents in users collection:', error);
      return null;
    }
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
